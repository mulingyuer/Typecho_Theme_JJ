/*
 * @Author: mulingyuer
 * @Date: 2023-03-15 16:56:16
 * @LastEditTime: 2023-03-29 20:28:05
 * @LastEditors: mulingyuer
 * @Description: 数据仓库
 * @FilePath: \Typecho_Theme_JJ\src\store\data.ts
 * 怎么可能会有bug！！！
 */
import { reactive } from "vue";

/** 全局响应式数据（模块级单例）
 * 注意：使用时请通过 dataStore.xxx 访问，不要解构，否则会丢失响应式
 */
export const dataStore = reactive({
  scrollY: 0, // Y滚动条位置
  windowWidth: 0, //窗口宽度
  windowHeight: 0, //窗口高度
  enableMobileSearch: false, //是否启用移动端搜索
  isDomContentLoaded: false, //是否dom已经解析，无需等待样式表、图像和子框架的完全加载
});
