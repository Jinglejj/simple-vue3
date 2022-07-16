type Key = string | symbol;
type Bucket = WeakMap<unknown, Map<Key, Set<Effect>>>;

type EffectOptions = {
    /**
     * 调度函数
     */
    scheduler?: (fn: Fn) => void;
    /**
     * 是否立即执行副作用函数，computed需要用到这个属性
     */
    lazy?: boolean;
}

type Effect = Fn & { deps: Set<Effect>[], options: EffectOptions };

type WatchOptions = {
    immdiate?: boolean;
    flush?: 'pre' | 'post' | 'sync';
}