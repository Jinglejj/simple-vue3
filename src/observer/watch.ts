import { isFunction, isNull, isObject } from "@/util";
import effect from "./effect";

/**
 * 递归访问一个响应式数据内的所有属性
 * @param value 响应式数据 
 * @param seen  访问过属性的集合
 */
const traverse = (value: any, seen = new Set()) => {
    if (!isObject(value) || isNull(value) || seen.has(value)) {
        return;
    }
    seen.add(value);
    for (const key in value) {
        traverse(value[key], seen);
    }
    return value;
}

const watch = (source: any, cb: (oldValue: any, newValue: any) => void, options?: WatchOptions) => {
    const { immdiate } = options ?? {};
    let getter: Function;

    if (isFunction(source)) {
        getter = source;
    } else {
        getter = () => traverse(source);
    }

    let oldValue: any, newValue: any;

    const job = () => {
        newValue = effectFn();
        cb(oldValue, newValue);
        oldValue = newValue;
    }

    const effectFn = effect(() => getter(), {
        lazy: true,
        scheduler: job
    })


    if (immdiate) {
        job();
    } else {
        oldValue = effectFn();
    }
}

export default watch;