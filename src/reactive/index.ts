import { equal, hasOwnProperty, isNull,isObject } from "@/util";
import { ITERATE_KEY, track, trigger, TriggerType } from "./deps";


const reactive = <T extends Obj>(obj: T) => {
    return createReactive(obj)
}

export const shallowReactive = <T extends Obj>(obj: T) => {
    return createReactive(obj, true);
}

export const readonly = <T extends Obj>(obj: T) => {
    return createReactive(obj, false, true);
}

export const shallowReadonly = <T extends Obj>(obj: T) => {
    return createReactive(obj, true, true);
}

export default reactive;


function createReactive<T extends Obj >(obj: T, isShallow = false, isReadOnly = false): T {
    return new Proxy(obj, {
        get(target, key, receiver) {
            // 通过raw获取原始数据
            if (key === 'raw') {
                return target;
            }

            // 只读对象不需要响应式
            if (!isReadOnly) {
                track(target, key);
            }

            const res = Reflect.get(target, key, receiver);

            // 浅响应
            if (isShallow) {
                return res;
            }

            // 判断属性是否为对象，如果为对象的话递归将该属性设置为响应式
            if (!isNull(res) && isObject(res)) {
                return isReadOnly ? readonly(res) : reactive(res);
            }

            return res;
        },
        set(target, key, newValue, receiver) {

            if (isReadOnly) {
                console.warn(`【${key.toString()}} is readonly】`);
                return true;
            }

            const oldValue = target[key];
            //判断是新增属性还是修改属性值
            const type = hasOwnProperty(target, key) ? TriggerType.SET : TriggerType.ADD;

            const res = Reflect.set(target, key, newValue, receiver);

            // receiver是当前target的代理对象时，判断是否需要触发更新
            if (receiver.raw === target) {
                //值发生变化时才触发副作用函数
                if (!equal(oldValue, newValue)) {
                    trigger(target, key, type);
                }
            }
            return res;
        },
        // 拦截 for...in
        ownKeys(target) {
            track(target, ITERATE_KEY);
            return Reflect.ownKeys(target);
        },
        deleteProperty(target, key) {

            if (isReadOnly) {
                console.warn(`【${key.toString()}} is readonly】`);
                return true;
            }

            const hasKey = hasOwnProperty(target, key);
            const res = Reflect.deleteProperty(target, key);
            if (res && hasKey) {
                trigger(target, key, TriggerType.DELETE);
            }
            return res;
        }
    });
}