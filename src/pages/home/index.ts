/*
 * @Author: mulingyuer
 * @Date: 2022-03-06 23:50:28
 * @LastEditTime: 2022-03-07 01:31:03
 * @LastEditors: mulingyuer
 * @Description: 首页入口
 * @FilePath: \Typecho_Theme_JJ\src\pages\home\index.ts
 * 怎么可能会有bug！！！
 */
import "./test.css";
import "./tests.scss";

console.log("home");
// Promise调用
Promise.resolve().then((res) => {
  console.log(res, "add");
});

const defaults = {
  fontSize: "10px",
};

// 扩展运算符
const styles = {
  ...defaults,
  color: "#f5da55",
};

console.log(styles);

// 模板字符串
const textDom = document.querySelector("#text");
textDom?.setAttribute(
  "style",
  `color:${styles.color}; font-size:${styles.fontSize}`
);
