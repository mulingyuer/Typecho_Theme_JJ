/*
 * @Author: mulingyuer
 * @Date: 2023-12-10 22:41:51
 * @LastEditTime: 2023-12-10 22:41:51
 * @LastEditors: mulingyuer
 * @Description: 文章nav
 * @FilePath: /Typecho_Theme_JJ/src/modules/home/article_nav/index.ts
 * 怎么可能会有bug！！！
 */
import "./style.scss";
import toast from "@/utils/toast";

class ArticleNav {
	/** 容器元素 */
	private container: HTMLElement = document.querySelector(".article-nav-content")!;
	/** nav item列表 */
	private navList: Array<HTMLElement> = Array.from(document.querySelectorAll(".article-nav-item"));
	/** line */
	private line: HTMLElement = document.querySelector(".article-nav-line")!;
	/** 默认选中的下标 */
	private defaultIndex = 0;
	/** 当前选中的下标 */
	private currentIndex = 0;
	/** 重置使用的定时器 */
	private resetTimer: NodeJS.Timeout | null = null;

	constructor() {
		if (!this.container || this.navList.length === 0) return;
		this.init();
	}

	/** 初始化 */
	private init() {
		// 绑定事件
		this.navList.forEach((item) => {
			item.addEventListener("click", this.onItemClick);
		});
		// 默认选中
		this.currentIndex = this.defaultIndex;
		this.line.addEventListener(
			"transitionend",
			() => {
				this.line.classList.add("show");
			},
			{ once: true }
		);
		this.moveLine();
	}

	/** item点击事件 */
	private onItemClick = (event: MouseEvent) => {
		const target = event.currentTarget;
		if (!target) return;
		const index = this.navList.findIndex((item) => item === target);
		if (index === -1) return;
		this.currentIndex = index;
		this.moveLine();
	};

	/** 根据index计算line移动的距离 */
	private calculateLineMoveDistance(index: number): number {
		const calcItemList = this.navList.slice(0, index + 1);
		let left = 0;
		calcItemList.forEach((item, i) => {
			if (i === index) {
				left += item.offsetWidth / 2;
			} else {
				left += item.offsetWidth;
			}
		});
		const lineWidth = this.line.offsetWidth;
		return left - lineWidth / 2;
	}

	/** 移动line */
	private moveLine() {
		const left = this.calculateLineMoveDistance(this.currentIndex);
		this.line.style.transform = `translateX(${left}px)`;
		if (this.currentIndex !== this.defaultIndex) {
			if (this.resetTimer) clearTimeout(this.resetTimer);
			this.resetTimer = setTimeout(() => {
				this.resetLine();
				toast.warning({ text: "诶嘿~~ 等待好心人完善这个功能呢！", position: "center" });
			}, 1500);
		}
	}

	/** 重置line */
	resetLine() {
		this.currentIndex = this.defaultIndex;
		this.moveLine();
	}
}

new ArticleNav();
