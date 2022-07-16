import { hasOwnProperty } from "@/util";
import { activeEffect } from "./effect";

type Key = string | symbol;
enum TriggerType {
    SET = 'SET',
    ADD = 'ADD',
}
const bucket: Bucket = new WeakMap();

const ITERATE_KEY = Symbol();

const data: Record<Key, any> = {
    count: 1,
    foo: 2,
    bar: 3,
    ok: true,
    text: 'Hello Vue'
}



export const track = (target: Record<Key, any>, key: Key) => {
    if (!activeEffect) {
        return target[key];
    }
    let depsMap = bucket.get(target);
    if (!depsMap) {
        bucket.set(target, depsMap = new Map());
    }
    let deps = depsMap.get(key);
    if (!deps) {
        depsMap.set(key, deps = new Set());
    }
    deps.add(activeEffect);
    activeEffect.deps.push(deps);
}

export const trigger = (target: Record<Key, any>, key: Key, type: TriggerType) => {
    const depsMap = bucket.get(target);
    if (!depsMap) return true;
    const effects = depsMap.get(key);

    // TODO:
    const effectToRun = new Set<Effect>();
    effects?.forEach(effectFn => {
        if (effectFn !== activeEffect) {
            effectToRun.add(effectFn);
        }
    });

    console.log(type,key)
    if (type === TriggerType.ADD) {
        // 添加属性时，执行与 ITERATE_KEY 相关联的副作用函数。
        const iterateEffect = depsMap.get(ITERATE_KEY);
        iterateEffect?.forEach(effectFn => {
            if (effectFn !== activeEffect) {
               effectToRun.add(effectFn);
            }
        })
    }


    effectToRun.forEach(effectFn => {
        if (effectFn.options?.scheduler) {
            effectFn.options.scheduler(effectFn);
        } else {
            effectFn();
        }
    })
}

export const obj = new Proxy(data, {
    get(target, key, receiver) {
        track(target, key);
        return Reflect.get(target, key, receiver);
    },
    set(target, key, newValue, receiver) {
        //判断是新增属性还是修改属性值
        const type = hasOwnProperty(target, key) ? TriggerType.SET : TriggerType.ADD;

        const res = Reflect.set(target, key, newValue, receiver);
        trigger(target, key, type);
        return res;
    },
    // 拦截 for...in
    ownKeys(target) {
        track(target, ITERATE_KEY);
        return Reflect.ownKeys(target);
    }
})