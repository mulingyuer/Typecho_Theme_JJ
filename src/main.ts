/*
 * @Author: mulingyuer
 * @Date: 2022-12-18 19:22:40
 * @LastEditTime: 2023-03-17 08:08:17
 * @LastEditors: mulingyuer
 * @Description: 通用入口文件
 * @FilePath: \Typecho_Theme_JJ\src\main.ts
 * 怎么可能会有bug！！！
 */
import "@/store/install";
import { useDataStore } from "@/store/data";

//css
import "@/styles/reset.scss";
import "@/styles/fonts/iconfont.css";

//modules
import "@/modules/header/header.ts";

//监听scroll事件，记录滚动条位置
const dataStore = useDataStore();
function updateScrollY() {
  dataStore.setScrollY(document.documentElement.scrollTop || document.body.scrollTop);
}
updateScrollY();
window.addEventListener("scroll", updateScrollY);

//监听resize事件，记录窗口大小
function updateWindowSize() {
  dataStore.setWindowWidth(window.innerWidth);
  dataStore.setWindowHeight(window.innerHeight);
}
updateWindowSize();
window.addEventListener("resize", updateWindowSize);
