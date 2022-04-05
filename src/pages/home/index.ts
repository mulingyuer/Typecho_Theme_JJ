/*
 * @Author: mulingyuer
 * @Date: 2022-03-06 23:50:28
 * @LastEditTime: 2022-04-05 18:47:47
 * @LastEditors: mulingyuer
 * @Description: 首页入口
 * @FilePath: \Typecho_Theme_JJ\src\pages\home\index.ts
 * 怎么可能会有bug！！！
 */
import "./tests.scss";
import { reactive } from "@packages/reactivity";
import ZIndexManager from "@packages/zIndexManager";

const a = reactive({ a: 1 });

console.log(a);

const index = ZIndexManager.getInstance();

console.log(index.getZIndex());
console.log(index.nextZIndex());
console.log(index.getZIndex());
