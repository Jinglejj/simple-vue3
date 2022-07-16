import { equal, hasOwnProperty } from "@/util";
import { ITERATE_KEY, track, trigger, TriggerType } from ".";


type Object = object & { [key: string | symbol]: any };


const reactive = <T extends Object>(obj: T) => {
    return new Proxy(obj, {
        get(target, key, receiver) {
            track(target, key);
            return Reflect.get(target, key, receiver);
        },
        set(target, key, newValue, receiver) {
            const oldValue = target[key];
            //判断是新增属性还是修改属性值
            const type = hasOwnProperty(target, key) ? TriggerType.SET : TriggerType.ADD;

            const res = Reflect.set(target, key, newValue, receiver);

            //值发生变化时才触发副作用函数
            if (!equal(oldValue, newValue)) {
                trigger(target, key, type);
            }

            return res;
        },
        // 拦截 for...in
        ownKeys(target) {
            track(target, ITERATE_KEY);
            return Reflect.ownKeys(target);
        },
        deleteProperty(target, key) {
            const hasKey = hasOwnProperty(target, key);
            const res = Reflect.deleteProperty(target, key);
            if (res && hasKey) {
                trigger(target, key, TriggerType.DELETE);
            }
            return res;
        }
    });
}

export default reactive;