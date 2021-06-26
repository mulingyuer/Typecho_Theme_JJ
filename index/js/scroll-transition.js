/*
 * @Author: mulingyuer
 * @Date: 2021-04-08 22:05:09
 * @LastEditTime: 2021-05-02 15:57:27
 * @LastEditors: mulingyuer
 * @Description: header
 * @FilePath: \typecho-theme-juejing\index\js\scroll-transition.js
 * 怎么可能会有bug！！！
 */

$(function () {
  const $indexNav = $("#index-main-nav");
  const $obServer = window.$obServer;


  //监听滚动条高度
  let reference = null;  //过去的参考值
  let indexNavTranstion = (newVal, oldVal) => {
    if (!reference) reference = oldVal;
    if (newVal >= 600 && newVal - reference >= 50) {
      if (!$indexNav.hasClass("top")) $indexNav.addClass("top");
      reference = null;
    } else if (reference - newVal >= 50) {
      if ($indexNav.hasClass("top")) $indexNav.removeClass("top");
      reference = null;
    }
  };
  new Watch($obServer, "scrollTop", indexNavTranstion, true);


});