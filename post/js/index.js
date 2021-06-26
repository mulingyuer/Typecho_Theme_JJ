/*
 * @Author: mulingyuer
 * @Date: 2021-05-22 20:18:57
 * @LastEditTime: 2021-06-13 13:57:08
 * @LastEditors: mulingyuer
 * @Description: 文章页脚本加载
 * @FilePath: \JJ\post\js\index.js
 * 怎么可能会有bug！！！
 */
(async function () {
  const $post_path = `${$theme_path}/post/js`;
  //依赖脚本
  const relyArr = [
    { url: `${$common_utils}/img-lazyload.js` },
    { url: `${$common_utils}/qrious.min.js` },
    { url: `${$common_utils}/share-qrcode.js` },
    { url: `${$modules}/highlight/highlight.min.js` },
    { url: `${$modules}/sticky/sticky.min.js` },
    { url: `${$common_utils}/popper.min.js` },
    { url: `${$common_utils}/axios.min.js` },
    { url: `${$common_utils}/qs.js` },
  ];
  //触发脚本
  const runArr = [
    { url: `${$common_path}/js/face/index.js`, skipCache: true },
    { url: `${$modules}/BigPicture/BigPicture.min.js`, skipCache: true },
    { url: `${$post_path}/post.js`, skipCache: true },
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
