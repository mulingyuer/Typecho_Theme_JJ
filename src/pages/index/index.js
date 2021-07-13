/*
 * @Author: mulingyuer
 * @Date: 2021-07-04 16:55:04
 * @LastEditTime: 2021-07-14 00:08:17
 * @LastEditors: mulingyuer
 * @Description: 首页
 * @FilePath: \JJ\src\pages\index\index.js
 * 怎么可能会有bug！！！
 */
import "./index.scss";

//js
import $ from "jquery";
import { MainNav, Search, BlogMenu, CollectHeader } from "@/scripts/header"; //header
import { Nav, CollectNav } from "@/scripts/nav";


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


  const $skeleton = $('#mini-article-skeleton-wrap');
  const $articleList = $('#article-list-wrap');


  setTimeout(() => {
    if ($skeleton.length) $skeleton.remove();
    if ($articleList.hasClass("hide")) $articleList.removeClass("hide");
  }, 300)



});
