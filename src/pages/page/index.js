/*
 * @Author: mulingyuer
 * @Date: 2021-08-14 17:30:24
 * @LastEditTime: 2021-08-15 00:05:07
 * @LastEditors: mulingyuer
 * @Description: 文章页
 * @FilePath: \JJ\src\pages\page\index.js
 * 怎么可能会有bug！！！
 */
import "./index.scss";

//js
import $ from "jquery";
import { Search, BlogMenu, CollectHeader } from "@/scripts/header"; //header
import LoginDialog from "@/scripts/login-dialog";
import BackTop from "@/scripts/back-top";
import Face from "@/scripts/face";
import FaceReplace from "@/scripts/face-replace";
import QrCode from "@/packages/qr-code";
import Sticky from "sticky-js";
import { hashPostion } from "@/utils/tool";
import Like from "@/scripts/like";
import ImgLazyload from "@/packages/img-lazyload";
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-light.css';
import LightBox from "@/packages/light-box/index";


$(function () {
  //导航菜单
  // const mianNav = new MainNav();
  //搜索
  const search = new Search();
  //博客功能按钮
  const blogMenu = new BlogMenu();


  //收起动画
  const collectHeader = new CollectHeader();

  //登录弹窗
  new LoginDialog();

  //返回顶部
  new BackTop();

  //表情
  new Face();
  //表情替换
  new FaceReplace({ el: ["#my-custom-comment"] });

  //文章左侧二维码
  const $articleTool = $("#article-tool");
  if ($articleTool.length) {
    const link = $articleTool.find(".wx").data("link");
    $articleTool.find(".wx-qrcode").html(`<img src="${QrCode(link)}" alt="二维码">`);
  }

  //目录树
  const sticky = new Sticky("#catalog-tree");
  $("#catalog-tree").on("click", (event) => {
    event.preventDefault(); //阻止默认行为

    const isA = event.target.tagName.toLowerCase() === "a";
    const id = event.target.dataset.scroll;

    if (isA && id) {
      hashPostion(id);
    }
  });

  //点赞
  new Like();

  //相关文章
  const $relatedArticles = $("#related-articles");
  if ($relatedArticles.length) {
    //文章点击
    $relatedArticles.find(".related-item").on("click", function () {
      const link = $(this).data("link")
      location.href = link;
    });
    //图片懒加载
    const ImgLazy = new ImgLazyload({ el: "#related-articles img" }); //图片懒加载;
  }

  //代码高亮
  hljs.highlightAll();

  //灯箱
  new LightBox({ selector: "#markdown", mode: "wrap", })


  //骨架屏
  const $skeleton = $('#main .post-skeleton');
  const $contentWrap = $('#main .content-warp');
  setTimeout(() => {
    if ($skeleton.length) $skeleton.remove();
    if ($contentWrap.hasClass("hide")) $contentWrap.removeClass("hide");

    //判断有无哈希
    const hash = location.hash.slice(1);
    hash && setTimeout(() => {
      hashPostion(`#${hash}`);
    })


  }, 300)

})

