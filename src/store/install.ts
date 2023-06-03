/*
 * @Author: mulingyuer
 * @Date: 2023-03-15 19:44:20
 * @LastEditTime: 2023-03-15 19:44:20
 * @LastEditors: mulingyuer
 * @Description: 安装pinia
 * @FilePath: \Typecho_Theme_JJ\src\store\install.ts
 * 怎么可能会有bug！！！
 */
import { createApp } from "vue";
import { createPinia } from "pinia";

const pinia = createPinia();
const app = createApp({
	render() {}
});
app.use(pinia);
//用一个dom元素挂载app，但是dom不显示
app.mount(document.createElement("div"));
