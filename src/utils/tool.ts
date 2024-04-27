/*
 * @Author: mulingyuer
 * @Date: 2023-03-15 19:54:42
 * @LastEditTime: 2024-04-27 18:43:23
 * @LastEditors: mulingyuer
 * @Description: 工具函数
 * @FilePath: /Typecho_Theme_JJ/src/utils/tool.ts
 * 怎么可能会有bug！！！
 */
import { MD5 } from "crypto-js";

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

/** 合并配置项，值为undefined的不会覆盖之前的值 */
export function mergeConfig<T = any>(...args: any[]): T {
	return args.reduce((preConfig, currentConfig) => {
		for (const [key, value] of Object.entries(currentConfig)) {
			if (value !== undefined) {
				preConfig[key] = value;
			} else if (!Object.prototype.hasOwnProperty.call(preConfig, key)) {
				// 新增项，虽然值是undefined，但是之前没有这个key
				preConfig[key] = value;
			}
		}
		return preConfig;
	}, {});
}

/** 生成gravatar全球头像参数类型 */
export type GeneratedGravatarOptions = {
	/** 邮箱 */
	email: string;
	/** 大小 */
	size?: number;
	/** 头像源 */
	originPreFix?: string;
};
/** 生成gravatar全球头像 */
export const generatedGravatar = (function () {
	const defaultOptions: Required<Omit<GeneratedGravatarOptions, "email">> = {
		size: 80,
		originPreFix: "https://cravatar.cn/avatar/"
	};
	return function generatedGravatar(options: GeneratedGravatarOptions) {
		options = mergeConfig(defaultOptions, options);
		const { email, size, originPreFix } = options;
		return `${originPreFix}${MD5(email)}?s=${size}&d=identicon`;
	};
})();
