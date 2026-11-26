import renderMathInElement from "katex/contrib/auto-render";
import "katex/dist/katex.min.css";
import "./style.scss";

const SKIP_SELECTOR = "code, pre, script, style, textarea, .katex, .katex-display";
const SCANNED_ATTR = "data-math-scanned";

/**
 * 在一个 Markdown 根节点内渲染数学公式。
 * KaTeX 仅在调用方检测到 data-enhance-math 后动态导入。
 */
export async function renderMathFormulas(root: HTMLElement): Promise<void> {
	if (root.hasAttribute(SCANNED_ATTR)) return;
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
				console.warn("[math-formula] 单个公式渲染失败，保留原表达式：", error);
			},
			ignoredTags: SKIP_SELECTOR.split(",").map((tag) => tag.trim())
		});
	} catch (error) {
		console.warn("[math-formula] 数学公式增强失败，保留原正文：", error);
		root.removeAttribute(SCANNED_ATTR);
	}
}
