/*
 * @Author: mulingyuer
 * @Date: 2024-04-20 19:49:10
 * @LastEditTime: 2024-04-21 02:01:49
 * @LastEditors: mulingyuer
 * @Description: emoji类型
 * @FilePath: /Typecho_Theme_JJ/src/modules/comment/emoji/types.ts
 * 怎么可能会有bug！！！
 */
import { AbstractStrategy } from "./abstract.strategy";

/** 图片表情数据 */
export type EmojiImageItem = {
	/** key */
	key: string;
	/** 图片链接 */
	src: string;
	/** 是否隐藏 */
	hidden: boolean;
	/** 自定义类名 */
	renderClassName?: string;
};

/** 图片表情数据列表 */
export type EmojiImageList = EmojiImageItem[];

/** 文字表情数据 */
export type EmojiTextItem = {
	/** key */
	key: string;
	/** 颜文字文本 */
	val: string;
	/** 是否隐藏 */
	hidden: boolean;
	/** 自定义类名 */
	renderClassName?: string;
};

/** 文字表情数据列表 */
export type EmojiTextList = EmojiTextItem[];

export type BaseEmojiItem = {
	index: number;
	className?: string;
	/** 策略 */
	strategy: new () => AbstractStrategy;
};

/** 表情数据1 */
export type EmojiItem1 = {
	type: "image";
	id: string;
	name: string;
	iconSrc: string;
	data: EmojiImageList;
} & BaseEmojiItem;

/** 表情数据2 */
export type EmojiItem2 = {
	type: "text";
	id: string;
	name: string;
	value: string;
	data: EmojiTextList;
} & BaseEmojiItem;

/** 表情数据 */
export type EmojiData = Array<EmojiItem1 | EmojiItem2>;
