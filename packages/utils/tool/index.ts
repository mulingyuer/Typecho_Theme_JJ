/*
 * @Author: mulingyuer
 * @Date: 2022-04-11 23:16:24
 * @LastEditTime: 2022-04-11 23:38:22
 * @LastEditors: mulingyuer
 * @Description: tool
 * @FilePath: \Typecho_Theme_JJ\packages\utils\tool\index.ts
 * 怎么可能会有bug！！！
 */
import { isSymbol } from "@packages/shared";

/**
 * @description: 获取对象key排序后的数组
 * @param {object} val 参数对象
 * @Date: 2022-04-11 23:20:33
 * @Author: mulingyuer
 */
export function objectSortKeys(val: object) {
  const keysArr = Reflect.ownKeys(val);
  return keysArr.sort((a, b) => {
    const compareA = isSymbol(a) ? a.toString() : a;
    const compareB = isSymbol(b) ? b.toString() : b;
    return compareA.localeCompare(compareB);
  });
}

/**
 * @description: 排序后的对象
 * @param {object} val
 * @Date: 2022-04-11 23:28:32
 * @Author: mulingyuer
 */
export function sortByObject(val: object) {
  const keys = objectSortKeys(val);
  const newObj = {};
  keys.forEach((key) => {
    Reflect.set(newObj, key, val[key]);
  });

  return newObj;
}
