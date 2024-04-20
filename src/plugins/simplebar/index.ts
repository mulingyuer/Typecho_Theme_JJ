/*
 * @Author: mulingyuer
 * @Date: 2024-04-21 00:12:02
 * @LastEditTime: 2024-04-21 00:13:07
 * @LastEditors: mulingyuer
 * @Description: simplebar
 * @FilePath: /Typecho_Theme_JJ/src/plugins/simplebar/index.ts
 * 怎么可能会有bug！！！
 */
import ResizeObserver from "resize-observer-polyfill";
import "simplebar/dist/simplebar.css";
import "./style.scss";

window.ResizeObserver = ResizeObserver;
