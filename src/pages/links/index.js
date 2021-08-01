/*
 * @Author: mulingyuer
 * @Date: 2021-08-01 15:52:43
 * @LastEditTime: 2021-08-01 15:56:16
 * @LastEditors: mulingyuer
 * @Description: 友链
 * @FilePath: \JJ\src\pages\links\index.js
 * 怎么可能会有bug！！！
 */
import "./index.scss";

//js
import $ from "jquery";
import { MainNav, Search, BlogMenu, CollectHeader } from "@/scripts/header"; //header
import { Nav, CollectNav } from "@/scripts/nav"; //nav


$(function () {
  //导航菜单
  const mianNav = new MainNav();
  //搜索
  const search = new Search();
  //博客功能按钮
  const blogMenu = new BlogMenu();

  //导航按钮
  const nav = new Nav();

  //收起动画
  const collectHeader = new CollectHeader();
  const collectNav = new CollectNav();
})
