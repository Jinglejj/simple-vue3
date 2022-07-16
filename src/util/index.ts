export const isObject = (val: any) => typeof val === 'object'

export const isNull = (val: any) => val === null;

export const isFunction = (val: any) => typeof val === 'function';

/**
 * 通过属性名判断一个属性是否为对象原来已有的属性
 * @param val 
 * @param key 
 * @returns 
 */
export const hasOwnProperty = (val: any, key: string | symbol) => Object.prototype.hasOwnProperty.call(val, key);

/**
 * 判断两个值是否相等
 * @param a 
 * @param b 
 */
export const equal = (a: any, b: any) => {
    // 区分+0和-0
    if (a === b) {
        return a !== 0 || 1 / a === 1 / b;
    }
    // 判断NaN
    if (a !== a) {
        return b !== b;
    }
    return a === b;
}