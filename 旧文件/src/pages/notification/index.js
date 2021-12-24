/*
 * @Author: mulingyuer
 * @Date: 2021-08-14 23:57:31
 * @LastEditTime: 2021-08-31 22:05:58
 * @LastEditors: mulingyuer
 * @Description: 评论卡片页
 * @FilePath: \JJ\src\pages\notification\index.js
 * 怎么可能会有bug！！！
 */
import "./index.scss";

//js
import $ from "jquery";
import { MainNav, Search, BlogMenu, CollectHeader } from "@/scripts/header"; //header
import DrawerSearch from "@/scripts/drawer-search";
import LoginDialog from "@/scripts/login-dialog";
import BackTop from "@/scripts/back-top";
import FaceReplace from "@/scripts/face-replace";


$(function () {
  //导航菜单
  const mianNav = new MainNav();
  //搜索
  const search = new Search();
  //博客功能按钮
  const blogMenu = new BlogMenu();
  //抽屉搜索
  new DrawerSearch();


  //收起动画
  const collectHeader = new CollectHeader();

  //登录弹窗
  new LoginDialog();

  //返回顶部
  new BackTop();


  //表情替换
  new FaceReplace({ el: ["#notification-content"] });






})