type Key = string | symbol;
type Bucket = WeakMap<any, Map<Key, Set<Effect>>>;

type EffectOptions = {
    /**
     * 调度函数
     */
    scheduler?: (fn: Function) => void;
    /**
     * 是否立即执行副作用函数，computed需要用到这个属性
     */
    lazy?: boolean;
}

type Effect = Function & { deps: Set<Function>[], options: EffectOptions };

type WatchOptions = {
    immdiate?: boolean;
    flush?: 'pre' | 'post' | 'sync';
}