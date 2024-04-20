/*
 * @Author: mulingyuer
 * @Date: 2024-04-20 20:10:39
 * @LastEditTime: 2024-04-21 01:46:50
 * @LastEditors: mulingyuer
 * @Description: 文本表情策略
 * @FilePath: /Typecho_Theme_JJ/src/modules/comment/emoji/strategies/textEmoji.ts
 * 怎么可能会有bug！！！
 */
import { AbstractStrategy } from "../abstract.strategy";
import { EmojiItem2 } from "../types";
import SimpleBar from "simplebar";

export class TextEmojiStrategy extends AbstractStrategy {
	private data: EmojiItem2 | undefined;
	private simpleBar: SimpleBar | undefined;

	render(head: HTMLElement, body: HTMLElement, data: EmojiItem2): void {
		this.data = data;
		this.renderHead(head, data);
		this.renderBody(body, data);
	}

	/** 渲染head */
	private renderHead(head: HTMLElement, data: EmojiItem2): void {
		const div = document.createElement("div");
		div.classList.add("emoji-picker-head-item");
		div.dataset.index = data.index.toString();
		const span = document.createElement("span");
		span.innerText = data.value;

		div.appendChild(span);

		/** 监听事件 */
		div.addEventListener("click", (event) => {
			this.headEventProxy(event, data);
		});

		head.appendChild(div);
	}

	/** 渲染body */
	private renderBody(body: HTMLElement, data: EmojiItem2): void {
		const { className, data: emojiList } = data;

		const wrapper = document.createElement("div");
		const wrapperClassName = ["emoji-picker-body-item"];
		if (typeof className === "string" && className.trim() !== "") {
			wrapperClassName.push(className);
		}
		wrapper.classList.add(...wrapperClassName);

		let emojiHtml = "";
		emojiList.forEach(({ key, val }) => {
			emojiHtml += `<span class="emoji-picker-body-text" data-key="${key}">${val}</span>`;
		});

		wrapper.innerHTML = emojiHtml;

		// 绑定事件
		wrapper.addEventListener("click", (event) => {
			this.bodyEventProxy(event);
		});

		// 滚动条
		this.simpleBar = new SimpleBar(wrapper);

		body.appendChild(wrapper);
	}

	/** head事件代理 */
	private headEventProxy(event: MouseEvent, data: EmojiItem2): void {
		if (typeof this.headClick === "function") {
			this.headClick.call(this, event, data);
		}
	}

	/** body事件代理 */
	private bodyEventProxy = (event: MouseEvent) => {
		const target = event.target;
		if (!this.isSpanElement(target)) return;

		const key = target.dataset.key;
		if (!key) return;

		const data = this.data!.data.find((item) => item.key === key)!;

		if (typeof this.emojiClick === "function") {
			this.emojiClick.call(target, event, "text", data);
		}
	};

	/** 是否是span元素 */
	private isSpanElement(target: any): target is HTMLSpanElement {
		return target instanceof HTMLSpanElement;
	}
}
