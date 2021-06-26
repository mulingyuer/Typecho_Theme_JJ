/*
 * @Author: mulingyuer
 * @Date: 2021-05-22 20:11:06
 * @LastEditTime: 2021-05-23 22:08:15
 * @LastEditors: mulingyuer
 * @Description:分类页脚本加载
 * @FilePath: \JJ\category\js\index.js
 * 怎么可能会有bug！！！
 */
(async function () {
  const $index_path = `${$theme_path}/index/js`;
  const $category_path = `${$theme_path}/category/js`;
  //依赖脚本
  const relyArr = [
    { url: `${$common_utils}/better-scroll-core.min.js` },
    { url: `${$common_utils}/popper.min.js` },
    { url: `${$common_utils}/img-lazyload.js` },
    { url: `${$common_utils}/qrious.min.js` },
    { url: `${$common_utils}/share-qrcode.js` },
    { url: `${$common_utils}/axios.min.js` },
  ];
  //触发脚本
  const runArr = [
    { url: `${$index_path}/nav.js`, skipCache: true },
    { url: `${$index_path}/scroll-transition.js`, skipCache: true },
    { url: `${$index_path}/content.js`, skipCache: true },
    { url: `${$category_path}/category-children.js`, skipCache: true },
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


