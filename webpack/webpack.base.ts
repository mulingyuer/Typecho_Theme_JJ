/*
 * @Author: mulingyuer
 * @Date: 2022-03-06 21:47:42
 * @LastEditTime: 2022-03-08 01:07:44
 * @LastEditors: mulingyuer
 * @Description: 基础配置
 * @FilePath: \Typecho_Theme_JJ\webpack\webpack.base.ts
 * 怎么可能会有bug！！！
 */
import { Configuration } from "webpack";
import { resolve } from "path";
//优化和缩小CSS
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
//将CSS提取到单独的文件中
import MiniCssExtractPlugin from "mini-css-extract-plugin";

//入口配置
import entry from "./auto-load/entry";
//html模板配置
import htmlPlugin from "./auto-load/html-plugins";

const baseConfig: Configuration = {
  mode: "development", //等同于 webpack --mode=development
  devtool: "eval", //控制是否生成sourcemap
  //入口
  entry,
  //输出
  output: {
    clean: true, // 在生成文件之前清空 output 目录
    filename: `entry/[name].[contenthash:8].js`,
    path: resolve(__dirname, "../dist"),
  },
  //模块
  module: {
    rules: [
      //ts|js
      {
        test: /\.(ts|js)x?$/,
        exclude: /(node_modules|bower_components)/, //排除
        include: resolve(__dirname, "../src"), //只包含
        loader: "babel-loader",
      },
      //css|scss
      {
        test: /.s?css$/,
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
              //使用dart-sass，其实安装的就是sass，所以默认会用它，除非还装了node-sass，才需要这样指定
              // implementation: require("sass"),
              sassOptions: {
                // dart-sass 的 charset 选项默认为 true，我们强烈建议你将其改为 false，
                // 因为 webpack 并不支持 utf-8 以外的文件。
                charset: false,
                //全局scss
                additionalData: `
                  @import "@style/global/color.scss";
                  @import "@style/global/mixins.scss"
                `,
              },
            },
          },
        ],
      },
      //image
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
      //fonts
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
      },
    ],
  },
  //优化处理
  optimization: {
    minimize: true, //是否在开发模式生效
    //最小化处理
    minimizer: [new CssMinimizerPlugin()],
  },
  //插件
  plugins: [
    new MiniCssExtractPlugin({
      filename: `css/[name].[contenthash:8].css`,
    }),
    //html模板
    ...htmlPlugin,
  ],
  //解析
  resolve: {
    //路径别名
    alias: {
      "@": resolve(__dirname, "../src"),
      "@utils": resolve(__dirname, "../src/utils"),
      "@assets": resolve(__dirname, "../src/assets"),
      "@components": resolve(__dirname, "../src/components"),
      "@style": resolve(__dirname, "../src/style"),
    },
  },
  //实验性功能
  experiments: {
    backCompat: true, //关闭向下兼容旧版webpack，提升打包速度
  },
};

export default baseConfig;
