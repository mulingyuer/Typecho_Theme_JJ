/*
 * @Author: mulingyuer
 * @Date: 2024-04-20 20:10:18
 * @LastEditTime: 2024-04-21 01:46:26
 * @LastEditors: mulingyuer
 * @Description: 图片表情策略
 * @FilePath: /Typecho_Theme_JJ/src/modules/comment/emoji/strategies/imageEmoji.ts
 * 怎么可能会有bug！！！
 */
import { AbstractStrategy } from "../abstract.strategy";
import { EmojiItem1 } from "../types";
import { getThemeConfig } from "@/utils/themeConfig";
import { joinPath } from "@/utils/tool";
import SimpleBar from "simplebar";
import { LazyImg } from "@/utils/lazyImg";

export class ImageEmojiStrategy extends AbstractStrategy {
	private data: EmojiItem1 | undefined;
	private themeConfig = getThemeConfig();
	private simpleBar: SimpleBar | undefined;

	render(head: HTMLElement, body: HTMLElement, data: EmojiItem1): void {
		this.data = data;
		this.renderHead(head, data);
		this.renderBody(body, data);
	}

	/** 渲染head */
	private renderHead(head: HTMLElement, data: EmojiItem1): void {
		const div = document.createElement("div");
		div.classList.add("emoji-picker-head-item");
		div.dataset.index = data.index.toString();
		const img = document.createElement("img");
		img.setAttribute("alt", data.name);
		img.src = joinPath(this.themeConfig?.themePath ?? "", data.iconSrc);
		div.appendChild(img);

		/** 监听事件 */
		div.addEventListener("click", (event) => {
			this.headEventProxy(event, data);
		});

		head.appendChild(div);
	}

	/** 渲染body */
	private renderBody(body: HTMLElement, data: EmojiItem1): void {
		const { className, data: emojiList } = data;

		const wrapper = document.createElement("div");
		const wrapperClassName = ["emoji-picker-body-item"];
		if (typeof className === "string" && className.trim() !== "") {
			wrapperClassName.push(className);
		}
		wrapper.classList.add(...wrapperClassName);

		let emojiHtml = "";
		const loadingSrc = joinPath(this.themeConfig?.themePath ?? "", "/static/images/loading2.gif");
		emojiList.forEach(({ key, src }) => {
			const imgSrc = joinPath(this.themeConfig?.themePath ?? "", src);
			emojiHtml += `<img class="emoji-picker-body-img" src="${loadingSrc}" alt="${key}" data-src="${imgSrc}" data-key="${key}" title="${key}" />`;
			// emojiHtml += `<img class="emoji-picker-body-img" src="${imgSrc}" alt="${key}" data-src="${imgSrc}" data-key="${key}" title="${key}" />`;
		});

		wrapper.innerHTML = emojiHtml;

		// 绑定事件
		wrapper.addEventListener("click", (event) => {
			this.bodyEventProxy(event);
		});

		// 滚动条
		this.simpleBar = new SimpleBar(wrapper);

		// 懒加载
		new LazyImg(wrapper);

		body.appendChild(wrapper);
	}

	/** head事件代理 */
	private headEventProxy(event: MouseEvent, data: EmojiItem1): void {
		if (typeof this.headClick === "function") {
			this.headClick.call(this, event, data);
		}
	}

	/** body事件代理 */
	private bodyEventProxy = (event: MouseEvent) => {
		const target = event.target;
		if (!this.isImgElement(target)) return;

		const key = target.dataset.key;
		if (!key) return;

		const data = this.data!.data.find((item) => item.key === key)!;

		if (typeof this.emojiClick === "function") {
			this.emojiClick.call(target, event, "image", data);
		}
	};

	/** 是否是图片元素 */
	private isImgElement(target: any): target is HTMLImageElement {
		return target instanceof HTMLImageElement;
	}
}
