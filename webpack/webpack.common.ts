/*
 * @Author: mulingyuer
 * @Date: 2022-12-18 20:34:21
 * @LastEditTime: 2023-03-18 11:55:37
 * @LastEditors: mulingyuer
 * @Description: webpack基础配置
 * @FilePath: \Typecho_Theme_JJ\webpack\webpack.common.ts
 * 怎么可能会有bug！！！
 */
import type { Configuration } from "webpack";
import { createEntry, createHtml } from "./entryAndHtml";
import { resolve } from "path";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import WebpackBar from "webpackbar";

//自动获取入口文件
const entry = createEntry();

export default {
  stats: "errors-only", //控制台输出：只在发生错误时输出
  entry: entry,
  output: {
    clean: true, // 在生成文件之前清空 output 目录
    filename: `scripts/[name].[contenthash:8].js`,
    path: resolve(__dirname, "../dist"),
  },
  module: {
    rules: [
      {
        test: /\.(t|j)s$/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
      },
      {
        test: /\.s(c|a)ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              //由于@import的问题，引入的文件可能不会被postcss-loader转换，所以回退1位
              importLoaders: 1,
            },
          },
          "postcss-loader",
          {
            loader: "sass-loader",
            options: {
              sassOptions: {
                //dart-sass 的 charset 选项默认为 true，我们强烈建议你将其改为 false，
                //因为 webpack 并不支持utf-8 以外的文件
                charset: false,
              },
              //前置scss（全局scss）
              additionalData: `
                @import "@/styles/color.scss";
                @import "@/styles/mixins.scss";
                @import "@/styles/variable.scss";
              `,
            },
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset", //在导出一个 data URI 和发送一个单独的文件之间自动选择
        generator: {
          filename: "images/[hash][ext][query]",
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
        generator: {
          filename: "fonts/[hash][ext][query]",
        },
      },
    ],
  },
  plugins: [
    new WebpackBar({
      name: "🚀  少女祈祷中...",
      color: "#1e80ff",
    }),
    ...createHtml(entry),
  ],
  resolve: {
    extensions: [".ts", ".js"], // 解析对文件格式
    //路径别名
    alias: {
      "@": resolve(__dirname, "../src/"),
    },
  },
  optimization: {
    //提取引导模板
    runtimeChunk: {
      name: (entrypoint: { name: string }) => `${entrypoint.name}-manifest`,
    },
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        default: false,
        //node_modules公共代码合并到vendors.js
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
          priority: -10, //权重,vendor优先
        },
        //业务共用代码提取
        commons: {
          test: /[\\/]src[\\/]/,
          name: "common",
          chunks: "all",
          priority: -20, //权重
          minChunks: 2,
          minSize: 0,
        },
      },
    },
  },
} as Configuration;
