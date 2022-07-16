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