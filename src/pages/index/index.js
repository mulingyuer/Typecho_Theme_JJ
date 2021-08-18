/*
 * @Author: mulingyuer
 * @Date: 2021-07-04 16:55:04
 * @LastEditTime: 2021-08-19 00:13:57
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
import { specifyParentClass } from "@/utils/tool";
import ImgLazyload from "@/packages/img-lazyload";
import IllimitedLoad from "@/packages/illimited-load";
import api from "@/packages/request";
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

  //导航按钮
  const nav = new Nav();

  //收起动画
  const collectHeader = new CollectHeader();
  const collectNav = new CollectNav();

  //left内容  
  const $skeleton = $('#mini-article-skeleton-wrap');
  const $articleList = $('#article-list-wrap');
  let imgLazy = null;  //图片懒加载实例

  //文章卡片点击事件
  $articleList.on('click', (event) => {
    const articleCard = specifyParentClass('min-article-card', event.target);
    if (!articleCard) return;  //不存在就跳过

    const link = articleCard.dataset.link;
    link && window.open(link, "_self");
  })


  //无限加载
  let $autoLoad = $("#main .auto-load");

  //auto-load操作
  class AutoLoadOperate {
    static show() {
      if (!$autoLoad.hasClass("show")) $autoLoad.addClass("show");
      return AutoLoadOperate;
    }

    static hide() {
      if ($autoLoad.hasClass("show")) $autoLoad.removeClass("show");
      return AutoLoadOperate;
    }

    static noMore() {
      $autoLoad.html('<span class="no-more">没有更多了</span>');
      return AutoLoadOperate;
    }
  }

  function articleLoad(resetFn) {
    const nextLink = $autoLoad.find(".next").attr("href");
    if (!nextLink) {
      AutoLoadOperate.noMore().show();
    } else {
      AutoLoadOperate.show();
      //请求
      const postData = { url: nextLink, method: "get" };
      api(postData).then(res => {
        let $content = $("<div></div>").html(res);  //创建dom
        $articleList.append($content.find("#article-list-wrap .min-article-card")); //插入dom

        //更新auto-load
        const $newNext = $content.find(".auto-load .next");
        if ($newNext.length) {
          const $newAutoLoad = $content.find(".auto-load");
          $autoLoad.replaceWith($newAutoLoad);
          $autoLoad = $newAutoLoad;

          //恢复监听
          resetFn && resetFn();
          //图片懒加载
          imgLazy && imgLazy.add($articleList.find("img[data-src]"));
        } else {
          AutoLoadOperate.noMore().show();
        }

      }).catch(err => {
        console.log(err);
        //恢复监听
        resetFn && resetFn();
      })
    }
  }


  //登录弹窗
  new LoginDialog();

  //返回顶部
  new BackTop();

  //表情替换
  new FaceReplace({ el: ["#main .recent-comment .recent-body"] });


  //骨架屏
  setTimeout(() => {
    if ($skeleton.length) $skeleton.remove();
    if ($articleList.hasClass("hide")) $articleList.removeClass("hide");


    imgLazy = new ImgLazyload({ el: "#article-list-wrap img[data-src]" }); //图片懒加载

    if (!$autoLoad.find(".next").length) AutoLoadOperate.noMore().show();  //首次
    new IllimitedLoad({ callback: articleLoad }); //无线加载
  }, 300)



});
