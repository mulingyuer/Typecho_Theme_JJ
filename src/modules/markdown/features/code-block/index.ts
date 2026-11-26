import copy from "@/utils/copy";
import { ElMessage } from "element-plus";
import { isHighlighted, renderCodeBlock } from "../code-highlight";
import { hasLanguage, readRawLanguage, resolveLanguageId, resolveLanguageLabel } from "../code-highlight/lang-map";
import { FALLBACK_THEME_ID, resolveThemeId } from "../code-highlight/theme-map";
import { isMermaidBlock } from "./mermaid-detect";

/** 折叠按钮 SVG */
const FOLD_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M16.924 9.617A1 1 0 0 0 16 9H8a1 1 0 0 0-.707 1.707l4 4a1 1 0 0 0 1.414 0l4-4a1 1 0 0 0 .217-1.09z" data-name="Down"></path></svg>`;

/** 无语言或未知语言使用纯文本 id，避免 Shiki 初始化失败 */
const PLAIN_LANG = "text";

/**
 * 给指定 Markdown 根节点内的代码块增加 UI，并按需交给代码高亮模块处理。
 */
export class CodeBlock {
	/** 当前模块绑定的 Markdown 根节点 */
	private root: HTMLElement | null = null;

	/** 复制成功后的复位定时器 */
	private copyBtnTimers = new Map<HTMLElement, ReturnType<typeof setTimeout>>();

	/** 给根节点内所有普通 pre 添加 header、语言标签和复制按钮 */
	public bind(root: HTMLElement): void {
		this.root = root;
		root.querySelectorAll("pre").forEach((pre) => this.prepareCodeBlock(pre as HTMLPreElement));
	}

	private prepareCodeBlock(pre: HTMLPreElement): void {
		if (!this.root) return;

		const codeEl = pre.querySelector("code");
		if (!(codeEl instanceof HTMLElement) || isHighlighted(codeEl) || isMermaidBlock(codeEl)) {
			return;
		}

		const raw = readRawLanguage(codeEl.classList);
		const lang = resolveLanguageId(raw);
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

		codeEl.dataset.codeLang = finalLang;
		codeEl.dataset.codeTheme = resolveThemeId(this.root.getAttribute("data-code-theme"));
	}

	private createCodeHeaderTemplate(): {
		wrapper: HTMLDivElement;
		left: HTMLDivElement;
		right: HTMLDivElement;
	} {
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

	private createFoldBtn(): HTMLDivElement {
		const foldBtn = document.createElement("div");
		foldBtn.className = "code-block-header-fold-btn";
		foldBtn.innerHTML = FOLD_SVG;
		foldBtn.addEventListener("click", this.foldBtnClick);
		return foldBtn;
	}

	private foldBtnClick = (event: Event): void => {
		const currentTarget = event.currentTarget as HTMLElement;
		const header = currentTarget.closest(".code-block-header");
		header?.classList.toggle("fold");
	};

	private createCopyBtn(): HTMLDivElement {
		const copyBtn = document.createElement("div");
		copyBtn.className = "code-block-header-copy-btn";
		copyBtn.textContent = "复制";
		copyBtn.addEventListener("click", this.copyBtnClick);
		return copyBtn;
	}

	private copyBtnClick = (event: Event): void => {
		const currentTarget = event.currentTarget as HTMLElement;
		const timer = this.copyBtnTimers.get(currentTarget);
		if (timer) {
			clearTimeout(timer);
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
						currentTarget.textContent = "复制";
						this.copyBtnTimers.delete(currentTarget);
					}, 2000)
				);
			})
			.catch(() => {
				ElMessage.error({ message: "复制失败，请手动复制代码", plain: true });
			});
	};

	/** 收集等待进入视口的普通代码块，Mermaid 块已被排除 */
	public collectQueue(): HTMLPreElement[] {
		const queue: HTMLPreElement[] = [];

		this.root?.querySelectorAll<HTMLPreElement>("pre").forEach((pre) => {
			const codeEl = pre.querySelector("code");
			if (!(codeEl instanceof HTMLElement) || isHighlighted(codeEl) || isMermaidBlock(codeEl)) {
				return;
			}
			queue.push(pre);
		});

		return queue;
	}

	/** 高亮单个代码块；任何失败都由下层保留纯文本 */
	public highlightOne(pre: HTMLPreElement): void {
		const codeEl = pre.querySelector("code");
		if (!(codeEl instanceof HTMLElement) || isHighlighted(codeEl)) return;

		const lang = codeEl.dataset.codeLang || PLAIN_LANG;
		const themeId = codeEl.dataset.codeTheme || FALLBACK_THEME_ID;

		void renderCodeBlock(codeEl, { lang, label: "", themeId }).catch((error) => {
			console.warn("[code-block] 代码高亮失败", error);
		});
	}
}
