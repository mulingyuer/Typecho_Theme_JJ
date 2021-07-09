/*
 * @Author: mulingyuer
 * @Date: 2021-07-04 16:55:04
 * @LastEditTime: 2021-07-09 23:07:09
 * @LastEditors: mulingyuer
 * @Description: 首页
 * @FilePath: \JJ\src\pages\index\index.js
 * 怎么可能会有bug！！！
 */
import "./index.scss";

//js
import $ from "jquery";
import { MainNav, Search, BlogMenu } from "@/scripts/header"; //header
import { Nav } from "@/scripts/nav";

$(function () {
  //导航菜单
  const mianNav = new MainNav();
  //搜索
  const search = new Search();

  //博客功能按钮
  const blogMenu = new BlogMenu();

  //导航按钮
  const nav = new Nav();
});
