/*
 * @Author: mulingyuer
 * @Date: 2022-12-18 23:34:05
 * @LastEditTime: 2023-03-14 17:21:59
 * @LastEditors: mulingyuer
 * @Description:
 * @FilePath: \webpack-multiple-entry\src\pages\post\index.ts
 * 怎么可能会有bug！！！
 */
import "./style.scss";

const map: Map<string, string> = new Map();
map.set("段子1", "全面放开二胎以后……某学生在学校犯错误了，老师让其把家长叫来，学生说家长不在家，舅舅可以么?老师说行。第二天，他背上刚满周岁的小舅奔向学校……");
map.set("段子2", "名花虽有主,我来松松土!");
map.set("段子3", "世界上最浪漫的事，就是白日做梦。");

let htmlText = "";
for (let [key, value] of map) {
  htmlText += `<div><h3>${key}</h3><p>${value}</p></div>`;
}
const div = document.createElement("div");
div.innerHTML = htmlText;

document.body.appendChild(div);
