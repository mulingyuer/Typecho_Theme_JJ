/*
 * @Author: mulingyuer
 * @Date: 2022-03-06 23:50:28
 * @LastEditTime: 2022-03-13 04:30:26
 * @LastEditors: mulingyuer
 * @Description: 首页入口
 * @FilePath: \Typecho_Theme_JJ\src\pages\home\index.ts
 * 怎么可能会有bug！！！
 */
import EventProxy from "@packages/event-proxy";
import test from "./test";

const fn = () => {
  console.log("我运行了1", test);
  //移除
  EventProxy.removeEventListener(document.documentElement, "click", fn);
};

EventProxy.addEventListener(document.documentElement, "click", fn);
EventProxy.addEventListener(document.documentElement, "click", fn);
EventProxy.addEventListener(document.documentElement, "click", fn);
