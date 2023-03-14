/*
 * @Author: mulingyuer
 * @Date: 2022-12-18 20:49:25
 * @LastEditTime: 2023-03-14 18:50:19
 * @LastEditors: mulingyuer
 * @Description: webpack dev配置
 * @FilePath: \Typecho_Theme_JJ\webpack\webpack.dev.ts
 * 怎么可能会有bug！！！
 */
import type { Configuration } from "webpack";
import { merge } from "webpack-merge";
import common from "./webpack.common";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

export default merge(common, {
  mode: "development",
  devtool: "eval", //控制是否生成sourcemap
  output: {
    filename: `pages/[name].js`,
  },
  plugins: [
    //css样式抽离
    new MiniCssExtractPlugin({
      filename: "styles/[name].css", //css文件命名
      chunkFilename: "chunk-[id].css", //异步样式
    }),
  ],
  watch: true, //监听任何已解析文件的更改
  watchOptions: {
    aggregateTimeout: 600, //600ms内可以重复保存
    poll: 1000, // 每秒检查一次变动
    ignored: ["**/node_modules"], //忽略模块文件夹
  },
} as Configuration);
