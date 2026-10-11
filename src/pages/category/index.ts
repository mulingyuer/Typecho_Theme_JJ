/*
 * @Author: mulingyuer
 * @Date: 2026-08-02 11:20:27
 * @LastEditTime: 2026-10-11 02:17:05
 * @LastEditors: mulingyuer
 * @Description: 分类页入口文件
 * @FilePath: \Typecho_Theme_JJ\src\pages\category\index.ts
 * 怎么可能会有bug！！！
 */
import "@/main";
import "@/modules/nav";
import "@/modules/secondary-nav";
import { initArticleList } from "@/modules/article-list";
import "@/modules/home/recent-comments";
import "@/modules/home/theme-tool";
import "@/modules/footer";
import "@/modules/category/tips";

initArticleList();
