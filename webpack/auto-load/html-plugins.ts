/*
 * @Author: mulingyuer
 * @Date: 2022-03-07 01:46:54
 * @LastEditTime: 2022-03-08 01:08:35
 * @LastEditors: mulingyuer
 * @Description: html 模板输出
 * @FilePath: \Typecho_Theme_JJ\webpack\auto-load\html-plugins.ts
 * 怎么可能会有bug！！！
 */
import entry from "./entry";
import { resolve } from "path";
//html输出
import HtmlWebpackPlugin from "html-webpack-plugin";

//创建html模板输出
function createHTMLPlugin() {
  const htmlArr: any[] = [];

  Object.keys(entry).map((name: string) => {
    const htmlPlugin = new HtmlWebpackPlugin({
      filename: `head/${name}.php`,
      template: resolve(__dirname, "../template/html.ejs"), //自定义模板
      chunks: [name], //指定插入的js文件
      inject: false, //自定义模板不需要自动注入
      publicPath: "<?php aaa;?>", //拼接php地址
      minify: {
        removeComments: true, //去除html注释
        collapseWhitespace: false, //去除换行
        minifyCSS: true, //缩小样式元素和样式属性中css
      },
    });
    //保存html模板
    htmlArr.push(htmlPlugin);
  });

  return htmlArr;
}

export default createHTMLPlugin();
