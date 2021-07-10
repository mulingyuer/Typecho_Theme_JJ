/*
 * @Author: mulingyuer
 * @Date: 2021-07-03 17:50:36
 * @LastEditTime: 2021-07-10 17:02:32
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