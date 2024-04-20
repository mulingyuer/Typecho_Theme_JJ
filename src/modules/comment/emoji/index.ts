/*
 * @Author: mulingyuer
 * @Date: 2023-03-25 22:25:07
 * @LastEditTime: 2024-04-21 04:13:19
 * @LastEditors: mulingyuer
 * @Description: 表情
 * @FilePath: /Typecho_Theme_JJ/src/modules/comment/emoji/index.ts
 * 怎么可能会有bug！！！
 */
import { arrow, computePosition, flip, offset, shift } from "@floating-ui/dom";
import { emojiData } from "./data";
import { singletonFaceReplace } from "./faceReplace";
import "./style.scss";
import type { EmojiData, EmojiImageItem, EmojiTextItem } from "./types";

class Emoji {
	/** head容器 */
	private headWrap: HTMLElement | null = document.querySelector(".emoji-picker-head");
	/** head item数组 */
	private headItemArr: Array<HTMLElement> = [];
	/** 表情容器 */
	private emojiWrap: HTMLElement | null = document.querySelector(".emoji-picker-slide");
	/** 表情item数组 */
	private emojiItemArr: Array<HTMLElement> = [];
	/** 评论容器textarea */
	private textarea: HTMLTextAreaElement | null = document.querySelector(".comment-form-textarea");
	/** emoji-picker */
	private emojiPicker: HTMLElement | null = document.querySelector(".emoji-picker");
	/** 表情按钮 */
	private emojiBtn: HTMLElement | null = document.querySelector(".emoji-btn");
	/** 是否显示表情 */
	private isShowEmoji: boolean = false;
	/** 是否在隐藏动画中 */
	private isHideEmojiAnimation: boolean = false;
	/** 箭头 */
	private arrow: HTMLElement | null = document.querySelector(".emoji-picker-arrow");
	/** 评论列表 */
	private commentList: HTMLElement | null = document.querySelector(".comment-list");

	constructor() {
		if (!this.headWrap || !this.emojiWrap) return;

		//容器渲染
		this.render();

		// 获取相关dom
		this.headItemArr = [...this.headWrap.querySelectorAll<HTMLElement>(".emoji-picker-head-item")];
		this.emojiItemArr = [...this.emojiWrap.querySelectorAll<HTMLElement>(".emoji-picker-body-item")];

		//绑定事件
		this.emojiBtn?.addEventListener("click", this.onEmojiBtnClick);
		document.addEventListener("click", this.onDocumentClick);

		// 重置
		this.resetEmojiTab();

		//评论列表表情替换
		if (this.commentList) {
			singletonFaceReplace.start(this.commentList);
		}
	}

	/** dom渲染 */
	private render() {
		emojiData.forEach((item) => {
			const strategy = new item.strategy();
			strategy.onHeadClickListener(this.onHeadClick);
			strategy.onEmojiClickListener(this.onEmojiClick);
			strategy.render(this.headWrap!, this.emojiWrap!, item);
		});
	}

	/** 表情点击事件 */
	private onEmojiClick = (event: MouseEvent, type: EmojiData[number]["type"], data: EmojiImageItem | EmojiTextItem) => {
		let value = "";

		switch (type) {
			case "image":
				value = `[${(data as EmojiImageItem).key}]`;
				break;
			case "text":
				value = (data as EmojiTextItem).val;
				break;
		}

		this.insertText(value);
	};

	/** textarea插入文本 */
	private insertText(text: string) {
		if (this.textarea) {
			const textareaValue = this.textarea.value;
			const start = this.textarea.selectionStart;
			const end = this.textarea.selectionEnd;
			if (start === end) {
				this.textarea.value = `${textareaValue.slice(0, start)}${text}${textareaValue.slice(start)}`;
			} else {
				this.textarea.value = textareaValue.replace(textareaValue.slice(start, end), text);
			}
		}
	}

	/** 重置表情tab */
	private resetEmojiTab() {
		const [firstHead] = this.headItemArr;
		this.headItemArr.forEach((head) => head.classList.remove("active"));
		firstHead.classList.add("active");

		this.emojiWrap!.style.transform = `translateX(0px)`;
	}

	/** head点击事件 */
	private onHeadClick = (event: MouseEvent, data: EmojiData[number]) => {
		const { index } = data;
		const headItem = this.headItemArr[index];
		if (!headItem) return;

		//去除选中
		this.headItemArr.forEach((head) => head.classList.remove("active"));
		headItem.classList.add("active");

		// 位移表情列表
		const emojiItem = this.emojiItemArr.slice(0, index);
		const offsetLeft = emojiItem.reduce((prev, curr) => {
			return prev + curr.offsetWidth;
		}, 0);
		this.emojiWrap!.style.transform = `translateX(-${offsetLeft}px)`;
	};

	/** 表情按钮点击事件 */
	private onEmojiBtnClick = () => {
		if (this.isHideEmojiAnimation) return;
		if (!this.isShowEmoji) {
			this.isShowEmoji = true;
			this.emojiBtn?.classList.add("active");
			this.showEmoji();
		} else {
			this.isShowEmoji = false;
			this.emojiBtn?.classList.remove("active");
			this.hideEmoji();
		}
	};

	/** 点击其他区域关闭表情 */
	private onDocumentClick = (event: Event) => {
		if (this.isHideEmojiAnimation || !this.isShowEmoji) return;
		const target = event.target as HTMLElement;
		if (this.emojiPicker?.contains(target)) return;
		// if (this.textarea?.contains(target)) return;
		if (this.emojiBtn?.contains(target)) return;
		this.isShowEmoji = false;
		this.emojiBtn?.classList.remove("active");
		this.hideEmoji();
	};

	/** 显示表情 */
	private showEmoji() {
		if (!this.emojiPicker) return;
		this.emojiPicker.style.display = "block";
		getComputedStyle(this.emojiPicker).display;
		this.popoverUpdate(this.emojiBtn!, this.emojiPicker, this.arrow!);
		this.emojiPicker.classList.add("visible");
	}

	/** 隐藏表情 */
	private hideEmoji() {
		if (!this.emojiPicker) return;
		this.isHideEmojiAnimation = true;
		this.emojiPicker.classList.remove("visible");
		this.emojiPicker.addEventListener(
			"transitionend",
			() => {
				if (!this.emojiPicker) return;
				this.emojiPicker.style.display = "";
				this.isHideEmojiAnimation = false;
			},
			{ once: true }
		);
	}

	/** 气泡菜单更新 */
	private popoverUpdate(btn: HTMLElement, childWrap: HTMLElement, arrowWrap: HTMLElement) {
		computePosition(btn, childWrap, {
			placement: "bottom-start",
			middleware: [
				offset({ mainAxis: 12, crossAxis: -12 }),
				flip({ crossAxis: false }),
				shift(),
				arrow({ element: arrowWrap })
			]
		}).then(({ x, y, middlewareData, placement }) => {
			Object.assign(childWrap.style, {
				left: `${x ?? 0}px`,
				top: `${y ?? 0}px`
			});
			//箭头
			const side = placement.split("-")[0];
			if (middlewareData.arrow) {
				arrowWrap.classList.remove("top", "bottom", "left", "right");
				arrowWrap.classList.add(side);
			}
		});
	}
}
new Emoji();
