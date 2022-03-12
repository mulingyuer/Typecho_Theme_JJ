/*
 * @Author: mulingyuer
 * @Date: 2022-03-13 04:28:29
 * @LastEditTime: 2022-03-13 04:30:03
 * @LastEditors: mulingyuer
 * @Description:
 * @FilePath: \Typecho_Theme_JJ\src\pages\home\test.ts
 * 怎么可能会有bug！！！
 */
import EventProxy from "@packages/event-proxy";

const fn = () => {
  console.log("我运行了2");
  //移除
  // EventProxy.removeEventListener(document.documentElement, "click", fn);
};

EventProxy.addEventListener(document.documentElement, "click", fn);
EventProxy.addEventListener(document.documentElement, "click", fn);
EventProxy.addEventListener(document.documentElement, "click", fn);

export default {};
