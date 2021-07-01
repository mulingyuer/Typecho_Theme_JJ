/*
 * @Author: mulingyuer
 * @Date: 2021-07-01 22:17:24
 * @LastEditTime: 2021-07-02 00:07:05
 * @LastEditors: mulingyuer
 * @Description:webpack配置文件
 * @FilePath: \JJ\webpack.config.js
 * 怎么可能会有bug！！！
 */
const path = require('path');
const resolve = function (myPath) {
  return path.resolve(__dirname, myPath);
};

//样式抽离
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: 'development',  //模式
  //入口
  entry: {
    index: './src/pages/home/index.js'
  },
  // 出口
  output: {
    path: resolve('./dist'), //指定输出目录
    filename: '[name]/index.js',  //文件名
    chunkFilename: '[id].js'
  },
  //模块-解析器loader
  module: {
    rules: [
      //css
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          },
          'postcss-loader'
        ]
      },
      // scss
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          },
          'postcss-loader',
          'sass-loader',
        ]
      }
    ]
  },
  // 插件
  plugins: [
    //抽取css
    new MiniCssExtractPlugin({
      filename: '[name]/style.css', //输出的css文件名，默认以入口文件名命名(例如main.css)
      chunkFilename: "[id].css", //公共样式？？
    }),
  ]

}