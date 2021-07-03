/*
 * @Author: mulingyuer
 * @Date: 2021-07-04 02:24:10
 * @LastEditTime: 2021-07-04 04:12:26
 * @LastEditors: mulingyuer
 * @Description: 通用配置
 * @FilePath: \JJ\webpack\webpack.common.js
 * 怎么可能会有bug！！！
 */
const path = require('path');
const resolve = function (myPath) {
  return path.resolve(__dirname, myPath);
};

//入口文件
const autoEntry = require('./auto-entry');

//样式抽离
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
//css压缩
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
//清理打包文件
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
//js压缩
const TerserPlugin = require("terser-webpack-plugin");
//分析
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
//自定义模板
const customTemplate = require('./custom-template');


module.exports = {
  mode: 'development',  //模式
  devtool: 'eval', //模式类型
  //入口
  entry: {
    ...autoEntry.entry()
    // index: resolve('../src/pages/home/index.js'),
    // about: resolve('../src/pages/about/index.js'),
  },
  // 出口
  output: {
    path: resolve('../dist'), //指定输出目录
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
          'cache-loader',
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          },
          'postcss-loader',
        ]
      },
      // scss
      {
        test: /\.scss$/,
        use: [
          // 'cache-loader', //绝对路径图片文件容易丢失，不开
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          },
          'postcss-loader',
          'sass-loader',
          {
            loader: 'sass-resources-loader',
            options: {
              resources: [
                resolve("../src/assets/scss/vars.scss"),
                resolve("../src/assets/scss/mixins.scss"),
                resolve("../src/assets/scss/functions.scss"),
                resolve("../src/assets/scss/reset.scss"),
              ]
            }
          }
        ]
      },
      // js
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,  // 不处理该文件夹下的js文件
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            cacheDirectory: true, //开启缓存
          }
        },
      },
      // jquery
      {
        test: require.resolve('jquery'),
        loader: 'expose-loader',
        options: {
          exposes: ['$', 'jQuery'],
        },
      },
      //图片文件
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [
          {
            loader: "url-loader",
            options: {
              name: "[name].[hash:16].[ext]", // 文件名.hash.文件扩展名 默认格式为[hash].[ext]
              limit: 10, // 小于10KB图片，转base64编码
              outputPath: "images", // 为你的文件配置自定义 output 输出目录
            }
          },
        ]
      },
    ]
  },
  // 插件
  plugins: [
    //清理打包文件
    new CleanWebpackPlugin(),
    //抽取css
    // new MiniCssExtractPlugin({
    //   filename: '[name]/style.css', //输出的css文件名，默认以入口文件名命名(例如main.css)
    //   chunkFilename: '[id].css', //公共样式？？
    // }),
    //代码分析
    (process.env.ANALYZER ? new BundleAnalyzerPlugin({ analyzerMode: "static" }) : () => { }),
    //多页面
    ...customTemplate()
  ],
  //优化
  optimization: {
    concatenateModules: process.env.ANALYZER ? false : true,  //分析模式禁用他，不然分析不全面
    // minimize: true, //开发模式也压缩代码
    minimizer: [
      //css压缩优化
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: 'advanced', // 需额外安装
        },
      }),
      //js压缩优化
      new TerserPlugin({
        parallel: true, // 可省略，默认开启并行
        terserOptions: {
          toplevel: true, // 最高级别，删除无用代码
          ie8: true,
          safari10: true,
        },
        extractComments: false, //关闭生成LICENSE文件
      })
    ],
    //拆包
    splitChunks: {
      chunks: 'async',
      cacheGroups: {
        // 打包第三方库的文件
        vendors: {
          name: `vendor`,
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          chunks: 'initial',
          // minChunks: 2, // 同时引用了2次才打包
        },
        // 打包业务中公共代码
        common: {
          name: `common`,
          minChunks: 2,  // 同时引用了2次才打包
          priority: -20,
          chunks: 'initial',
          reuseExistingChunk: true
        }
      }
    },
    runtimeChunk: { name: 'manifest' } // 运行时代码
  },
  //解析器
  resolve: {
    alias: {
      '@': resolve('../src')
    }
  },
}