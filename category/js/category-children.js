/*
 * @Author: mulingyuer
 * @Date: 2021-04-17 19:16:15
 * @LastEditTime: 2021-05-05 19:10:53
 * @LastEditors: mulingyuer
 * @Description: 菜单
 * @FilePath: \JJ\category\js\category-children.js
 * 怎么可能会有bug！！！
 */

$(function () {
  const $category = $("#category-nav-children");
  if (!$category.length) return;

  const $warp = $category.find(".children-warp");
  const $content = $category.find(".content");
  const $open = $category.find(".open");
  const $close = $category.find(".close");

  //展开
  $open.on("click", function () {
    const height = $content.height();
    $warp.css("height", height + "px");
    $open.removeClass("show");
    $close.addClass("show");
  });

  //收起
  $close.on("click", function () {
    $warp.css("height", "36px");
    $close.removeClass("show");
    $open.addClass("show");
  });

});