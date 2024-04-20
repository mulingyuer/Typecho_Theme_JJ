/*
 * @Author: mulingyuer
 * @Date: 2024-04-20 20:11:47
 * @LastEditTime: 2024-04-21 01:11:26
 * @LastEditors: mulingyuer
 * @Description: 抽象策略
 * @FilePath: /Typecho_Theme_JJ/src/modules/comment/emoji/abstract.strategy.ts
 * 怎么可能会有bug！！！
 */
import type { EmojiData } from "./types";

/** head事件回调 */
type HeadClickCallback = (event: MouseEvent, data: EmojiData[number]) => void;
/** emoji事件回调 */
type EmojiClick = (event: MouseEvent, type: EmojiData[number]["type"], data: EmojiData[number]["data"][number]) => void;

export abstract class AbstractStrategy {
	protected headClick: HeadClickCallback | undefined;
	protected emojiClick: EmojiClick | undefined;

	/** 渲染html的方法 */
	abstract render(head: HTMLElement, body: HTMLElement, data: EmojiData[number]): void;

	/** 接收head点击事件 */
	public onHeadClickListener(fn: HeadClickCallback) {
		this.headClick = fn;
	}

	/** 接收body点击事件 */
	public onEmojiClickListener(fn: EmojiClick) {
		this.emojiClick = fn;
	}
}
