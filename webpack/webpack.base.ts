/*
 * @Author: mulingyuer
 * @Date: 2022-03-06 21:47:42
 * @LastEditTime: 2022-03-26 22:06:54
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
//静态资源
import CopyWebpackPlugin from "copy-webpack-plugin";

//ui优化
//进度条
import WebpackBar from "webpackbar";

//入口配置
import entry from "./auto-load/entry";
//html模板配置
import htmlPlugin from "./auto-load/html-plugins";

const baseConfig: Configuration = {
  mode: "development", //等同于 webpack --mode=development
  devtool: "eval", //控制是否生成sourcemap
  stats: "errors-only", //控制台输出：只在发生错误时输出
  //入口
  entry,
  //输出
  output: {
    clean: true, // 在生成文件之前清空 output 目录
    filename: `pages/[name].[contenthash:8].js`,
    path: resolve(__dirname, "../dist"),
  },
  //模块
  module: {
    rules: [
      //ts|js
      {
        test: /\.(ts|js)x?$/,
        exclude: /(node_modules|bower_components)/, //排除
        //只包含
        include: [
          resolve(__dirname, "../src"),
          resolve(__dirname, "../packages"),
        ],
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
        generator: {
          filename: "images/[hash][ext][query]",
        },
      },
      //fonts
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
        generator: {
          filename: "fonts/[hash][ext][query]",
        },
      },
    ],
  },
  //优化处理
  optimization: {
    minimize: true, //是否在开发模式生效优化（默认开发模式不启用）
    //最小化处理
    minimizer: [
      //优化和缩小CSS
      new CssMinimizerPlugin(),
    ],
    //拆分代码
    splitChunks: {
      minSize: 0, //最小分包要求
      //分组处理
      cacheGroups: {
        //用户自定义的公共代码拆分
        commons: {
          name: "commons",
          chunks: "all", //加入按需加载后，设为all将所有模块包括在优化范围内
          minChunks: 2, //最小引入次数
        },
        //node_modules第三方库拆分
        vendor: {
          name: "vendor",
          test: /node_modules/,
          chunks: "initial",
        },
      },
    },
    //将chunks映射关系的list单独从app.js里提取出来
    runtimeChunk: {
      name: (entrypoint: { name: string }) => `manifest-${entrypoint.name}`,
    },
  },
  //插件
  plugins: [
    //进度条
    new WebpackBar({
      name: `📢 Typecho_Theme_JJ`,
      color: "#1e80ff",
    }),
    //提取css
    new MiniCssExtractPlugin({
      filename: `css/[name].[contenthash:8].css`,
    }),
    //静态资源
    new CopyWebpackPlugin({
      patterns: [
        {
          from: resolve(__dirname, "../public"),
          to: resolve(__dirname, "../dist"),
        },
      ],
    }),
    //html模板
    ...htmlPlugin,
  ],
  //解析
  resolve: {
    extensions: [".js", ".ts"], //当requrie的模块找不到时,添加这些后缀
    //路径别名
    alias: {
      "@": resolve(__dirname, "../src/"),
      "@utils": resolve(__dirname, "../src/utils/"),
      "@assets": resolve(__dirname, "../src/assets/"),
      "@components": resolve(__dirname, "../src/components/"),
      "@style": resolve(__dirname, "../src/style/"),
      "@packages": resolve(__dirname, "../packages/"),
    },
  },
  //实验性功能
  experiments: {
    backCompat: true, //关闭向下兼容旧版webpack，提升打包速度
  },
};

export default baseConfig;
