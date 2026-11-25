import "./style.scss";
import "medium-zoom/dist/style.css";
import { CodeBlock } from "./features/code-block";
import { initImageZoom } from "./features/image-zoom";
import { loadArticleEnhancements } from "./features/enhance-loader";

// 代码块 UI / header / 交互：内部会扫描所有 pre 并补好 header、语言标签与复制按钮
const codeBlock = new CodeBlock();

// 视口懒调度：代码块进入视口才真正发起 shiki 高亮（折叠块 display:none 不触发）
const highlightObserver = new IntersectionObserver(
	(entries) => {
		for (const entry of entries) {
			if (!entry.isIntersecting) continue;
			const target = entry.target as HTMLPreElement;
			highlightObserver.unobserve(target);
			codeBlock.highlightOne(target);
		}
	},
	// rootMargin 提前 200px：滚动过程中提前把 WASM / 主题 / 语言 chunk 拉起来，避免到达视口才等待
	{ rootMargin: "200px 0px" }
);

for (const pre of codeBlock.collectQueue()) {
	highlightObserver.observe(pre);
}

// 灯箱逻辑
initImageZoom();

// Load optional math and Mermaid enhancements when the template marks them.
void loadArticleEnhancements();
