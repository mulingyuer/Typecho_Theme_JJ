/*
 * @Author: mulingyuer
 * @Date: 2022-03-06 21:46:49
 * @LastEditTime: 2022-03-26 22:23:14
 * @LastEditors: mulingyuer
 * @Description: 开发模式配置
 * @FilePath: \Typecho_Theme_JJ\webpack\webpack.dev.ts
 * 怎么可能会有bug！！！
 */
import { Configuration } from "webpack";
import { resolve } from "path";
//将CSS提取到单独的文件中
import MiniCssExtractPlugin from "mini-css-extract-plugin";

const devConfig: Configuration = {
  mode: "development", //等同于 webpack --mode=development
  devtool: "eval", //控制是否生成sourcemap
  stats: "errors-only", //控制台输出：只在发生错误时输出
  output: {
    clean: true, // 在生成文件之前清空 output 目录
    filename: `pages/[name].js`,
    path: resolve(__dirname, "../dist"),
  },
  plugins: [
    //提取css
    new MiniCssExtractPlugin({
      filename: `css/[name].css`,
    }),
  ],
  watch: true, //监听任何已解析文件的更改
  watchOptions: {
    aggregateTimeout: 600, //600ms内可以重复保存
    poll: 1000, // 每秒检查一次变动
    ignored: ["**/node_modules"], //忽略模块文件夹
  },
};

export default devConfig;
