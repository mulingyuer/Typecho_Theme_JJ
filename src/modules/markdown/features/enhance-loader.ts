const MATH_ATTR = "data-enhance-math";
const MERMAID_ATTR = "data-enhance-mermaid";
const MATH_STARTED_ATTR = "data-math-started";
const MERMAID_STARTED_ATTR = "data-mermaid-started";

async function loadMath(root: HTMLElement): Promise<void> {
	try {
		const { renderMathFormulas } = await import("./math-formula");
		await renderMathFormulas(root);
	} catch (error) {
		console.warn("[markdown] 数学公式增强加载失败，保留原始表达式：", error);
	}
}

async function loadMermaid(root: HTMLElement): Promise<void> {
	try {
		const { initMermaidLazyRender } = await import("./mermaid-chart");
		initMermaidLazyRender(root);
	} catch (error) {
		console.warn("[markdown] Mermaid 增强加载失败，保留原始代码块：", error);
	}
}

/**
 * 根据模板声明的 data-enhance-* 标记独立加载可选能力。
 */
export async function loadMarkdownEnhancements(root: HTMLElement): Promise<void> {
	const tasks: Promise<void>[] = [];

	if (!root.hasAttribute(MATH_STARTED_ATTR) && root.hasAttribute(MATH_ATTR)) {
		root.setAttribute(MATH_STARTED_ATTR, "1");
		tasks.push(loadMath(root));
	}

	if (!root.hasAttribute(MERMAID_STARTED_ATTR) && root.hasAttribute(MERMAID_ATTR)) {
		root.setAttribute(MERMAID_STARTED_ATTR, "1");
		tasks.push(loadMermaid(root));
	}

	await Promise.all(tasks);
}
