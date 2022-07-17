/*
 * @Author: mulingyuer
 * @Date: 2022-07-07 23:04:28
 * @LastEditTime: 2022-07-17 16:00:44
 * @LastEditors: mulingyuer
 * @Description: 公共入口
 * @FilePath: \Typecho_Theme_JJ\src\main.ts
 * 怎么可能会有bug！！！
 */
import { createPinia } from "pinia";
import { createApp } from "vue";

//pinia
const pinia = createPinia();

//样式
import "./styles/reset.scss";
import "./styles/header.scss";

//组件脚本
import "./components/header.ts";

//创建app实例
const app = createApp({});
app.use(pinia);
