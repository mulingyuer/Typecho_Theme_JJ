import { highlightCode } from "./highlighter";
import type { ThemedToken } from "shiki";

/** 行号容器类名（渲染进 code 内，选择器同步落在 base.css） */
const LINE_CLASS = "line";
/** 行号显示开关类名，加在 code 上 */
const SHOW_NUMBER_CLASS = "has-line-number";
/** 标记已高亮，避免重复处理 */
const HIGHLIGHTED_ATTR = "data-code-highlighted";

export interface HighlightOptions {
	/** shiki 语言 id，未知/未识别传 "text" */
	lang: string;
	/** 语言标签的显示文本 */
	label: string;
	/** shiki 主题 id */
	themeId: string;
}

/**
 * @description: 把 shiki 的 token 样式转成 span 内联样式。
 * fontStyle 是 Textmate FountStyle 位掩码：1 italic / 2 bold / 4 underline / 8 strikethrough，位可叠加。
 * @param {Record<string, unknown>} styles token 上的颜色与字体样式
 */
function buildTokenStyle(styles: Record<string, unknown>): string {
	const parts: string[] = [];
	if (typeof styles.color === "string") parts.push(`color:${styles.color}`);
	if (typeof styles.bgColor === "string") parts.push(`background-color:${styles.bgColor}`);
	const fontStyle = Number(styles.fontStyle ?? 0);
	if (fontStyle & 1) parts.push("font-style:italic");
	if (fontStyle & 2) parts.push("font-weight:bold");
	if (fontStyle & 4) parts.push("text-decoration:underline");
	if (fontStyle & 8) parts.push("text-decoration:line-through");
	return parts.join(";");
}

/**
 * @description: 用结构化 tokens 渲染单个代码块，替换 code 的现有内容。
 * 不用 shiki 的 codeToHtml：其自带 <pre class="shiki"> 外壳会与文章主题的 padding / 滚动条 / 背景定制冲突。
 * @param {HTMLElement} codeEl 目标 code 元素
 * @param {HighlightOptions} options 高亮所需参数
 */
export async function renderCodeBlock(codeEl: HTMLElement, options: HighlightOptions): Promise<void> {
	// 未高亮前 code 内只有服务端直出的纯文本；取一次原文，去掉末尾多余换行
	const rawText = (codeEl.textContent ?? "").replace(/\n$/, "");
	codeEl.classList.add(SHOW_NUMBER_CLASS);
	// 加稳定类名，供模块样式覆盖各文章主题的 pre > code 背景规则（旧 .hljs 兼容分支不再保留）
	codeEl.classList.add("code-block");

	let result: { lines: ThemedToken[][]; fg?: string; bg?: string };
	try {
		result = await highlightCode(rawText, options.lang, options.themeId);
	} catch (error) {
		console.warn("[code-highlight] 高亮失败，保留纯文本：", error);
		// 兜底也要保证行号结构可用：整段作为一个 token 渲染
		renderPlainText(codeEl, rawText);
		codeEl.setAttribute(HIGHLIGHTED_ATTR, "fallback");
		const failedPre = codeEl.closest("pre");
		if (failedPre instanceof HTMLElement) {
			failedPre.style.setProperty("--code-block-bg", "transparent");
			failedPre.style.setProperty("--code-block-fg", "inherit");
		}
		return;
	}

	const fragment = document.createDocumentFragment();
	result.lines.forEach((tokens, index) => {
		const line = document.createElement("span");
		line.className = LINE_CLASS;
		// data-line-num 配合 CSS ::before 输出行号，伪元素内容不进 textContent，复制保持纯代码
		line.dataset.lineNum = String(index + 1);
		for (const token of tokens) {
			const span = document.createElement("span");
			span.textContent = token.content;
			const style = buildTokenStyle({
				color: token.color,
				bgColor: token.bgColor,
				fontStyle: token.fontStyle
			});
			if (style) span.setAttribute("style", style);
			line.appendChild(span);
		}
		fragment.appendChild(line);
		// 行 span 之间显式插入换行文本节点，保证 textContent 与原文一致（否则复制内容会丢换行）
		if (index < result.lines.length - 1) fragment.appendChild(document.createTextNode("\n"));
	});

	codeEl.replaceChildren(fragment);
	// 背景 / 前景注入到 pre 上的 CSS 变量，由模块 SCSS 统一消费
	const pre = codeEl.closest("pre");
	if (pre instanceof HTMLElement) {
		pre.style.setProperty("--code-block-bg", result.bg ?? "transparent");
		pre.style.setProperty("--code-block-fg", result.fg ?? "inherit");
	}
	codeEl.setAttribute(HIGHLIGHTED_ATTR, "done");
}

/** 高亮失败时按纯文本渲染行号结构 */
function renderPlainText(codeEl: HTMLElement, text: string): void {
	const fragment = document.createDocumentFragment();
	const lines = text.split("\n");
	lines.forEach((content, index) => {
		const line = document.createElement("span");
		line.className = LINE_CLASS;
		line.dataset.lineNum = String(index + 1);
		line.textContent = content;
		fragment.appendChild(line);
		if (index < lines.length - 1) fragment.appendChild(document.createTextNode("\n"));
	});
	codeEl.replaceChildren(fragment);
}

/**
 * @description: 判断代码块是否已经处理过
 * @param {HTMLElement} codeEl 目标 code 元素
 */
export function isHighlighted(codeEl: HTMLElement): boolean {
	return codeEl.getAttribute(HIGHLIGHTED_ATTR) !== null;
}
