/*
 * @Author: mulingyuer
 * @Date: 2023-05-20 12:42:09
 * @LastEditTime: 2023-05-20 16:17:03
 * @LastEditors: mulingyuer
 * @Description: 错误处理
 * @FilePath: \Typecho_Theme_JJ\src\utils\error.ts
 * 怎么可能会有bug！！！
 */
import { findParentElementByClass, joinThemePath } from "@/utils/tool";

/**
 * @description: 友链图片错误处理
 * @param {ErrorEvent} event 错误事件
 * @Date: 2023-05-20 16:00:51
 * @Author: mulingyuer
 */
function linksImgError(event: ErrorEvent) {
	const target = event.target as HTMLImageElement;
	const isImg = target.tagName.toLocaleLowerCase() === "img";
	if (!isImg) return;
	//判断是不是友链图片
	const isLinkImg = !!findParentElementByClass(target, "links-page-body");
	if (!isLinkImg) return;

	const defaultImgSrc = joinThemePath("static/images/links/default.png");
	//防止重复替换
	if (target.src !== defaultImgSrc) {
		target.src = defaultImgSrc;
	}
}

/**
 * @description: 全局错误分化处理函数，各种错误函数处理都会运行，但是各自处理各自的错误
 * @param {ErrorEvent} event 错误事件
 * @Date: 2023-05-20 16:00:22
 * @Author: mulingyuer
 */
function globalErrorCallback(event: ErrorEvent) {
	//友链图片错误
	linksImgError(event);
}

/**
 * @description: 全局图片错误处理
 * @Date: 2023-05-20 12:42:57
 * @Author: mulingyuer
 */
export function initGlobalImgLoadError() {
	if (!window.$globalError) return;
	//有错误先处理完
	if (window.$globalError.list.length > 0) {
		window.$globalError.list.forEach((event) => {
			globalErrorCallback(event);
		});
		//清空数组
		window.$globalError.list = [];
	}
	//挂载全局错误处理
	window.$globalError.callback = globalErrorCallback;
}
