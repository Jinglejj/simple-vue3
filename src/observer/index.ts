import { activeEffect } from "./effect";

type Key = string | symbol;
const bucket: Bucket = new WeakMap();

const data: Record<Key, any> = {
    count: 1,
    foo: 1,
    get bar() {
        return this.foo;
    },
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

export const trigger = (target: Record<Key, any>, key: Key) => {
    const depsMap = bucket.get(target);
    if (!depsMap) return true;
    const effects = depsMap.get(key);
    // TODO:
    const effectToRun = new Set<Effect>();
    effects && effects.forEach(effectFn => {
        if (effectFn !== activeEffect) {
            effectToRun.add(effectFn);
        }
    });
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
    set(target, key, newValue) {
        target[key] = newValue;
        trigger(target, key);
        return true;
    }
})