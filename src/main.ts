/*
 * @Author: mulingyuer
 * @Date: 2022-12-18 19:22:40
 * @LastEditTime: 2023-06-04 17:06:04
 * @LastEditors: mulingyuer
 * @Description: 通用入口文件
 * @FilePath: \Typecho_Theme_JJ\src\main.ts
 * 怎么可能会有bug！！！
 */
import "@/store/install";
import { useDataStore } from "@/store/data";
import asciiEmoji from "@/utils/ascii";
import { initGlobalImgLoadError } from "@/utils/error";

//css
import "@/styles/reset.scss";
import "@/styles/fonts/iconfont.css";
import "@/styles/layout.scss";

//modules
import "@/modules/header";
import "@/modules/fixed_tool";

//错误处理
initGlobalImgLoadError();

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

//ascii
asciiEmoji();
