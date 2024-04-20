/*
 * @Author: mulingyuer
 * @Date: 2024-04-20 19:48:15
 * @LastEditTime: 2024-04-20 22:06:03
 * @LastEditors: mulingyuer
 * @Description: 表情数据入口
 * @FilePath: /Typecho_Theme_JJ/src/modules/comment/emoji/data/index.ts
 * 怎么可能会有bug！！！
 */
import { BTv } from "./bTv";
import { HotWord } from "./hotWord";
import { YellowFace } from "./yellowFace";
import { YanWen } from "./yanWen";
import { getThemeConfig } from "@/utils/themeConfig";
import type { EmojiData } from "../types";
import { ImageEmojiStrategy } from "../strategies/imageEmoji";
import { TextEmojiStrategy } from "../strategies/textEmoji";

export const emojiData: EmojiData = [
	{
		type: "image",
		id: "yellowFace",
		index: 0,
		name: "小黄脸",
		iconSrc: YellowFace.find((item) => item.key === "doge")!.src,
		data: YellowFace.filter((item) => !item.hidden),
		strategy: ImageEmojiStrategy
	},
	{
		type: "image",
		id: "hotWord",
		index: 1,
		name: "热词",
		iconSrc: HotWord.find((item) => item.key === "热词系列_啊?")!.src,
		className: "hot-word",
		data: HotWord.filter((item) => !item.hidden),
		strategy: ImageEmojiStrategy
	},
	{
		type: "image",
		id: "bTv",
		index: 2,
		name: "小电视",
		iconSrc: BTv.find((item) => item.key === "tv_白眼")!.src,
		data: BTv.filter((item) => !item.hidden),
		strategy: ImageEmojiStrategy
	},
	{
		type: "text",
		id: "yanWen",
		index: 3,
		name: "颜文字",
		value: "（⌒▽⌒）",
		data: YanWen.filter((item) => !item.hidden),
		strategy: TextEmojiStrategy
	}
];
