type Key = string | symbol;
type EffectOptions = {
    scheduler?: (fn: Function) => void;
    lazy?: boolean;
}
type Effect = Function & { deps: Set<Function>[], options: EffectOptions };
type Bucket = WeakMap<any, Map<Key, Set<Effect>>>;
const bucket: Bucket = new WeakMap();

const data: Record<Key, any> = {
    count: 1,
    foo: 1,
    bar: 2,
    ok: true,
    text: 'Hello Vue'
}


const cleanup = (effectFn: Effect) => {
    for (let i = 0; i < effectFn.deps.length; i++) {
        const deps = effectFn.deps[i];
        deps.delete(effectFn);
    }
    effectFn.deps.length = 0;
}


let activeEffect: Effect;

let effectStack: Effect[] = [];

export const effect = (fn: Function, options: EffectOptions = {}) => {
    const { scheduler } = options;
    const effectFn: Effect = () => {
        cleanup(effectFn);
        activeEffect = effectFn;
        effectStack.push(effectFn);
        const res = fn();
        effectStack.pop();
        activeEffect = effectStack[effectStack.length - 1];
        return res;
    }
    effectFn.options = options;
    effectFn.deps = [];
    if (!options.lazy) {
        effectFn();
    }
    return effectFn;
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
    get(target, key) {
        track(target, key);
        return target[key];
    },
    set(target, key, newValue) {
        target[key] = newValue;
        trigger(target, key);
        return true;
    }
})