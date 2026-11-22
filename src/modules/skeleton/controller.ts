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

const isDomContentLoaded = () => dataStore.isDomContentLoaded || document.readyState !== "loading";

// 模块可能在 DOMContentLoaded 之后加载，因此先读取 readyState，再监听后续事件。
dataStore.isDomContentLoaded = isDomContentLoaded();
if (!dataStore.isDomContentLoaded) {
	document.addEventListener(
		"DOMContentLoaded",
		() => {
			dataStore.isDomContentLoaded = true;
		},
		{ once: true }
	);
}

export interface SkeletonControllerOptions {
	/** 骨架容器选择器（即 renderSkeleton 的 selector，需带 .） */
	selector: string;
	/** 关闭骨架时需要移除 hidden 的内容容器选择器列表 */
	contentSelectors?: string[];
	/** 是否需要外部调用 receiveClose() 后才允许关闭（等待接口数据场景），默认 false */
	waitForCloseSignal?: boolean;
	/** 从控制器创建起骨架最少展示的毫秒数（避免闪烁），默认 200 */
	maxDelay?: number;
}

class SkeletonController {
	/** 骨架容器 */
	private skeleton: HTMLElement | null;
	/** 内容容器列表 */
	private contents: Array<HTMLElement | null>;
	/** 是否等待外部关闭信号 */
	private waitForCloseSignal: boolean;
	/** 最小展示时间 */
	private minimumVisibleDuration: number;
	/** DOM 是否已就绪 */
	private isDomContentLoaded: boolean = false;
	/** 是否已收到外部关闭信号 */
	private isReceiveClose: boolean = false;
	/** 最小展示时间是否已满足 */
	private isMinimumVisibleDurationElapsed: boolean = false;
	/** 是否已关闭 */
	private isClosed: boolean = false;

	constructor(options: SkeletonControllerOptions) {
		this.skeleton = document.querySelector(options.selector);
		this.contents = (options.contentSelectors ?? []).map((selector) => document.querySelector(selector));
		this.waitForCloseSignal = options.waitForCloseSignal ?? false;
		this.minimumVisibleDuration = Math.max(0, options.maxDelay ?? 200);
		setTimeout(() => {
			this.isMinimumVisibleDurationElapsed = true;
			this.tryClose();
		}, this.minimumVisibleDuration);

		watch(() => dataStore.isDomContentLoaded, this.domContentLoadedCallback, {
			immediate: true
		});
	}

	/** 接收外部通知关闭骨架（waitForCloseSignal 为 true 时，业务拿到数据后调用） */
	public receiveClose() {
		if (this.isReceiveClose) return;
		this.isReceiveClose = true;
		this.tryClose();
	}

	/** 记录 DOM 就绪状态，与关闭信号的到来顺序无关 */
	private domContentLoadedCallback = (domContentLoaded: boolean) => {
		if (!domContentLoaded || this.isDomContentLoaded) return;
		this.isDomContentLoaded = true;
		this.tryClose();
	};

	/** 仅在 DOM、业务信号和最小展示时间均就绪时关闭 */
	private tryClose() {
		if (this.isClosed || !this.isDomContentLoaded || !this.isMinimumVisibleDurationElapsed) return;
		if (this.waitForCloseSignal && !this.isReceiveClose) return;
		this.close();
	}

	/** 关闭骨架：隐藏骨架容器，显示内容容器 */
	private close = () => {
		if (this.isClosed) return;
		this.isClosed = true;
		this.skeleton?.classList.add("hidden");
		this.contents.forEach((el) => el?.classList.remove("hidden"));
	};
}

export default SkeletonController;
