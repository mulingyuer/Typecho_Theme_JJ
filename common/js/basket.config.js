/*
 * @Author: mulingyuer
 * @Date: 2021-05-20 22:42:02
 * @LastEditTime: 2021-06-26 16:00:47
 * @LastEditors: mulingyuer
 * @Description:basket配置
 * @FilePath: \JJ\common\js\basket.config.js
 * 怎么可能会有bug！！！
 */

if (basket && typeof basket === "object") {
  const path = {
    $common_path: `${$theme_path}/common`,
    $common_js: `${$theme_path}/common/js`,
    $common_css: `${$theme_path}/common/css`,
    $common_utils: `${$theme_path}/common/js/utils`,
    $modules: `${$theme_path}/common/modules`,
  };

  Object.assign(window, path, { $bk: basket }, { _debug: false });
  //修改默认缓存时间
  $bk.expireHandler(720);
};