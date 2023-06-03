/*
 * @Author: mulingyuer
 * @Date: 2022-12-18 20:49:25
 * @LastEditTime: 2023-03-21 18:55:16
 * @LastEditors: mulingyuer
 * @Description: webpack prod配置
 * @FilePath: \Typecho_Theme_JJ\webpack\webpack.prod.ts
 * 怎么可能会有bug！！！
 */
import type { Configuration } from "webpack";
import { merge } from "webpack-merge";
import common from "./webpack.common";
import CompressionPlugin from "compression-webpack-plugin";

export default merge(common, {
	mode: "production",
	// devtool: "hidden-source-map", //不配置就不会产生map，不然就算是hidden也会产生map文件
	plugins: [
		new CompressionPlugin({
			algorithm: "gzip", //压缩算法，默认gzip
			test: /\.(js|css)(\?.*)?$/i, //指定什么文件进行压缩
			threshold: 10240 //大于10kb就压，默认0kb
			// minRatio: 0.8, //压缩比 默认0.8
			// deleteOriginalAssets: false, //是否删除压缩的源文件  ，默认false
		})
	],
	optimization: {
		usedExports: true //开启tree shaking
	}
} as Configuration);
