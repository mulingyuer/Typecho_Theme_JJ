/*
 * @Author: mulingyuer
 * @Date: 2021-07-04 01:29:59
 * @LastEditTime: 2021-07-04 03:18:57
 * @LastEditors: mulingyuer
 * @Description: 自定义模板
 * @FilePath: \JJ\webpack\custom-template.js
 * 怎么可能会有bug！！！
 */
const path = require('path');
const resolve = function (myPath) {
  return path.resolve(__dirname, myPath);
};

//入口文件
const autoEntry = require('./auto-entry');
//模板插件
const HtmlWebpackPlugin = require('html-webpack-plugin');


// css模板
const cssEjs = resolve('../src/template/css.ejs');
const cssTemplate = (...chunks) => ({
  filename: '[name]/css.php',  //输出的文件名
  template: cssEjs, //自定义模板
  chunks, //指定入口块
  inject: false, //自定义模板不需要自动注入
  minify: {
    removeComments: true, //去除html注释
    collapseWhitespace: true, //去除换行
    minifyCSS: true //缩小样式元素和样式属性中css
  },
});

//js模板
const jsEjs = resolve('../src/template/script.ejs');
const jsTemplate = (...chunks) => ({
  filename: '[name]/script.php', //输出的文件名
  template: jsEjs, //自定义模板
  chunks, //指定入口块
  inject: false, //自定义模板不需要自动注入
  minify: {
    removeComments: true, //去除html注释
    collapseWhitespace: true, //去除换行
    minifyCSS: true //缩小样式元素和样式属性中css
  },
});


// const chunksArr = ["index", "about"];
const chunksArr = autoEntry.chunks();


module.exports = function () {
  //css
  let cssPhp = [];
  chunksArr.forEach(chunk => cssPhp.push(cssTemplate(chunk)));
  //js
  let jsPhp = [];
  chunksArr.forEach(chunk => jsPhp.push(jsTemplate(chunk)));

  //导出
  return [cssPhp, jsPhp].map(arr => new HtmlWebpackPlugin(...arr));
}