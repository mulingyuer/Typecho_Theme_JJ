/*
 * @Author: mulingyuer
 * @Date: 2023-03-29 23:51:59
 * @LastEditTime: 2026-09-27 17:58:42
 * @LastEditors: mulingyuer
 * @Description: 复制
 * @FilePath: \Typecho_Theme_JJ\src\utils\copy.ts
 * 怎么可能会有bug！！！
 */

/**
 * @description: 从入参中提取要复制的纯文本
 * @param {string | HTMLElement} val
 */
function resolveText(val: string | HTMLElement): string {
	if (typeof val === "string") return val;
	if (val instanceof HTMLInputElement || val instanceof HTMLTextAreaElement || val instanceof HTMLSelectElement) {
		return val.value;
	}
	// 行号等通过 CSS 伪元素渲染的内容不在 textContent 中，天然被排除
	return val.textContent ?? "";
}

/**
 * @description: 通过 execCommand 降级复制（用于非安全上下文或老浏览器）
 * @param {string} text
 */
function fallbackCopy(text: string): boolean {
	const textarea = document.createElement("textarea");
	textarea.value = text;
	// 只读防止选中而产生的页面跳动
	textarea.readOnly = true;
	// 不让元素展示出来
	textarea.style.position = "absolute";
	textarea.style.left = "-9999px";
	textarea.style.top = "-9999px";
	textarea.style.opacity = "0";
	textarea.style.visibility = "hidden";
	document.body.appendChild(textarea);
	// 选中元素的文本
	textarea.select();
	textarea.setSelectionRange(0, text.length);
	// 复制命令
	const copyFlag = document.execCommand("copy");
	// 用完删除
	textarea.remove();

	return copyFlag;
}

/**
 * @description: 复制函数，优先使用 Clipboard API，降级 execCommand
 * @param {string | HTMLElement} val
 */
export default async function copy(val: string | HTMLElement): Promise<boolean> {
	const text = resolveText(val);

	// 优先走现代 Clipboard API（需要安全上下文：HTTPS 或 localhost）
	if (navigator.clipboard && window.isSecureContext) {
		try {
			await navigator.clipboard.writeText(text);
			return true;
		} catch (error) {
			// 某些场景（如权限被拒）会抛错，继续走降级方案
			console.warn("Clipboard API 复制失败，尝试降级方案：", error);
		}
	}

	// 降级方案
	if (fallbackCopy(text)) {
		return true;
	}

	// 保持原有契约：失败时 reject，调用方走 .catch 分支
	console.warn("复制失败：当前环境不支持复制功能");
	throw new Error("复制失败");
}
