/*
 * @Author: mulingyuer
 * @Date: 2023-03-21 22:59:30
 * @LastEditTime: 2023-03-21 23:36:49
 * @LastEditors: mulingyuer
 * @Description: 浮动工具
 * @FilePath: \Typecho_Theme_JJ\src\modules\fixed_tool\index.ts
 * 怎么可能会有bug！！！
 */
import "./style.scss";
import { useDataStore } from "@/store/data";
import { watch } from "vue";
import Theme from "@/utils/theme";

/** 数据 */
const dataStore = useDataStore();

/** 返回顶部 */
class BackTop {
	/** 点击回到顶部 */
	private btn = document.querySelector(".back-to-top");
	/** 是否正在返回 */
	private isBack = false;
	/** 显示按钮的scrollTop值 */
	private maxScrollTop = 300;
	/** 是否显示返回顶部按钮 */
	private isShow = false;

	constructor() {
		this.btn && this.btn.addEventListener("click", this.onBackTopClick);
		watch(() => dataStore.getScrollY, this.watchScrollTop, { immediate: true });
	}

	/** 返回顶部事件 */
	private onBackTopClick = () => {
		if (this.isBack) return;
		this.isBack = true;
		const beginTime = Date.now();
		const beginValue = document.documentElement.scrollTop;
		const rAF = window.requestAnimationFrame || ((func) => setTimeout(func, 16));
		const frameFunc = () => {
			const progress = (Date.now() - beginTime) / 500;
			if (progress < 1) {
				document.documentElement.scrollTop = beginValue * (1 - this.easeInOutCubic(progress));
				rAF(frameFunc);
			} else {
				document.documentElement.scrollTop = 0;
				this.isBack = false;
			}
		};
		rAF(frameFunc);
	};

	cubic(value: number) {
		return Math.pow(value, 3);
	}

	easeInOutCubic(value: number) {
		return value < 0.5 ? this.cubic(value * 2) / 2 : 1 - this.cubic((1 - value) * 2) / 2;
	}

	/** 监听滚动的位置 */
	private watchScrollTop = (val: number) => {
		if (val < this.maxScrollTop) {
			if (!this.isShow) return;
			this.isShow = false;
			this.btn && this.btn.classList.remove("visible");
		} else {
			if (this.isShow) return;
			this.isShow = true;
			this.btn && this.btn.classList.add("visible");
		}
	};
}

new BackTop();

/** 切换主题 */
class SwitchTheme {
	/** 切换按钮 */
	private btn = document.querySelector(".theme-switch");
	/** 主题实例 */
	private theme = Theme.getInterface();
	/** 当前主题 */
	private activeTheme = "";

	constructor() {
		this.activeTheme = this.theme.getActiveTheme();
		this.btn && this.btn.addEventListener("click", this.onSwitchClick);
	}

	/** 切换按钮点击事件 */
	private onSwitchClick = () => {
		let themeName = "";
		switch (this.activeTheme) {
			case "light":
				themeName = "dark";
				this.btn?.classList.add("dark");
				break;
			case "dark":
				themeName = "light";
				this.btn?.classList.remove("dark");
				break;
			default:
				themeName = "light";
				console.warn(`主题名不合法：${this.activeTheme}，已切换为默认主题`);
		}
		this.theme.switchTheme(themeName);
		this.activeTheme = themeName;
	};
}
new SwitchTheme();
