import copy from "@/utils/copy";
import { ElMessage } from "element-plus";
import { preloadWasm } from "../code-highlight/highlighter";
import { isHighlighted, renderCodeBlock } from "../code-highlight";
import { hasLanguage, readRawLanguage, resolveLanguageId, resolveLanguageLabel } from "../code-highlight/lang-map";
import { FALLBACK_THEME_ID, resolveThemeId } from "../code-highlight/theme-map";

/** 折叠按钮 svg */
const FOLD_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M16.924 9.617A1 1 0 0 0 16 9H8a1 1 0 0 0-.707 1.707l4 4a1 1 0 0 0 1.414 0l4-4a1 1 0 0 0 .217-1.09z" data-name="Down"></path></svg>`;

/** 无扩展名 / 未识别语言时的纯文本兜底 id（shiki 内置特殊语言） */
const PLAIN_LANG = "text";

/**
 * @description: 代码块 UI 与交互模块。只负责 DOM 结构与用户操作，高亮细节全部委托给 ../code-highlight
 */
export class CodeBlock {
	/** 文章正文容器 */
	private article: HTMLElement | null = document.querySelector(".markdown-body");
	/** 复制按钮定时器（恢复文案用） */
	private copyBtnTimers = new Map<HTMLElement, ReturnType<typeof setTimeout>>();

	constructor() {
		if (!this.article) return;
		this.init();
	}

	/** 扫描所有 pre：补齐 header、解析语言，并把实际高亮动作登记到待处理队列 */
	private init() {
		const preList = Array.from(this.article!.querySelectorAll("pre"));
		preList.forEach((pre) => this.prepareCodeBlock(pre));
	}

	/**
	 * @description: 为单个 pre 补齐 code、header 与语言标签。真正的高亮由 index.ts 的视口调度触发。
	 * @param {HTMLPreElement} pre 目标代码块元素
	 */
	private prepareCodeBlock(pre: HTMLPreElement) {
		const codeEl = pre.querySelector("code");
		if (!(codeEl instanceof HTMLElement) || isHighlighted(codeEl)) return;

		const raw = readRawLanguage(codeEl.classList);
		const lang = resolveLanguageId(raw);
		// 未识别 / 无语言时按纯文本处理，标签仍显示原始标记文本，不抛错
		const finalLang = lang !== "" && hasLanguage(lang) ? lang : PLAIN_LANG;
		const label = raw === "" ? "" : resolveLanguageLabel(finalLang, raw);

		const { wrapper, right } = this.createCodeHeaderTemplate();
		if (label) {
			const languageText = document.createElement("div");
			languageText.className = "code-block-header-language";
			languageText.textContent = label;
			right.appendChild(languageText);
		}
		right.appendChild(this.createCopyBtn());
		pre.insertBefore(wrapper, codeEl);

		// 记录该块的渲染参数，供 index.ts 的懒加载调度直接读取
		codeEl.dataset.codeLang = finalLang;
		const themeKey = document.getElementById("markdown")?.getAttribute("data-code-theme");
		codeEl.dataset.codeTheme = resolveThemeId(themeKey);
	}

	/** 创建 code-header 模板 */
	private createCodeHeaderTemplate() {
		const wrapper = document.createElement("div");
		wrapper.className = "code-block-header";
		const left = document.createElement("div");
		left.className = "code-block-header-left";
		const right = document.createElement("div");
		right.className = "code-block-header-right";

		left.appendChild(this.createFoldBtn());
		wrapper.appendChild(left);
		wrapper.appendChild(right);
		return { wrapper, left, right };
	}

	/** 创建折叠按钮 */
	private createFoldBtn() {
		const foldBtn = document.createElement("div");
		foldBtn.className = "code-block-header-fold-btn";
		foldBtn.innerHTML = FOLD_SVG;
		foldBtn.addEventListener("click", this.foldBtnClick);
		return foldBtn;
	}

	/** 折叠按钮点击事件 */
	private foldBtnClick = (event: Event) => {
		const currentTarget = event.currentTarget as HTMLElement;
		const codeBlockHeader = currentTarget.closest(".code-block-header");
		if (!codeBlockHeader) return;
		codeBlockHeader.classList.toggle("fold");
	};

	/** 创建复制按钮 */
	private createCopyBtn() {
		const copyBtn = document.createElement("div");
		copyBtn.className = "code-block-header-copy-btn";
		copyBtn.textContent = "复制代码";
		copyBtn.addEventListener("click", this.copyBtnClick);
		return copyBtn;
	}

	/** 复制按钮点击事件 */
	private copyBtnClick = (event: Event) => {
		const currentTarget = event.currentTarget as HTMLElement;
		if (this.copyBtnTimers.has(currentTarget)) {
			clearTimeout(this.copyBtnTimers.get(currentTarget));
			this.copyBtnTimers.delete(currentTarget);
		}
		const pre = currentTarget.closest("pre");
		const codeEl = pre instanceof HTMLElement ? pre.querySelector("code") : null;
		if (!(codeEl instanceof HTMLElement)) return;
		copy(codeEl)
			.then(() => {
				currentTarget.textContent = "复制成功";
				this.copyBtnTimers.set(
					currentTarget,
					setTimeout(() => {
						currentTarget.textContent = "复制代码";
						this.copyBtnTimers.delete(currentTarget);
					}, 2000)
				);
			})
			.catch(() => {
				ElMessage.error({ message: "复制失败，请手动复制", plain: true });
			});
	};

	/**
	 * @description: 收集文章内尚未处理的代码块，供 index.ts 用 IntersectionObserver 逐个触发
	 */
	public collectQueue(): HTMLPreElement[] {
		const queue: HTMLPreElement[] = [];
		this.article?.querySelectorAll<HTMLPreElement>("pre").forEach((pre) => {
			const codeEl = pre.querySelector("code");
			if (!(codeEl instanceof HTMLElement) || isHighlighted(codeEl)) return;
			queue.push(pre);
		});
		return queue;
	}

	/**
	 * @description: 对单个 pre 执行真实高亮。折叠状态下由调度层跳过（展开后 IO 会再次进入视口）
	 * @param {HTMLPreElement} pre 目标代码块元素
	 */
	public highlightOne(pre: HTMLPreElement) {
		const codeEl = pre.querySelector("code");
		if (!(codeEl instanceof HTMLElement) || isHighlighted(codeEl)) return;
		const lang = codeEl.dataset.codeLang || PLAIN_LANG;
		const themeId = codeEl.dataset.codeTheme || FALLBACK_THEME_ID;
		void renderCodeBlock(codeEl, { lang, label: "", themeId }).catch((error) =>
			console.warn("[code-block] 代码块渲染异常：", error)
		);
	}

	/** WASM 预热：下载代价挪出首屏长任务窗口 */
	public warmUp() {
		preloadWasm();
	}
}
