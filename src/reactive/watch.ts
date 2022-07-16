import { isFunction, isNull, isObject } from "@/util";
import effect from "./effect";

/**
 * 递归访问一个响应式数据内的所有属性
 * @param value 响应式数据 
 * @param seen  访问过属性的集合
 */
const traverse = (value: Obj, seen = new Set<object>()) => {
    if (!isObject(value) || isNull(value) || seen.has(value)) {
        return;
    }
    seen.add(value);
    for (const key in value) {
        traverse(value[key], seen);
    }
    return value;
}

type Callback = (oldValue: unknown, newValue: unknown, onInvalidate?: (fn: Fn) => void) => void;

const watch = (source: Fn & unknown, cb: Callback, options?: WatchOptions) => {
    const { immdiate } = options ?? {};
    let getter: Fn;

    if (isFunction(source)) {
        getter = source;
    } else {
        getter = () => traverse(source);
    }

    let oldValue: unknown, newValue: unknown;
    let cleanup: Fn;


    function onInvalidate(fn: Fn) {
        cleanup = fn;
    }

    const job = () => {
        newValue = effectFn();
        if (cleanup) {
            cleanup()
        }
        cb(oldValue, newValue, onInvalidate);
        oldValue = newValue;
    }

    const effectFn = effect(() => getter(), {
        lazy: true,
        scheduler: () => {
            if (options?.flush === 'post') {
                const p = Promise.resolve();
                p.then(job)
            } else {
                job();
            }
        }
    })


    if (immdiate) {
        job();
    } else {
        oldValue = effectFn();
    }
}

export default watch;