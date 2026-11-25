/**
 * @description: 文章正文增强调度层。
 * 负责读取模板输出的 data-enhance-* 标记并动态加载对应模块，两者互相独立、互不依赖：
 * - 公式模块只在 data-enhance-math 存在时按需加载 KaTeX；
 * - 图表模块只在 data-enhance-mermaid 存在时按需加载 Mermaid。
 * 未标记时完全不触发任何动态 import（普通文章不会下载对应资源）。
 */

const MARKDOWN_ROOT_ID = "markdown";
const MATH_ATTR = "data-enhance-math";
const MERMAID_ATTR = "data-enhance-mermaid";

/** 已启动过的能力集合，保证同一页面内重复调用不重复初始化 */
const started = new Set<"math" | "mermaid">();

/**
 * @description: 按容器标记加载增强能力（幂等，可安全重复调用）
 */
export async function loadArticleEnhancements(): Promise<void> {
	const root = document.getElementById(MARKDOWN_ROOT_ID);
	if (!(root instanceof HTMLElement)) return;

	const tasks: Promise<unknown>[] = [];

	if (!started.has("math") && root.hasAttribute(MATH_ATTR)) {
		started.add("math");
		tasks.push(import("./math-formula").then(({ renderMathFormulas }) => renderMathFormulas(root)));
	}

	if (!started.has("mermaid") && root.hasAttribute(MERMAID_ATTR)) {
		started.add("mermaid");
		tasks.push(import("./mermaid-chart").then(({ initMermaidLazyRender }) => initMermaidLazyRender()));
	}

	await Promise.all(tasks).catch((error) => {
		// 任一增强失败都不能影响正文阅读：这里只记录一次，原始内容保持不变
		console.warn("[enhance-loader] 增强模块加载失败，保留原始正文：", error);
	});
}
