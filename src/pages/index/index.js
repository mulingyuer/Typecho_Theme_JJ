/*
 * @Author: mulingyuer
 * @Date: 2021-07-04 16:55:04
 * @LastEditTime: 2021-07-04 22:45:56
 * @LastEditors: mulingyuer
 * @Description: 首页
 * @FilePath: \JJ\src\pages\index\index.js
 * 怎么可能会有bug！！！
 */
import "./index.scss";


//header
import { MainNav, Search, BlogMenu } from "@/scripts/header";

const mianNav = new MainNav();  //导航菜单
//搜索
new Search({
  elForm: "#header .search-form", //form选择器
  elInput: ".search-form .search-input", //input选择器
  subBtn: ".search-form .search-btn",  //搜索按钮
  recordWrap: ".search-form .typehead",  //历史记录容器
  clearBtn: ".search-form .clear", //清理按钮
  recordList: ".search-form .typehead .list", //搜索列表
});

const blogMenu = new BlogMenu();