/*
 * @Author: mulingyuer
 * @Date: 2024-04-19 17:13:51
 * @LastEditTime: 2024-04-19 17:28:01
 * @LastEditors: mulingyuer
 * @Description: 主题配置
 * @FilePath: /Typecho_Theme_JJ/src/utils/themeConfig/index.ts
 * 怎么可能会有bug！！！
 */
import * as ThemeConfigTypes from "./types";
export type * from "./types";

export const getThemeConfig = (function () {
	let config: ThemeConfigTypes.Config | null = null;

	return function () {
		if (config) return config;

		const themeMeta = document.querySelector<HTMLMetaElement>('meta[name="theme-config"]');
		if (!themeMeta) return null;

		config = Object.assign({}, themeMeta.dataset as ThemeConfigTypes.Config);

		return config;
	};
})();
