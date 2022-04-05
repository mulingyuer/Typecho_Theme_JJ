/*
 * @Author: mulingyuer
 * @Date: 2022-04-05 04:53:34
 * @LastEditTime: 2022-04-05 16:58:55
 * @LastEditors: mulingyuer
 * @Description:watch
 * @FilePath: \Typecho_Theme_JJ\packages\reactivity\watch.ts
 * 怎么可能会有bug！！！
 */
import { isRef, RefImpl } from "./ref";
import { effect } from "./effect";
import { hasChanged, isFunction } from "@packages/shared";

/**
 * @description: watch
 * @param {any} target 目标对象
 * @param {Function} fn 回调函数
 * @param {*} options 配置
 * @Date: 2022-04-05 05:13:17
 * @Author: mulingyuer
 */
export function watch(target: any, fn: Function, options = { immediate: false }) {
  if (isRef(target)) {
    refWatch(target, fn, options);
  } else if (isFunction(target)) {
    functionWtch(target, fn, options);
  } else {
    console.warn(`无法对一个非Ref对象或者响应式对象监听！`);
  }
}

/**
 * @description: ref对象监听
 * @param {any} target 目标对象
 * @param {Function} fn 回调函数
 * @param {*} options 配置
 * @Date: 2022-04-05 05:16:44
 * @Author: mulingyuer
 */
function refWatch(target: RefImpl, fn: Function, options = { immediate: false }) {
  let oldVal = target.value;
  //是否首次触发
  if (options && options.immediate) {
    fn(oldVal);
  }
  //触发effect
  effect(() => {
    const newVal = target.value;
    if (hasChanged(newVal, oldVal)) {
      fn(newVal, oldVal);
      oldVal = newVal;
    }
  });
}

/**
 * @description: 函数式对象监听
 * @param {Function} target 目标对象
 * @param {Function} fn 回调函数
 * @param {*} options 配置
 * @Date: 2022-04-05 05:18:11
 * @Author: mulingyuer
 */
function functionWtch(target: Function, fn: Function, options = { immediate: false }) {
  let oldVal = target();
  if (options && options.immediate) {
    fn(oldVal);
  }
  effect(() => {
    const newVal = target();
    if (hasChanged(newVal, oldVal)) {
      fn(newVal, oldVal);
      oldVal = newVal;
    }
  });
}
