/*
 * @Author: mulingyuer
 * @Date: 2024-04-21 00:46:02
 * @LastEditTime: 2024-04-21 00:54:34
 * @LastEditors: mulingyuer
 * @Description: 懒加载图片
 * @FilePath: /Typecho_Theme_JJ/src/utils/lazyImg/index.ts
 * 怎么可能会有bug！！！
 */
import { Observer } from "@/utils/observer";

export class LazyImg {
	private observer: Observer;

	constructor(list: HTMLImageElement[] | HTMLElement, options?: IntersectionObserverInit) {
		this.observer = new Observer(options);

		let imgList: HTMLImageElement[] = [];

		if (!Array.isArray(list)) {
			imgList = [...list.querySelectorAll<HTMLImageElement>("img[data-src]")];
		}

		imgList.forEach((img) => {
			this.observer.observe(img, this.lazyCallback, this);
		});
	}

	private lazyCallback(entry: IntersectionObserverEntry, observer: Observer) {
		const target = entry.target as HTMLImageElement;
		if (!entry.isIntersecting) return;
		const src = target.dataset.src;
		target.removeAttribute("data-src"); //拿到就删除，防止重复加载

		if (typeof src === "string" && src.trim() !== "") {
			const img = new Image();
			img.addEventListener("load", () => {
				target.src = src;
				//打入标记
				target.dataset.lazy = "true";
				//移除监听
				observer.unobserve(target, this.lazyCallback, this);
			});
			img.src = src;
		}
	}
}
