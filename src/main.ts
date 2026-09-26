/*
 * @Author: mulingyuer
 * @Date: 2022-12-18 19:22:40
 * @LastEditTime: 2024-04-21 00:13:54
 * @LastEditors: mulingyuer
 * @Description: 通用入口文件
 * @FilePath: /Typecho_Theme_JJ/src/main.ts
 * 怎么可能会有bug！！！
 */
import { dataStore } from "@/store/data";
import asciiEmoji from "@/utils/ascii";
import { initGlobalImgLoadError } from "@/utils/error";

//css
import "@/styles/reset.scss";
import "@/styles/layout.scss";

// plugins
import "@/plugins/simplebar";

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
