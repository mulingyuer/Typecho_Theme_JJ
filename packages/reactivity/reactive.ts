/*
 * @Author: mulingyuer
 * @Date: 2022-03-31 23:19:21
 * @LastEditTime: 2022-04-05 16:58:48
 * @LastEditors: mulingyuer
 * @Description: reactive
 * @FilePath: \Typecho_Theme_JJ\packages\reactivity\reactive.ts
 * 怎么可能会有bug！！！
 */
import { isObject } from "@packages/shared";
import { mutableHandlers, shallowReactiveHandlers, readonlyHandlers, shallowReadonlyHandlers } from "./baseHandlers";

export function reactive(target: object): any {
  return createReactiveObject(target, false, mutableHandlers);
}

export function shallowReactive(target: object) {
  return createReactiveObject(target, false, shallowReactiveHandlers);
}

export function readOnly(target: object) {
  return createReactiveObject(target, true, readonlyHandlers);
}

export function shallowReadOnly(target: object) {
  return createReactiveObject(target, true, shallowReadonlyHandlers);
}

//缓存
const reactiveMap = new WeakMap(); //响应式对象缓存
const readonlyMap = new WeakMap(); //只读式对象缓存
/**
 * @description: 创建代理对象
 * @param {*} target 目标对象
 * @param {*} isReadOnly 是否只读
 * @param {*} baseHandlers 基础处理器
 * @Date: 2022-04-04 02:12:14
 * @Author: mulingyuer
 */
function createReactiveObject(target: object, isReadOnly: boolean, baseHandlers: ProxyHandler<any>) {
  if (!isObject(target)) return target;

  //缓存读取
  const proxyMap = isReadOnly ? readonlyMap : reactiveMap;
  const existProxy = proxyMap.get(target);
  if (existProxy) {
    return existProxy;
  }
  //新创建
  const proxy = new Proxy(target, baseHandlers);
  proxyMap.set(target, proxy);

  return proxy;
}

interface ProxyHandler<T extends object> {
  apply?(target: T, thisArg: any, argArray: any[]): any;
  construct?(target: T, argArray: any[], newTarget: Function): object;
  defineProperty?(target: T, p: string | symbol, attributes: PropertyDescriptor): boolean;
  deleteProperty?(target: T, p: string | symbol): boolean;
  get?(target: T, p: string | symbol, receiver: any): any;
  getOwnPropertyDescriptor?(target: T, p: string | symbol): PropertyDescriptor | undefined;
  getPrototypeOf?(target: T): object | null;
  has?(target: T, p: string | symbol): boolean;
  isExtensible?(target: T): boolean;
  ownKeys?(target: T): ArrayLike<string | symbol>;
  preventExtensions?(target: T): boolean;
  set?(target: T, p: string | symbol, value: any, receiver: any): boolean;
  setPrototypeOf?(target: T, v: object | null): boolean;
}
