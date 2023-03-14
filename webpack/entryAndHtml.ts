/*
 * @Author: mulingyuer
 * @Date: 2022-12-18 19:09:51
 * @LastEditTime: 2023-03-14 18:50:08
 * @LastEditors: mulingyuer
 * @Description: 入口和html模板
 * @FilePath: \Typecho_Theme_JJ\webpack\entryAndHtml.ts
 * 怎么可能会有bug！！！
 */
import type { EntryObject } from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { resolve } from "path";
import { globSync } from "glob";

//通用的入口文件
const mainEntryPath = resolve(__dirname, "../src/main.ts");
//入口文件路径
const entryPath = resolve(__dirname, "../src/pages");

/**
 * @description: 生成入口对象
 * @param {*} entry
 * @Date: 2022-12-18 19:24:08
 * @Author: mulingyuer
 */
export function createEntry() {
  const entryObj: EntryObject = {};

  //获取入口文件数组
  const entryArr = globSync("**/index.ts", {
    cwd: resolve(__dirname, entryPath),
  });
  //遍历得到对象
  entryArr.forEach((filePath: string) => {
    const fileName = filePath.split(/(\/|\\)/i)[0];
    entryObj[fileName] = [mainEntryPath, resolve(__dirname, entryPath, filePath)];
  });
  return entryObj;
}

/**
 * @description: 生成html模板
 * @param {*} entry
 * @Date: 2022-12-18 19:24:57
 * @Author: mulingyuer
 */
export function createHtml(entry: EntryObject) {
  const htmlArr: Array<HtmlWebpackPlugin> = [];
  const keys = Object.keys(entry);

  keys.forEach((key) => {
    htmlArr.push(
      new HtmlWebpackPlugin({
        template: resolve(__dirname, "./template.ejs"),
        filename: `head/${key}.php`,
        chunks: [key],
        inject: false, //自定义模板不需要自动注入
        publicPath: "<?php echo $this->options->themeUrl; ?>/dist", //拼接php地址
        minify: {
          removeComments: true, //去除html注释
          collapseWhitespace: false, //去除换行
          minifyCSS: true, //缩小样式元素和样式属性中css
        },
      })
    );
  });

  return htmlArr;
}
