/*
 * @Author: mulingyuer
 * @Date: 2021-07-03 17:50:36
 * @LastEditTime: 2021-07-24 19:45:32
 * @LastEditors: mulingyuer
 * @Description: 工具
 * @FilePath: \JJ\src\utils\tool.js
 * 怎么可能会有bug！！！
 */

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
  if (el.classList.contains(className)) {
    return el;
  } else {
    let parent = el.parentNode;
    while (parent) {
      if (parent.classList.contains(className)) {
        return parent;
      }
      parent = parent.parentNode;
    }
  }
}
