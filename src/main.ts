/*
 * @Author: mulingyuer
 * @Date: 2022-12-18 19:22:40
 * @LastEditTime: 2026-09-27 19:13:58
 * @LastEditors: mulingyuer
 * @Description: 通用入口文件
 * @FilePath: \Typecho_Theme_JJ\src\main.ts
 * 怎么可能会有bug！！！
 */
import { dataStore } from "@/store/data";
import asciiEmoji from "@/utils/ascii";
import { initGlobalImgLoadError } from "@/utils/error";
import { createApp } from "vue";
import App from "@/modules/spa/App.vue";

//style
import "@/styles/index.scss";
import "simplebar/dist/simplebar.css";
import "element-plus/es/components/config-provider/style/css";
import "element-plus/es/components/message/style/css";

//modules
import "@/modules/header";
import "@/modules/fixed-tool";

//错误处理
initGlobalImgLoadError();

//监听scroll事件，记录滚动条位置
function updateScrollY() {
  dataStore.scrollY =
    document.documentElement.scrollTop || document.body.scrollTop;
}
updateScrollY();
window.addEventListener("scroll", updateScrollY);

//监听resize事件，记录窗口大小
function updateWindowSize() {
  dataStore.windowWidth = window.innerWidth;
  dataStore.windowHeight = window.innerHeight;
}
updateWindowSize();
window.addEventListener("resize", updateWindowSize);

//ascii
if (import.meta.env.PROD) {
  asciiEmoji();
}

// spa初始化
async function init() {
  const el = document.createElement("div");
  document.body.appendChild(el);
  createApp(App).mount(el);
}
init();
