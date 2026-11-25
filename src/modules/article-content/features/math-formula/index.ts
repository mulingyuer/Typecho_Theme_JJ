import renderMathInElement from "katex/contrib/auto-render";
import "katex/dist/katex.min.css";
import "./style.scss";

/** 正文根容器 */
const ROOT_SELECTOR = ".markdown-body";
/** 不参与公式扫描的元素：代码块、脚本样式，以及 KaTeX 自己渲染出的节点（避免二次处理） */
const SKIP_SELECTOR = "code, pre, script, style, textarea, .katex, .katex-display";
/** 已被本模块扫描过的标记，保证重复初始化时不会二次渲染 */
const SCANNED_ATTR = "data-math-scanned";

/**
 * @description: 数学公式按需增强模块。
 * 只有文章模板输出了 data-enhance-math 时，才会被 article-content/index.ts 动态 import，普通文章不下载 KaTeX。
 */

/**
 * @description: 扫描并渲染正文中的行内 / 块级公式。
 * 用 KaTeX 的 auto-render 按文本节点处理，不整段改写 HTML，图片、链接等原有结构保持不动；
 * 单个公式出错时该节点保留原文并给出开发者工具警告，其他公式不受影响。
 * @param {HTMLElement} [container] 目标容器，默认取第一个 .markdown-body
 */
export async function renderMathFormulas(container?: HTMLElement): Promise<void> {
	const root = container ?? (document.querySelector(ROOT_SELECTOR) as HTMLElement | null);
	if (!root || root.hasAttribute(SCANNED_ATTR)) {
		return;
	}
	root.setAttribute(SCANNED_ATTR, "1");

	try {
		renderMathInElement(root, {
			delimiters: [
				{ left: "\\(", right: "\\)", display: false },
				{ left: "\\[", right: "\\]", display: true },
				{ left: "$$", right: "$$", display: true },
				{ left: "$", right: "$", display: false }
			],
			throwOnError: false,
			strict: false,
			errorCallback: (error: unknown) => {
				console.warn("[math-formula] 公式渲染异常：", error);
			},
			ignoredTags: SKIP_SELECTOR.split(",").map((tag) => tag.trim())
		});
	} catch (error) {
		// KaTeX 加载或初始化失败：不清空正文，仅记录一次并把扫描标记撤销，便于后续重试
		console.warn("[math-formula] 初始化失败，保留原文：", error);
		root.removeAttribute(SCANNED_ATTR);
	}
}
