/** 两种语言标记前缀：HighDown 输出 language-xxx，部分渲染器用 lang-xxx */
const LANG_CLASS_PREFIX = ["language-", "lang-"];
/** Mermaid 代码块的原始语言名（大小写不敏感） */
const MERMAID_LANG = "mermaid";

/**
 * @description: 判断某个 code 元素是否是 Mermaid 图表块。
 * Mermaid 必须完全跳过普通高亮链路与复制 / 折叠头部，交由 features/mermaid-chart 独立处理；
 * 顺序很关键：先判定再走 shiki，否则会被当成未知语言降级成 text 并插入 UI 结构。
 * @param {HTMLElement} codeEl 目标 code 元素
 */
export function isMermaidBlock(codeEl: HTMLElement): boolean {
	for (const value of codeEl.classList) {
		for (const prefix of LANG_CLASS_PREFIX) {
			if (!value.startsWith(prefix)) continue;
			if (value.slice(prefix.length).trim().toLowerCase() === MERMAID_LANG) {
				return true;
			}
		}
	}
	return false;
}
