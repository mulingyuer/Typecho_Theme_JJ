/*
 * @Author: mulingyuer
 * @Date: 2023-03-15 19:54:42
 * @LastEditTime: 2024-04-20 22:21:31
 * @LastEditors: mulingyuer
 * @Description: 工具函数
 * @FilePath: /Typecho_Theme_JJ/src/utils/tool.ts
 * 怎么可能会有bug！！！
 */
/** 是否支持closest方法 */
export const isSupportClosest = (() => {
	const div = document.createElement("div");
	return !!div.closest;
})();

/**
 * @description: 防抖函数
 * @param {Function} fn 函数
 * @param {number} delay 延迟时间
 * @Date: 2023-05-20 13:15:02
 * @Author: mulingyuer
 */
export function debounce(fn: Function, delay: number) {
	let timer: any = null;
	return function (...args: any[]) {
		if (timer) clearTimeout(timer);
		timer = setTimeout(() => {
			fn.apply(this, args);
		}, delay);
	};
}

/**
 * @description: 节流函数
 * @param {Function} fn 函数
 * @param {number} delay 延迟时间
 * @Date: 2023-05-20 13:14:53
 * @Author: mulingyuer
 */
export function throttle(fn: Function, delay: number) {
	let timer: any = null;
	return function (...args: any[]) {
		if (!timer) {
			timer = setTimeout(() => {
				fn.apply(this, args);
				timer = null;
			}, delay);
		}
	};
}

/**
 * @description: 获取指定class的父元素
 * @param {HTMLElement} target 目标元素
 * @param {string} className 父元素class
 * @Date: 2023-05-20 12:49:53
 * @Author: mulingyuer
 */
export function findParentElementByClass(target: HTMLElement, className: string): HTMLElement | null {
	if (!target) return null;
	if (isSupportClosest) {
		return target.closest(`.${className}`);
	} else {
		let parent = target.parentElement;
		while (parent) {
			if (parent.classList.contains(className)) return parent;
			parent = parent.parentElement;
		}
		return null;
	}
}

/**
 * @description: 拼接主题路径
 * @param {string} path 需要拼接的路径
 * @Date: 2023-05-20 13:18:26
 * @Author: mulingyuer
 */
export function joinThemePath(path?: string): string {
	const metaPath: HTMLElement | null = document.querySelector("meta[name=path]");
	if (!metaPath) return "";
	const str = metaPath.getAttribute("content");
	if (typeof str === "string" && str.trim() !== "") {
		return `${str}${path}`;
	}
	return "";
}

/** 拼接path地址 */
export function joinPath(...args: string[]) {
	return args.reduce((start, end) => {
		if (!start) return end;
		return start.replace(/\/$/, "") + "/" + end.replace(/^\//, "");
	}, "");
}
