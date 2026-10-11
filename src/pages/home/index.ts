/*
 * @Author: mulingyuer
 * @Date: 2026-08-02 11:20:27
 * @LastEditTime: 2026-10-11 02:16:45
 * @LastEditors: mulingyuer
 * @Description: 首页入口文件
 * @FilePath: \Typecho_Theme_JJ\src\pages\home\index.ts
 * 怎么可能会有bug！！！
 */
import "@/main";
import "@/modules/nav";
import "@/modules/home/article-nav";
import { initArticleList } from "@/modules/article-list";
import "@/modules/home/recent-comments";
import "@/modules/home/recommended-article";
import "@/modules/home/theme-tool";
import "@/modules/footer";

initArticleList();
