type EffectOptions = {
    scheduler?: (fn: Fn) => void;
    lazy?: boolean;
}
type Effect = Fn & { deps: Set<Effect>[], options: EffectOptions };

const cleanup = (effectFn: Effect) => {
    for (let i = 0; i < effectFn.deps.length; i++) {
        const deps = effectFn.deps[i];
        deps.delete(effectFn);
    }
    effectFn.deps.length = 0;
}

export let activeEffect: Effect;

const effectStack: Effect[] = [];

const effect = (fn: Fn, options: EffectOptions = {}) => {
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

export default effect;