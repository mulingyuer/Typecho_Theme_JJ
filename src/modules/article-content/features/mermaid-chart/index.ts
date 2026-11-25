import mermaid, { type MermaidConfig } from "mermaid";
import "./style.scss";

/** 承载图表的代码块容器选择器：HighDown 语言标记形如 language-mermaid */
const MERMAID_CODE_SELECTOR = 'pre > code[class*="language-mermaid"], pre > code[class*="lang-mermaid"]';
/** 图表挂载类名，尺寸与配色在模块 SCSS 中消费 */
const CHART_CLASS = "mermaid-chart";
/** 已排队 / 已处理标记，保证重复初始化不会二次渲染 */
const QUEUED_ATTR = "data-mermaid-queued";
const RENDERED_ATTR = "data-mermaid-rendered";
/** 记录每个 pre 的图表原文，来源为服务端 data-mermaid-source，缺失时用 code 文本兜底 */
const SOURCE_MAP_ATTR = "data-mermaid-source";

let instance: Promise<typeof mermaid> | undefined;
let diagramCounter = 0;
let observer: IntersectionObserver | null = null;
const pending = new Set<HTMLPreElement>();

/**
 * @description: Mermaid 按需增强模块。
 * 独立动态 import：基础文章入口不加载；只有模板输出 data-enhance-mermaid 时才会走到这里。
 */

/**
 * @description: 读取主题侧写入的图表定义文本（服务端按代码块出现顺序一次性给足）
 * @returns {string[]} 图表源码数组；解析失败或无数据时返回空数组
 */
function readSources(): string[] {
	const raw = document.getElementById("markdown")?.getAttribute("data-mermaid-source");
	if (!raw) return [];
	try {
		const parsed: unknown = JSON.parse(raw);
		return Array.isArray(parsed)
			? parsed.filter((item): item is string => typeof item === "string" && item.trim() !== "")
			: [];
	} catch (error) {
		console.warn("[mermaid-chart] data-mermaid-source 解析失败：", error);
		return [];
	}
}

/**
 * @description: 获取全局唯一的 mermaid 实例。配置集中在此，便于统一调整安全与视觉参数。
 */
async function getInstance(): Promise<typeof mermaid> {
	instance ??= (async () => {
		const config: MermaidConfig = {
			startOnLoad: false,
			// strict：保留 SVG，但禁用点击等脚本交互，降低文章内图表标记带来的不可控行为
			securityLevel: "strict",
			// 跟随正文排版字体（系统默认字体栈与 :root 一致）
			fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, PingFang SC, Microsoft YaHei, sans-serif",
			themeVariables: { fontSize: "14px" }
		};
		mermaid.initialize(config);
		return mermaid;
	})();
	return instance;
}

/**
 * @description: 渲染单个 Mermaid 代码块。
 * 成功：用图表容器替换 <code>；失败：保留原代码块原文并降级为纯文本代码块，绝不清空。
 * @param {HTMLPreElement} pre 目标 pre 元素
 */
async function renderOne(pre: HTMLPreElement): Promise<void> {
	const source = pre.getAttribute(SOURCE_MAP_ATTR);
	if (!source) {
		pending.delete(pre);
		observer?.unobserve(pre);
		return;
	}
	const srcId = `mmd-${Date.now().toString(36)}-${(diagramCounter++).toString(36)}`;
	try {
		await getInstance();
		const { svg } = await mermaid.render(srcId, source);
		const chart = document.createElement("div");
		chart.className = CHART_CLASS;
		// mermaid 输出的 svg 带 role/aria-label；外层容器负责滚动与间距，长图不会撑破正文宽度
		chart.innerHTML = svg;
		const codeEl = pre.querySelector("code");
		if (codeEl instanceof HTMLElement) {
			codeEl.replaceWith(chart);
		} else {
			pre.appendChild(chart);
		}
		pre.setAttribute(RENDERED_ATTR, "done");
	} catch (error) {
		pre.classList.add("mermaid-fallback");
		pre.setAttribute(RENDERED_ATTR, "fallback");
		console.warn(`[mermaid-chart] 图表渲染失败，已保留原始代码（${srcId}）：`, error);
	} finally {
		pending.delete(pre);
		observer?.unobserve(pre);
	}
}

/** 无 IntersectionObserver 能力时的降级路径：立即渲染等待队列 */
function flushPending(): void {
	pending.forEach((pre) => void renderOne(pre));
}

/**
 * @description: 初始化 Mermaid 懒渲染：登记代码块 + 建视口观察器。可重复调用，内部幂等。
 */
export function initMermaidLazyRender(): void {
	const nodes = Array.from(document.querySelectorAll<HTMLElement>(MERMAID_CODE_SELECTOR));
	if (nodes.length === 0) return;

	const sources = readSources();
	nodes.forEach((node, index) => {
		const pre = node.closest("pre");
		if (!(pre instanceof HTMLPreElement)) return;
		if (pre.hasAttribute(RENDERED_ATTR) || pre.hasAttribute(QUEUED_ATTR)) return;
		// 服务端未给出原文时退回 <code> 文本兜底（此时高亮尚未改写内容）
		const source = sources[index] ?? node.textContent?.trim() ?? "";
		if (source === "") return;
		pre.setAttribute(SOURCE_MAP_ATTR, source);
		pre.setAttribute(QUEUED_ATTR, "1");
		pending.add(pre);
	});

	if (observer) {
		pending.forEach((pre) => observer?.observe(pre));
		return;
	}

	if (typeof IntersectionObserver === "undefined") {
		flushPending();
		return;
	}
	observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (!entry.isIntersecting) continue;
				void renderOne(entry.target as HTMLPreElement);
			}
		},
		// rootMargin 提前拉起 mermaid chunk，减少滚到图表前的等待
		{ rootMargin: "200px 0px" }
	);
	pending.forEach((pre) => observer?.observe(pre));
}
