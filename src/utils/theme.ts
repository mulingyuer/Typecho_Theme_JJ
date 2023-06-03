/*
 * @Author: mulingyuer
 * @Date: 2023-03-14 22:43:07
 * @LastEditTime: 2023-03-15 16:44:17
 * @LastEditors: mulingyuer
 * @Description: 主题切换
 * @FilePath: \Typecho_Theme_JJ\src\utils\theme.ts
 * 怎么可能会有bug！！！
 */
import { jjLocal } from "@/utils/storage";

/** 主题map对象 */
interface ThemeMap {
	[key: string]: HTMLLinkElement;
}

class Theme {
	/** 静态实例 */
	private static interface: Theme;

	/** link元素数组 */
	private themeMap: ThemeMap = {};
	private activeTheme = "";

	private constructor() {
		const linkList = Array.from(document.querySelectorAll<HTMLLinkElement>('link[type="text/css"][title]'));

		linkList.forEach((link) => {
			const title = link.getAttribute("title");
			if (!title) return;
			const rel = link.getAttribute("rel");

			this.themeMap[title] = link;
			if (rel && !rel.includes("alternate")) {
				this.activeTheme = title;
			}
		});

		const localTheme = jjLocal.getItem<string>("theme");
		if (localTheme && localTheme !== this.activeTheme) {
			this.switchTheme(localTheme);
		}
	}

	/** 获取当前主题 */
	public getActiveTheme() {
		return this.activeTheme;
	}

	/** 切换指定主题 */
	public switchTheme(theme: string) {
		if (theme === this.activeTheme) return;

		Object.keys(this.themeMap).forEach((key) => {
			const link = this.themeMap[key];
			link.disabled = true; // 先禁用，不管是否启用
			if (key === theme) link.disabled = false; // 启用指定主题
		});

		this.activeTheme = theme;
		jjLocal.setItem("theme", theme);
	}

	/** 获取主题实例 */
	public static getInterface() {
		if (!Theme.interface) {
			Theme.interface = new Theme();
		}
		return Theme.interface;
	}
}

export default Theme;
