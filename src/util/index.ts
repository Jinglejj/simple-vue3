export const isObject = (val: unknown) => typeof val === 'object'

export const isNull = (val: unknown) => val === null;

export const isFunction = (val: unknown) => typeof val === 'function';

/**
 * 通过属性名判断一个属性是否为对象原来已有的属性
 * @param val 
 * @param key 
 * @returns 
 */
export const hasOwnProperty = (val: unknown, key: string | symbol) => Object.prototype.hasOwnProperty.call(val, key);

/**
 * 判断两个值是否相等
 * @param a 
 * @param b 
 */
export const equal = (a: unknown, b: unknown) => {
    // 区分+0和-0
    if (a === b) {
        return a !== 0 || 1 / a === 1 / (b as number);
    }
    // 判断NaN
    if (a !== a) {
        return b !== b;
    }
    return a === b;
}