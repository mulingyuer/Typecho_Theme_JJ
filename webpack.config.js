/*
 * @Author: mulingyuer
 * @Date: 2021-07-01 22:17:24
 * @LastEditTime: 2021-07-03 18:53:09
 * @LastEditors: mulingyuer
 * @Description:webpack配置文件
 * @FilePath: \JJ\webpack.config.js
 * 怎么可能会有bug！！！
 */
const path = require('path');
const resolve = function (myPath) {
  return path.resolve(__dirname, myPath);
};

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

module.exports = (env, argv) => ({
  mode: argv.mode || 'development',  //模式 development、production
  //模式类型，是否生成map啥的：eval、 source-map, inline-source-map, hidden-source-map and nosources-source-map
  devtool: argv.mode === 'production' ? 'source-map' : 'eval',
  //入口
  entry: {
    index: './src/pages/home/index.js',
    about: './src/pages/about/index.js',
  },
  // 出口
  output: {
    path: resolve('./dist'), //指定输出目录
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
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          },
          'postcss-loader'
        ]
      },
      // scss
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          },
          'postcss-loader',
          'sass-loader',
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
          }
        },
      }
    ]
  },
  // 插件
  plugins: [
    //清理打包文件
    new CleanWebpackPlugin(),
    //抽取css
    new MiniCssExtractPlugin({
      filename: '[name]/style.css', //输出的css文件名，默认以入口文件名命名(例如main.css)
      chunkFilename: "[id].css", //公共样式？？
    }),
    //代码分析
    (process.env.ANALYZER && new BundleAnalyzerPlugin({
      analyzerMode: "static",  //生成静态文件
    })),
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
      cacheGroups: {
        // 打包业务中公共代码
        common: {
          name: "common",
          chunks: "initial",
          minSize: 1,
          priority: 0,
          minChunks: 2, // 同时引用了2次才打包
        },
        // 打包第三方库的文件
        vendor: {
          name: "vendor",
          test: /[\\/]node_modules[\\/]/,
          chunks: "initial",
          priority: 10,
          minChunks: 2, // 同时引用了2次才打包
        }
      }
    },
    runtimeChunk: { name: 'manifest' } // 运行时代码
  },
  //解析器
  resolve: {
    alias: {
      '@': resolve('./src')
    }
  },
  // 监听
  watch: argv.mode === 'development',  //开发模式监听
  //监听的配置
  watchOptions: {
    aggregateTimeout: 600,  //延迟600ms打包
    ignored: /node_modules/,  //忽略
  }

})