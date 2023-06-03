/*
 * @Author: mulingyuer
 * @Date: 2023-03-23 19:58:22
 * @LastEditTime: 2023-06-03 21:40:18
 * @LastEditors: mulingyuer
 * @Description: 目录树
 * @FilePath: \Typecho_Theme_JJ\src\modules\post\directory_tree\index.ts
 * 怎么可能会有bug！！！
 */
import "./style.scss";
import emitter, { MittEventName } from "@/utils/mittEvent";
import { throttle, findParentElementByClass } from "@/utils/tool";

class DirectoryTree {
	/** 目录树容器 */
	private wrap = document.querySelector(".directory-tree");
	/** list滚动容器 */
	private listWrap = document.querySelector(".directory-tree-body");
	/** 目录列表 */
	private list = document.querySelector(".directory-tree-list");
	/** 当前选中的item元素 */
	private activeItem: HTMLElement | null = null;
	/** 当前页面的title元素数组 */
	private titles: Array<HTMLElement> = [];
	/** 事件代理点击不触发scroll处理 */
	private clickTimer: NodeJS.Timeout | null = null;

	constructor() {
		emitter.on(MittEventName.HEADER_SHOW, this.listenHeaderShow);
		if (!this.list) return;
		// list点击事件代理
		this.list.addEventListener("click", this.onTreeClick);

		//获取标题元素
		const listAList = Array.from(this.list.querySelectorAll(".directory-tree-list-item-link"));
		this.titles = listAList.map((a) => {
			const id = a.getAttribute("href")?.replace("#", "")!;
			const title = document.getElementById(id)!;
			return title;
		});

		//监听滚动事件，悬浮导航、滚动动画等，推荐的间隔时间为50ms或更短
		this.onScroll = throttle(this.onScroll, 50);
		window.addEventListener("scroll", this.onScroll);
		this.onScroll();
	}

	/** 监听header的显示隐藏 */
	private listenHeaderShow = (status: boolean) => {
		if (status) {
			this.wrap?.classList.add("heighten");
		} else {
			this.wrap?.classList.remove("heighten");
		}
	};

	/** 事件代理 */
	private onTreeClick = (event: Event) => {
		const target = event.target! as HTMLElement;
		const isA = this.isAElement(target);
		const isAWrap = target.classList.contains("directory-tree-list-item-link-wrapper");
		if (isA || isAWrap) {
			this.setParentItemActive(target);
		}
		//防止主动点击和scroll监听冲突，打个标记
		if (this.clickTimer) {
			clearTimeout(this.clickTimer);
			this.clickTimer = null;
		}
		this.clickTimer = setTimeout(() => {
			this.clickTimer = null;
		}, 200);
	};

	/**
	 * @description: 设置a元素的父级item选中
	 * @param {object} options 参数 {target: a元素, targetType: a元素类型}
	 * @Date: 2023-06-03 19:12:50
	 * @Author: mulingyuer
	 */
	private setParentItemActive(target: HTMLElement) {
		let activeItem: HTMLElement | null = findParentElementByClass(target, "directory-tree-list-item");
		if (!activeItem) return;
		if (this.activeItem) {
			this.activeItem.classList.remove("active");
		}
		activeItem.classList.add("active");
		this.activeItem = activeItem;
	}

	/** 滚动事件 */
	private onScroll = () => {
		if (this.clickTimer) return;
		const scrollTop = window.scrollY || document.documentElement.scrollTop;
		const viewHeight = document.documentElement.clientHeight;
		let activeTitle: HTMLElement | undefined = void 0;
		//截取出当前可视区域内的标题元素
		const dataList = this.titles
			.map((title) => {
				return {
					title,
					offsetTop: this.getOffsetTopBetter(title)
				};
			})
			.filter(({ offsetTop }) => offsetTop < scrollTop + viewHeight && offsetTop >= scrollTop);
		//判断一下，如果筛选出来没有内容，比对下最后一个，如果最后一个已经属于已浏览区域，那么就选最后一个
		if (dataList.length === 0) {
			const lastTitle = this.titles[this.titles.length - 1];
			const offsetTop = this.getOffsetTopBetter(lastTitle);
			if (offsetTop < scrollTop + viewHeight) {
				activeTitle = lastTitle;
			}
		} else {
			activeTitle = dataList[0].title;
		}
		//高亮处理
		if (!activeTitle) return;
		const id = (activeTitle as HTMLElement).getAttribute("id");
		if (!id) return;
		const a: HTMLElement | null = document.querySelector(`.directory-tree-list-item-link[href="#${id}"]`);
		if (!a) return;
		this.setParentItemActive(a);
		//目录树如果存在scroll需要让其出现在视野中
		const offsetTop = this.activeItem?.offsetTop || 0;
		this.listWrap?.scrollTo({ top: offsetTop });
	};

	/** 是否是a元素 */
	private isAElement = (target: EventTarget | null): target is HTMLAnchorElement => {
		return target instanceof HTMLAnchorElement;
	};

	/** 获取元素距离文档顶部的距离 */
	private getOffsetTopBetter(element: HTMLElement): number {
		let offsetTop = 0;
		while (element) {
			offsetTop += element.offsetTop;
			element = element.offsetParent as HTMLElement;
		}
		return offsetTop;
	}
}

new DirectoryTree();
