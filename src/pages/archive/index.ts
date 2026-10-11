/*
 * @Author: mulingyuer
 * @Date: 2026-08-02 11:20:27
 * @LastEditTime: 2026-10-11 02:17:14
 * @LastEditors: mulingyuer
 * @Description: 归档页入口文件
 * @FilePath: \Typecho_Theme_JJ\src\pages\archive\index.ts
 * 怎么可能会有bug！！！
 */
import "@/main";
import "@/modules/nav";
import "@/modules/secondary-nav";
import { initArticleList } from "@/modules/article-list";
import "@/modules/home/recent-comments";
import "@/modules/home/theme-tool";
import "@/modules/footer";
import "@/modules/archive/tips";

initArticleList();
