import { dataStore } from "@/store/data";
import { watch } from "vue";
import eventMitt from "@/utils/mittEvent";

/** header class */
export class Header {
	private headerDom: HTMLElement;
	private MAX_SCROLL_Y: number = 400; //隐藏的最大滚动距离
	private scrollStatus: boolean = true; //显示true,隐藏false

	constructor() {
		this.headerDom = document.getElementById("header") as HTMLElement;

		//监听scroll变化
		this.watchCallback = this.watchCallback.bind(this);
		watch(() => dataStore.scrollY, this.watchCallback, { immediate: true });
	}

	/** 监听的回调函数 */
	private watchCallback(val: number, oldVal: number | undefined) {
		if (typeof oldVal === "number" && oldVal > val) {
			if (this.scrollStatus) return;
			this.headerDom.classList.remove("hidden");
			this.scrollStatus = true;
			eventMitt.emit("HEADER_SHOW", true);
			return;
		}
		if (val >= this.MAX_SCROLL_Y && this.scrollStatus) {
			if (!this.scrollStatus) return;
			this.headerDom.classList.add("hidden");
			this.scrollStatus = false;
			eventMitt.emit("HEADER_SHOW", false);
			return;
		}
	}
}
