/*
 * @Author: mulingyuer
 * @Date: 2021-06-13 01:27:50
 * @LastEditTime: 2021-06-23 22:14:15
 * @LastEditors: mulingyuer
 * @Description: links脚本加载
 * @FilePath: \JJ\links\js\index.js
 * 怎么可能会有bug！！！
 */
(async function () {
  const $links_path = `${$theme_path}/links/js`;
  //依赖脚本
  const relyArr = [
    { url: `${$common_utils}/img-lazyload.js` },
    { url: `${$common_utils}/axios.min.js` },
    { url: `${$common_utils}/popper.min.js` },
  ];
  //触发脚本
  const runArr = [
    { url: `${$common_path}/js/face/index.js`, skipCache: true },
  ]


  //首页脚本
  try {
    await $bk_head; //head脚本
    await $bk.require(...relyArr); //依赖脚本
    await $bk.require(...runArr); //触发脚本

    //手动哈希定位
    hashPosition();
  } catch (error) {
    console.log("依赖脚本加载失败", error)
  };

})();
