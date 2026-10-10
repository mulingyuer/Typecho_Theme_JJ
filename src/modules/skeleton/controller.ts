/*
 * @Author: mulingyuer
 * @Date: 2023-03-29 20:17:39
 * @LastEditTime: 2026-10-10
 * @LastEditors: mulingyuer
 * @Description: 通用骨架屏显隐控制器（配合 renderSkeleton() 使用，文档见 src/modules/skeleton/README.md）
 * @FilePath: \Typecho_Theme_JJ\src\modules\skeleton\controller.ts
 * 怎么可能会有bug！！！
 */
import { dataStore } from "@/store/data";
import { watch } from "vue";

//监听dom是否解析完毕
document.addEventListener("DOMContentLoaded", () => {
	dataStore.isDomContentLoaded = true;
});

export interface SkeletonControllerOptions {
	/** 骨架容器选择器（即 renderSkeleton 的 selector，需带 .） */
	selector: string;
	/** 关闭骨架时需要移除 hidden 的内容容器选择器列表 */
	contentSelectors?: string[];
	/** 是否需要外部调用 receiveClose() 后才允许关闭（等待接口数据场景），默认 false */
	waitForCloseSignal?: boolean;
	/** DOMContentLoaded 后延迟关闭的毫秒数（避免闪烁），默认 200 */
	maxDelay?: number;
}

class SkeletonController {
	/** 骨架容器 */
	private skeleton: HTMLElement | null;
	/** 内容容器列表 */
	private contents: Array<HTMLElement | null>;
	/** 是否等待外部关闭信号 */
	private waitForCloseSignal: boolean;
	/** 最大延迟 */
	private maxDelay: number;
	/** 是否已达到关闭时机（DOMContentLoaded + maxDelay） */
	private isReadyToClose: boolean = false;
	/** 是否已收到外部关闭信号 */
	private isReceiveClose: boolean = false;

	constructor(options: SkeletonControllerOptions) {
		this.skeleton = document.querySelector(options.selector);
		this.contents = (options.contentSelectors ?? []).map((selector) => document.querySelector(selector));
		this.waitForCloseSignal = options.waitForCloseSignal ?? false;
		this.maxDelay = options.maxDelay ?? 200;

		//监听dom是否解析完毕
		watch(() => dataStore.isDomContentLoaded, this.domContentLoadedCallback, {
			immediate: true
		});
	}

	/** 接收外部通知关闭骨架（waitForCloseSignal 为 true 时，业务拿到数据后调用） */
	public receiveClose() {
		this.isReceiveClose = true;
		if (this.isReadyToClose) {
			this.close();
		}
	}

	/** 监听dom是否解析完毕 */
	private domContentLoadedCallback = (val: boolean) => {
		if (!val && !this.isReadyToClose) return;
		this.isReadyToClose = true;
		setTimeout(() => {
			this.close();
		}, this.maxDelay);
	};

	/** 关闭骨架：隐藏骨架容器，显示内容容器 */
	private close() {
		if (this.waitForCloseSignal && !this.isReceiveClose) return;
		this.skeleton?.classList.add("hidden");
		this.contents.forEach((el) => el?.classList.remove("hidden"));
	}
}

export default SkeletonController;
