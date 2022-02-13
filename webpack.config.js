/*
 * @Author: mulingyuer
 * @Date: 2022-02-13 22:47:00
 * @LastEditTime: 2022-02-13 22:48:04
 * @LastEditors: mulingyuer
 * @Description: webpack配置
 * @FilePath: /Typecho_Theme_JJ/webpack.config.js
 * 怎么可能会有bug！！！
 */
const path = require('path');
const resolve = function (myPath) {
  return path.resolve(__dirname, myPath);
};

module.exports = (env, argv) => {
  console.log(env, argv);
  // switch (argv.mode) {
  //   case 'development':
  //     return merge(commonConfig, developmentConfig);
  //   case 'production':
  //     return merge(commonConfig, productionConfig);
  //   default:
  //     throw new Error('No matching configuration was found!');
  // }
}