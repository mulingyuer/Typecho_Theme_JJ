/*
 * @Author: mulingyuer
 * @Date: 2023-05-20 13:24:44
 * @LastEditTime: 2023-05-20 13:28:03
 * @LastEditors: mulingyuer
 * @Description: 全局错误捕获
 * @FilePath: \Typecho_Theme_JJ\static\scripts\globalError.js
 * 怎么可能会有bug！！！
 */

window.$globalError = {
	/** 错误记录数据数组 */
	list: [],
	/** 错误记录处理回调 */
	callback: null
};

window.addEventListener(
	"error",
	function (event) {
		if (typeof window.$globalError.callback === "function") {
			window.$globalError.callback(event);
		} else {
			window.$globalError.list.push(event);
		}
	},
	true
);
