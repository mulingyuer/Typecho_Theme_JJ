/*
 * @Author: mulingyuer
 * @Date: 2023-03-15 19:54:42
 * @LastEditTime: 2023-03-26 09:39:58
 * @LastEditors: mulingyuer
 * @Description: 工具函数
 * @FilePath: \Typecho_Theme_JJ\src\utils\tool.ts
 * 怎么可能会有bug！！！
 */

/** 防抖函数 */
export function debounce(fn: Function, delay: number) {
  let timer: any = null;
  return function (...args: any[]) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

/** 节流函数 */
export function throttle(fn: Function, delay: number) {
  let timer: any = null;
  return function (...args: any[]) {
    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(this, args);
        timer = null;
      }, delay);
    }
  };
}
