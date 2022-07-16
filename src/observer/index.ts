import { equal, hasOwnProperty } from "@/util";
import { activeEffect } from "./effect";

export enum TriggerType {
    SET = 'SET',
    ADD = 'ADD',
    DELETE = 'DELETE'
}
const bucket: Bucket = new WeakMap();

export const ITERATE_KEY = Symbol();


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

    console.log(type, key)
    if (type === TriggerType.ADD || type === TriggerType.DELETE) {
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