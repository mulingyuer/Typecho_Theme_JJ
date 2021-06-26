/*
 * @Author: mulingyuer
 * @Date: 2021-06-13 01:12:50
 * @LastEditTime: 2021-06-13 01:14:38
 * @LastEditors: mulingyuer
 * @Description: notification 脚本加载
 * @FilePath: \JJ\notification\js\index.js
 * 怎么可能会有bug！！！
 */

(async function () {
  const $noti_path = `${$theme_path}/notification/js`;
  //依赖脚本
  const relyArr = [
    { url: `${$common_utils}/img-lazyload.js` },
    { url: `${$common_utils}/axios.min.js` },
  ];
  //触发脚本
  const runArr = [
    { url: `${$noti_path}/notification.js`, skipCache: true },
  ]


  //首页脚本
  try {
    await $bk_head; //head脚本
    await $bk.require(...relyArr); //依赖脚本
    await $bk.require(...runArr); //触发脚本
  } catch (error) {
    console.log("依赖脚本加载失败", error)
  };

})();
