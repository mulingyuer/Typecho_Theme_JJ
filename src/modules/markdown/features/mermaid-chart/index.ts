import mermaid, { type MermaidConfig } from "mermaid";
import "./style.scss";

const MERMAID_CODE_SELECTOR = 'pre > code[class*="language-mermaid"], pre > code[class*="lang-mermaid"]';
const CHART_CLASS = "mermaid-chart";
const QUEUED_ATTR = "data-mermaid-queued";
const RENDERED_ATTR = "data-mermaid-rendered";
const SOURCE_MAP_ATTR = "data-mermaid-source";

let instance: Promise<typeof mermaid> | undefined;
let diagramCounter = 0;
let observer: IntersectionObserver | null = null;
const pending = new Set<HTMLPreElement>();

function readSources(root: HTMLElement): string[] {
	const raw = root.getAttribute("data-mermaid-source");
	if (!raw) return [];

	try {
		const parsed: unknown = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed.map((item) => (typeof item === "string" ? item : "")) : [];
	} catch (error) {
		console.warn("[mermaid-chart] data-mermaid-source 解析失败：", error);
		return [];
	}
}

async function getInstance(): Promise<typeof mermaid> {
	instance ??= (async () => {
		const config: MermaidConfig = {
			startOnLoad: false,
			securityLevel: "strict",
			fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, PingFang SC, Microsoft YaHei, sans-serif",
			themeVariables: { fontSize: "14px" }
		};
		mermaid.initialize(config);
		return mermaid;
	})();

	return instance;
}

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
		chart.innerHTML = svg;

		const codeEl = pre.querySelector("code");
		if (!(codeEl instanceof HTMLElement)) return;

		codeEl.replaceWith(chart);
		pre.setAttribute(RENDERED_ATTR, "done");
	} catch (error) {
		pre.classList.add("mermaid-fallback");
		pre.setAttribute(RENDERED_ATTR, "fallback");
		console.warn(`[mermaid-chart] 图表 ${srcId} 渲染失败，保留原始代码：`, error);
	} finally {
		pending.delete(pre);
		observer?.unobserve(pre);
	}
}

function flushPending(): void {
	pending.forEach((pre) => void renderOne(pre));
}

export function initMermaidLazyRender(root: HTMLElement): void {
	const nodes = Array.from(root.querySelectorAll<HTMLElement>(MERMAID_CODE_SELECTOR));
	if (nodes.length === 0) return;

	const sources = readSources(root);
	nodes.forEach((node, index) => {
		const pre = node.closest("pre");
		if (!(pre instanceof HTMLPreElement)) return;
		if (pre.hasAttribute(RENDERED_ATTR) || pre.hasAttribute(QUEUED_ATTR)) return;

		const mappedSource = sources[index]?.trim() ?? "";
		const source = mappedSource || node.textContent?.trim() || "";
		if (source === "") return;

		pre.setAttribute(SOURCE_MAP_ATTR, source);
		pre.setAttribute(QUEUED_ATTR, "1");
		pending.add(pre);
	});

	if (typeof IntersectionObserver === "undefined") {
		flushPending();
		return;
	}

	if (!observer) {
		observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (!entry.isIntersecting) continue;
					void renderOne(entry.target as HTMLPreElement);
				}
			},
			{ rootMargin: "200px 0px" }
		);
	}

	pending.forEach((pre) => observer?.observe(pre));
}
