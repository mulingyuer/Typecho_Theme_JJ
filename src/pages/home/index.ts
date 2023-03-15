/*
 * @Author: mulingyuer
 * @Date: 2022-12-18 19:07:38
 * @LastEditTime: 2023-03-15 17:03:19
 * @LastEditors: mulingyuer
 * @Description: index入口文件
 * @FilePath: \Typecho_Theme_JJ\src\pages\home\index.ts
 * 怎么可能会有bug！！！
 */
import "./style.scss";
import { useDataStore } from "@/store/data";

const dataStore = useDataStore();

console.log(dataStore.getScrollY);
