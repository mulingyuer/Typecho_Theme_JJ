/*
 * @Author: mulingyuer
 * @Date: 2023-03-22 19:56:36
 * @LastEditTime: 2024-04-01 01:01:53
 * @LastEditors: mulingyuer
 * @Description: 文章内容模块
 * @FilePath: /Typecho_Theme_JJ/src/modules/article_content/index.ts
 * 怎么可能会有bug！！！
 */
import "./style.scss";
import hljs from "./hljs";
import LightBox from "./lightBox";
import copy from "@/utils/copy";
import toast from "@/utils/toast";

/** 折叠按钮svg */
const foldSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M16.924 9.617A1 1 0 0 0 16 9H8a1 1 0 0 0-.707 1.707l4 4a1 1 0 0 0 1.414 0l4-4a1 1 0 0 0 .217-1.09z" data-name="Down"></path></svg>`;

/** 代码块 */
class CodeBlock {
	/** 文章dom元素 */
	private article = document.querySelector(".markdown-body");

	constructor() {
		if (!this.article) return;
		this.init();
	}

	/** 初始化 */
	private init() {
		const codeBlockArr = Array.from(this.article!.querySelectorAll("pre"));
		codeBlockArr.forEach((codeBlock) => {
			const codeDom = codeBlock.firstChild as HTMLElement;
			// 代码高亮
			this.highlight(codeDom);
			// 添加代码头部
			const { wrapper, right } = this.createCodeHeaderTemplate();
			// 生成代码语言文本
			const codeText = this.createLanguageText(codeDom);
			if (codeText) right.appendChild(codeText);
			// 生成复制按钮
			const copyBtn = this.createCopyBtn();
			right.appendChild(copyBtn);
			// 代码块添加头部
			codeBlock.insertBefore(wrapper, codeDom);
			// 添加行号
			this.addLineNumber(codeDom);
		});
	}

	/** 代码高亮 */
	private highlight(codeDom: HTMLElement) {
		hljs.highlightElement(codeDom);
	}

	/** 创建code-header模板 */
	private createCodeHeaderTemplate() {
		const wrapper = document.createElement("div");
		wrapper.classList.add("code-block-header");
		const left = document.createElement("div");
		left.classList.add("code-block-header-left");
		const right = document.createElement("div");
		right.classList.add("code-block-header-right");

		//生成折叠按钮
		const foldBtn = this.createFoldBtn();
		left.appendChild(foldBtn);

		// 传入left
		wrapper.appendChild(left);
		// 传入right
		wrapper.appendChild(right);

		return {
			wrapper,
			left,
			right
		};
	}

	/** 创建折叠按钮 */
	private createFoldBtn() {
		const foldBtn = document.createElement("div");
		foldBtn.classList.add("code-block-header-fold-btn");
		foldBtn.innerHTML = foldSvg;
		foldBtn.addEventListener("click", this.foldBtnClick);
		return foldBtn;
	}

	/** 折叠按钮点击事件 */
	private foldBtnClick = (event: Event) => {
		const currentTarget = event.currentTarget as HTMLElement;
		//获取到code-block-header
		const codeBlockHeader: HTMLElement | null = currentTarget.closest(".code-block-header");
		if (!codeBlockHeader) return;
		codeBlockHeader.classList.toggle("fold");
	};

	/** 创建代码语言文本 */
	private createLanguageText(codeDom: HTMLElement) {
		const lang = this.getCodeLanguage(codeDom);
		if (lang === "") return;
		const codeText = document.createElement("div");
		codeText.classList.add("code-block-header-language");
		codeText.innerText = lang;
		return codeText;
	}

	/** 获取code元素上的语言 */
	private getCodeLanguage(codeDom: HTMLElement) {
		let lang = "";
		for (const value of codeDom.classList.values()) {
			//hljs高亮之后会添加一个language-开头的class声明是什么语言
			if (value.includes("language-")) {
				lang = value.split("-")[1];
				//跳出循环
				break;
			}
		}
		return lang;
	}

	/** 创建复制按钮 */
	private createCopyBtn() {
		const copyBtn = document.createElement("div");
		copyBtn.classList.add("code-block-header-copy-btn");
		copyBtn.innerText = "复制代码";
		copyBtn.addEventListener("click", this.copyBtnClick);
		return copyBtn;
	}

	/** 复制按钮点击事件 */
	private copyBtnClick(event: Event) {
		const currentTarget = event.currentTarget as HTMLElement;
		const pre = currentTarget.closest("pre") as HTMLElement | null;
		if (!pre) return;
		const codeDom = pre.querySelector("code");
		if (!codeDom) return;
		copy(codeDom)
			.then(() => {
				toast.success({ text: "复制成功" });
			})
			.catch(() => {
				toast.error({ text: "复制失败，请手动复制" });
			});
	}

	/** 添加行号 */
	private addLineNumber(codeDom: HTMLElement) {
		codeDom.classList.add("code-block-extension-code-show-num");
		const codeHtml = codeDom.innerHTML;
		const lines = codeHtml
			.split("\n")
			.map((line, index) => {
				return `<span class="code-block-extension-code-line" data-line-num="${index + 1}">${line}</span>`;
			})
			.join("\n");
		codeDom.innerHTML = lines;
	}
}

new CodeBlock();

/** 灯箱处理 */
const markdownBody = document.querySelector(".markdown-body");
if (markdownBody) new LightBox(markdownBody as HTMLElement);
