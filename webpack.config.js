/*
 * @Author: mulingyuer
 * @Date: 2021-07-01 22:17:24
 * @LastEditTime: 2021-07-04 02:43:38
 * @LastEditors: mulingyuer
 * @Description:webpack配置文件
 * @FilePath: \JJ\webpack.config.js
 * 怎么可能会有bug！！！
 */
const path = require('path');
const resolve = function (myPath) {
  return path.resolve(__dirname, myPath);
};

//公共配置
const commonConfig = require('./webpack/webpack.common');
//开发配置
const developmentConfig = require('./webpack/webpack.dev');
//生产配置
const productionConfig = require('./webpack/webpack.prod');

//配置合并
const { merge } = require('webpack-merge');



module.exports = (env, argv) => {
  switch (argv.mode) {
    case 'development':
      return merge(commonConfig, developmentConfig);
    case 'production':
      return merge(commonConfig, productionConfig);
    default:
      throw new Error('No matching configuration was found!');
  }
}