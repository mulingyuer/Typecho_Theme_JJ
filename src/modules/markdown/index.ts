import "./style.scss";
import "medium-zoom/dist/style.css";
import { CodeBlock } from "./features/code-block";
import { initImageZoom } from "./features/image-zoom";
import { loadMarkdownEnhancements } from "./features/enhance-loader";

const initializedRoots = new WeakSet<HTMLElement>();

export interface MarkdownInitOptions {
	/** 是否启用代码块 UI 与高亮，默认 true */
	enableCodeBlock?: boolean;
	/** 是否启用图片灯箱，默认 true */
	enableImageZoom?: boolean;
	/** 是否按 data-enhance-* 加载公式和 Mermaid，默认 true */
	enableOptionalEnhancements?: boolean;
}

/**
 * 初始化一个明确声明为 data-markdown-root 的正文容器。
 */
export function initMarkdown(root: HTMLElement, options: MarkdownInitOptions = {}): void {
	if (initializedRoots.has(root)) return;
	initializedRoots.add(root);

	const { enableCodeBlock = true, enableImageZoom = true, enableOptionalEnhancements = true } = options;

	if (enableCodeBlock) {
		try {
			const codeBlock = new CodeBlock();
			codeBlock.bind(root);
			const queue = codeBlock.collectQueue();

			if (typeof IntersectionObserver === "undefined") {
				queue.forEach((pre) => codeBlock.highlightOne(pre));
			} else {
				const highlightObserver = new IntersectionObserver(
					(entries) => {
						for (const entry of entries) {
							if (!entry.isIntersecting) continue;
							const target = entry.target as HTMLPreElement;
							highlightObserver.unobserve(target);
							codeBlock.highlightOne(target);
						}
					},
					{ rootMargin: "200px 0px" }
				);

				queue.forEach((pre) => highlightObserver.observe(pre));
			}
		} catch (error) {
			console.warn("[markdown] 代码块增强失败，保留服务端代码文本：", error);
		}
	}

	if (enableImageZoom) {
		try {
			initImageZoom(root);
		} catch (error) {
			console.warn("[markdown] 图片灯箱增强失败，图片仍按普通图片显示：", error);
		}
	}

	if (enableOptionalEnhancements) {
		void loadMarkdownEnhancements(root);
	}
}

document.querySelectorAll<HTMLElement>("[data-markdown-root]").forEach((root) => {
	initMarkdown(root, {
		enableCodeBlock: root.dataset.enableCodeBlock !== "false",
		enableImageZoom: root.dataset.enableImageZoom !== "false",
		enableOptionalEnhancements: root.dataset.enableOptionalEnhancements !== "false"
	});
});
