/*
 * @Author: mulingyuer
 * @Date: 2022-12-18 19:07:38
 * @LastEditTime: 2023-03-26 23:57:45
 * @LastEditors: mulingyuer
 * @Description: index入口文件
 * @FilePath: \Typecho_Theme_JJ\src\pages\home\index.ts
 * 怎么可能会有bug！！！
 */
import "./style.scss";
import "@/modules/nav";
import "@/modules/article_card";
import "@/modules/article_pagination";
import "@/modules/article_skeleton";
import "@/modules/article_empty";
import RecentComments from "@/modules/home/recent_comments";
import recentCommentsSkeleton from "@/modules/home/recent_comments_skeleton";
import "@/modules/home/theme_tool";
import "@/modules/footer";

new RecentComments(() => {
  //关闭评论骨架屏
  recentCommentsSkeleton.receiveClose();
});
