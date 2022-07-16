import { track, trigger, TriggerType } from "./deps";
import effect from "./effect";

const computed = <T extends Fn>(getter: T): { value: ReturnType<T>} => {
    let value: ReturnType<T>;
    let dirty = true;
    const effectFn = effect(getter, {
        lazy: true,
        scheduler() {
            if (!dirty) {
                dirty = true;
                trigger(obj, 'value', TriggerType.SET);
            }
        }
    });
    const obj = {
        get value() {
            if (dirty) {
                value = effectFn();
                dirty = false;
            }
            track(obj, 'value');
            return value;
        }
    }
    return obj;
}


export default computed;