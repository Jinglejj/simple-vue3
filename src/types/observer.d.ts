type Bucket = WeakMap<any, Map<Key, Set<Effect>>>;

type EffectOptions = {
    scheduler?: (fn: Function) => void;
    lazy?: boolean;
}
type Effect = Function & { deps: Set<Function>[], options: EffectOptions };