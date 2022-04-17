/*
 * @Author: mulingyuer
 * @Date: 2022-03-28 22:35:01
 * @LastEditTime: 2022-04-16 22:56:06
 * @LastEditors: mulingyuer
 * @Description: 通用工具
 * @FilePath: \Typecho_Theme_JJ\packages\shared\index.ts
 * 怎么可能会有bug！！！
 */

/**
 * @description: 是否是一个对象
 * @param {any} obj
 * @Date: 2022-03-31 23:29:57
 * @Author: mulingyuer
 */
export function isObject(obj: any): boolean {
  return typeof obj === "object" && obj !== null;
}

/**
 * @description: 通用合并对象方法
 * @param {*} target 目标对象
 * @param {array} args 被合并对象的数组
 * @Date: 2022-04-04 02:54:32
 * @Author: mulingyuer
 */
export function extend(target: object, ...args: object[]) {
  return Object.assign(target, ...args);
}

/**
 * @description: 是否为字符串
 * @param {unknown} val
 * @Date: 2022-04-04 22:22:59
 * @Author: mulingyuer
 */
export function isString(val: unknown): val is string {
  return typeof val === "string";
}

/**
 * @description: 是否为数组
 * @param {*}
 * @Date: 2022-04-04 22:18:40
 * @Author: mulingyuer
 */
export const isArray = Array.isArray;

/**
 * @description: 是否为整数key，用于数组key的判断
 * @param {unknown} key
 * @Date: 2022-04-04 22:23:08
 * @Author: mulingyuer
 */
export function isIntegerKey(key: unknown) {
  return isString(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
}

/**
 * @description: 对象是否修改过
 * @param {*} val 新对象
 * @param {*} oldVal 原对象
 * @Date: 2022-04-04 22:27:04
 * @Author: mulingyuer
 */
export function hasChanged(newVal: any, oldVal: any) {
  return !Object.is(newVal, oldVal);
}

/**
 * @description: 对象是否存在该属性
 * @param {any} target 目标对象
 * @param {unknown} key
 * @Date: 2022-04-04 22:29:17
 * @Author: mulingyuer
 */
export function hasOwn(target: any, key: string) {
  return Object.prototype.hasOwnProperty.call(target, key);
}

/**
 * @description: 是否为函数
 * @param {unknown} val
 * @Date: 2022-04-05 05:09:07
 * @Author: mulingyuer
 */
export function isFunction(val: unknown): val is Function {
  return typeof val === "function";
}

/**
 * @description: 是否为symbol
 * @param {Symbol} val
 * @Date: 2022-04-11 23:23:17
 * @Author: mulingyuer
 */
export function isSymbol(val: unknown): val is Symbol {
  return typeof val === "symbol";
}

/**
 * @description: 是否是数字
 * @param {unknown} val
 * @Date: 2022-04-16 22:56:08
 * @Author: mulingyuer
 */
export function isNumber(val: unknown): val is number {
  return typeof val === "number";
}
