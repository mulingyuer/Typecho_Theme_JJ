/*
 * @Author: mulingyuer
 * @Date: 2022-03-06 21:47:23
 * @LastEditTime: 2022-03-09 00:09:48
 * @LastEditors: mulingyuer
 * @Description: 生产模式配置
 * @FilePath: \Typecho_Theme_JJ\webpack\webpack.prod.ts
 * 怎么可能会有bug！！！
 */
import TerserPlugin from "terser-webpack-plugin";

interface ProdConfigInterface {
  mode: "production";
  devtool: string;
  optimization: {
    minimize: boolean;
    minimizer: [TerserPlugin];
  };
}

const prodConfig: ProdConfigInterface = {
  mode: "production", //等同于 webpack --mode=production
  devtool: "source-map", //控制是否生成sourcemap
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
