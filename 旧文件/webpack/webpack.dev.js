/*
 * @Author: mulingyuer
 * @Date: 2021-07-04 02:31:00
 * @LastEditTime: 2021-07-04 02:45:13
 * @LastEditors: mulingyuer
 * @Description: 开发配置
 * @FilePath: \JJ\webpack\webpack.dev.js
 * 怎么可能会有bug！！！
 */
const path = require('path');
const resolve = function (myPath) {
  return path.resolve(__dirname, myPath);
};

//样式抽离
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: 'development',
  devtool: 'eval',
  // 出口
  output: {
    filename: '[name]/index.js',  //文件名
    chunkFilename: '[id].js'
  },
  // 插件
  plugins: [
    //抽取css
    new MiniCssExtractPlugin({
      filename: '[name]/style.css', //输出的css文件名，默认以入口文件名命名(例如main.css)
      chunkFilename: '[id].css', //公共样式？？
    }),
  ],
  // 监听
  watch: true,  //开发模式监听
  //监听的配置
  watchOptions: {
    aggregateTimeout: 600,  //延迟600ms打包
    poll: 1000,
    ignored: /node_modules/,  //忽略
  }
}
