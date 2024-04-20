/*
 * @Author: mulingyuer
 * @Date: 2024-04-19 17:20:05
 * @LastEditTime: 2024-04-20 19:56:03
 * @LastEditors: mulingyuer
 * @Description: 主题配置类型
 * @FilePath: /Typecho_Theme_JJ/src/utils/themeConfig/types.ts
 * 怎么可能会有bug！！！
 */

export type Config = {
	/** 分页类型 */
	paginationType: "infinite" | "button";
	/** 主题path */
	themePath: string;
};
