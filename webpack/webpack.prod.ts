/*
 * @Author: mulingyuer
 * @Date: 2022-03-06 21:47:23
 * @LastEditTime: 2022-03-26 22:23:47
 * @LastEditors: mulingyuer
 * @Description: 生产模式配置
 * @FilePath: \Typecho_Theme_JJ\webpack\webpack.prod.ts
 * 怎么可能会有bug！！！
 */
import { Configuration } from "webpack";
import { resolve } from "path";
//使用 terser 来压缩 JavaScript
import TerserPlugin from "terser-webpack-plugin";

const prodConfig: Configuration = {
  mode: "production", //等同于 webpack --mode=production
  devtool: "hidden-nosources-source-map", //控制是否生成sourcemap
  stats: "normal", //控制台输出：标准输出
  //输出
  output: {
    clean: true, // 在生成文件之前清空 output 目录
    filename: `pages/[name].[contenthash:8].js`,
    path: resolve(__dirname, "../dist"),
  },
  optimization: {
    minimize: true, //是否在开发模式生效优化（默认开发模式不启用）
    minimizer: [
      //压缩js
      new TerserPlugin({
        parallel: true, // 可省略，默认开启并行
        terserOptions: {
          compress: true,
          toplevel: true, // 最高级别，删除无用代码
          ie8: true,
          safari10: true,
        },
        extractComments: false, //关闭生成LICENSE文件
      }),
    ],
  },
};

export default prodConfig;
