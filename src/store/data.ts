/*
 * @Author: mulingyuer
 * @Date: 2023-03-15 16:56:16
 * @LastEditTime: 2023-03-29 20:28:05
 * @LastEditors: mulingyuer
 * @Description: 数据仓库
 * @FilePath: \Typecho_Theme_JJ\src\store\data.ts
 * 怎么可能会有bug！！！
 */
import { defineStore } from "pinia";

export const useDataStore = defineStore("data", {
	state() {
		return {
			scrollY: 0, // Y滚动条位置
			windowWidth: 0, //窗口宽度
			windowHeight: 0, //窗口高度
			enableMobileSearch: false, //是否启用移动端搜索
			isDomContentLoaded: false //是否dom已经解析，无需等待样式表、图像和子框架的完全加载
		};
	},
	getters: {
		getScrollY(state) {
			return state.scrollY;
		},
		getWindowWidth(state) {
			return state.windowWidth;
		},
		getWindowHeight(state) {
			return state.windowHeight;
		},
		getEnableMobileSearch(state) {
			return state.enableMobileSearch;
		},
		getIsDomContentLoaded(state) {
			return state.isDomContentLoaded;
		}
	},
	actions: {
		setScrollY(y: number) {
			this.scrollY = y;
		},
		setWindowWidth(width: number) {
			this.windowWidth = width;
		},
		setWindowHeight(height: number) {
			this.windowHeight = height;
		},
		setEnableMobileSearch(status: boolean) {
			this.enableMobileSearch = status;
		},
		setIsDomContentLoaded(status: boolean) {
			this.isDomContentLoaded = status;
		}
	}
});
