/*
 * @Author: mulingyuer
 * @Date: 2021-07-04 02:33:49
 * @LastEditTime: 2021-07-04 02:35:23
 * @LastEditors: mulingyuer
 * @Description:生产环境
 * @FilePath: \JJ\webpack\webpack.prod.js
 * 怎么可能会有bug！！！
 */
const path = require('path');
const resolve = function (myPath) {
  return path.resolve(__dirname, myPath);
};

//样式抽离
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  // 出口
  output: {
    filename: '[name]/index.[contenthash:8].js',  //文件名
    chunkFilename: '[id].[contenthash:8].js'
  },
  // 插件
  plugins: [
    //抽取css
    new MiniCssExtractPlugin({
      filename: '[name]/style.[contenthash:8].css', //输出的css文件名，默认以入口文件名命名(例如main.css)
      chunkFilename: '[id].[contenthash:8].css', //公共样式？？
    }),
  ],
}
