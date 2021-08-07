/*
 * @Author: mulingyuer
 * @Date: 2021-07-03 17:50:36
 * @LastEditTime: 2021-08-08 04:12:16
 * @LastEditors: mulingyuer
 * @Description: 工具
 * @FilePath: \JJ\src\utils\tool.js
 * 怎么可能会有bug！！！
 */
import { faceData } from "@/api/face";

//判断数据类型
export function getType(value) {
  let type = typeof value;
  if (type !== "object") {
    return type;
  }
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
};


//页面是否加载完毕
export function ready(fn) {
  if (document.readyState !== 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}


//获取指定的class的父元素或者自身
export function specifyParentClass(className, el) {
  let parent = el;
  while (parent) {
    if (parent.classList.contains(className)) {
      return parent;
    }
    parent = parent.parentNode;
  }

}


//获取表情数据：缓存||api
export async function getFaceData() {
  try {
    //先读取缓存
    if (localStorage.getItem("face")) {
      const arr = localStorage.getItem("face");
      return JSON.parse(arr);
    } else {
      //api请求
      const res = await faceData();
      if (res) localStorage.setItem("face", JSON.stringify(res));
      return res;
    }
  } catch (error) {
    throw error;
  }
}