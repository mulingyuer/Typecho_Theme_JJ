/*
 * @Author: mulingyuer
 * @Date: 2022-12-18 19:22:40
 * @LastEditTime: 2023-03-15 18:39:00
 * @LastEditors: mulingyuer
 * @Description: 通用入口文件
 * @FilePath: \Typecho_Theme_JJ\src\main.ts
 * 怎么可能会有bug！！！
 */
import { createApp } from "vue";
import { createPinia } from "pinia";
import { useDataStore } from "@/store/data";

// 创建pinia实例
const pinia = createPinia();

// 创建app实例
const app = createApp({
  render() {},
});
app.use(pinia);
//用一个dom元素挂载app，但是dom不显示
app.mount(document.createElement("div"));

//监听scroll事件，记录滚动条位置
const dataStore = useDataStore();
function updateScrollY() {
  dataStore.setScrollY(document.documentElement.scrollTop || document.body.scrollTop);
}
updateScrollY();
window.addEventListener("scroll", updateScrollY);
