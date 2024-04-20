/*
 * @Author: mulingyuer
 * @Date: 2023-03-26 04:06:58
 * @LastEditTime: 2024-04-21 02:45:32
 * @LastEditors: mulingyuer
 * @Description: 文本替换成表情
 * @FilePath: /Typecho_Theme_JJ/src/modules/comment/emoji/faceReplace.ts
 * 怎么可能会有bug！！！
 */
import { SingletonFactory } from "@/utils/singletonFactory";
import { emojiData } from "./data";
import type { EmojiImageItem, EmojiImageList, EmojiItem1 } from "./types";
import { getThemeConfig } from "@/utils/themeConfig";
import { joinPath } from "@/utils/tool";

/** 文本替换成表情 */
class SingletonFaceReplace {
	themeConfig = getThemeConfig();
	/** 缓存 */
	private cache = new Map<string, EmojiImageItem>();

	/** 开始 */
	public start(dom: HTMLElement | Array<HTMLElement>) {
		if (Array.isArray(dom)) {
			dom.forEach((item) => this.replace(item));
		} else {
			this.replace(dom);
		}
	}

	/** 替换表情 */
	private replace(dom: HTMLElement) {
		let html = dom.innerHTML;
		const reg = /\[(.*?)\]/g;

		html = html.replace(reg, (match, param) => {
			const data = this.getEmojiData(param);
			if (data) {
				return `<img class="${data.renderClassName ?? ""}" src="${joinPath(
					this.themeConfig?.themePath ?? "",
					data.src
				)}">`;
			}

			return match;
		});

		//更新
		dom.innerHTML = html;
	}

	/** 获取表情 */
	private getEmojiData(key: string): EmojiImageItem | undefined {
		// 如果缓存中存在，则直接返回
		if (this.cache.has(key)) return this.cache.get(key);

		const list: EmojiImageList = emojiData
			.filter((item) => item.type === "image")
			.flatMap((item) => (item as EmojiItem1).data);

		const data = list.find((item) => item.key === key);

		// 缓存
		if (data) this.cache.set(key, data);
		return data;
	}
}

export const singletonFaceReplace = SingletonFactory.getInstance(SingletonFaceReplace);
