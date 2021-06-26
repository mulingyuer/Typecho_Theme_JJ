/*
 * @Author: mulingyuer
 * @Date: 2021-06-13 01:14:09
 * @LastEditTime: 2021-06-13 01:16:34
 * @LastEditors: mulingyuer
 * @Description: notification
 * @FilePath: \JJ\notification\js\notification.js
 * 怎么可能会有bug！！！
 */
$(function () {

  const $warp = $("#notification-main .notification-warp");
  if ($warp.length) {
    //表情
    faceReplace($warp);
  }

});