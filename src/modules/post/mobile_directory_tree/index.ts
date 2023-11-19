/*
 * @Author: mulingyuer
 * @Date: 2023-11-19 19:10:35
 * @LastEditTime: 2023-11-20 00:30:19
 * @LastEditors: mulingyuer
 * @Description: 移动端目录树
 * @FilePath: /Typecho_Theme_JJ/src/modules/post/mobile_directory_tree/index.ts
 * 怎么可能会有bug！！！
 */
import "./style.scss";
import type * as MobileDirectoryTreeTypes from "./types";
import { lockBodyScroll, unlockBodyScroll } from "@/utils/rollingLock";
import { useDataStore } from "@/store/data";
import { watch } from "vue";

//获取数据仓库
const dataStore = useDataStore();

class MobileDirectoryTree {
	/** 触发按钮 */
	private triggerBtn: HTMLElement;
	/** 目录树容器 */
	private container: HTMLElement;
	/** mask遮罩 */
	private mask: HTMLElement;
	/** 内容 */
	private content: HTMLElement;
	/** 目录树列表容器 */
	private listContainer: HTMLElement;
	/** 关闭按钮 */
	private closeBtn: HTMLElement;
	/** pc端目录树容器 */
	private pcContainer: HTMLElement;
	/** pc端目录树列表 */
	private pcTreeList: HTMLElement;
	/** 是否初始化 */
	private isInit = false;
	/** 触摸起始数据 */
	private touchData: MobileDirectoryTreeTypes.TouchData = {
		startClientX: 0,
		startClientY: 0,
		endClientX: 0,
		endClientY: 0
	};
	/** 是否触摸移动 */
	private hasMove = false;
	/** 滚动容器scrollTop */
	private scrollTop = 0;

	constructor(options: MobileDirectoryTreeTypes.MobileDirectoryTreeOptions) {
		const { triggerBtn, container, mask, content, closeBtn, pcContainer, pcTreeList, listContainer } = options;
		this.triggerBtn = triggerBtn;
		this.container = container;
		this.mask = mask;
		this.content = content;
		this.listContainer = listContainer;
		this.closeBtn = closeBtn;
		this.pcContainer = pcContainer;
		this.pcTreeList = pcTreeList;

		// 绑定事件
		this.triggerBtn.addEventListener("click", this.triggerBtnClick);
		this.mask.addEventListener("click", this.closeDirectoryTree);
		this.closeBtn.addEventListener("click", this.closeDirectoryTree);
		this.content.addEventListener("touchstart", this.touchStart);
		this.content.addEventListener("touchmove", this.touchMove, false);
		this.content.addEventListener("touchend", this.touchEnd);
		this.listContainer.addEventListener("scroll", this.getScrollTop);

		//监听
		watch(() => dataStore.getWindowWidth, this.onResize);
	}

	/** 触发按钮click事件 */
	private triggerBtnClick = () => {
		const isOpen = this.isOpenDirectoryTree();
		if (!this.isInit) this.init();
		if (isOpen) {
			this.closeDirectoryTree();
		} else {
			this.openDirectoryTree();
		}
	};

	/** 打开目录树 */
	private openDirectoryTree = () => {
		lockBodyScroll();
		this.container.classList.add("visible");
		this.container.offsetWidth;
		this.mask.classList.add("visible");
		this.content.classList.add("visible");
	};

	/** 关闭目录树 */
	private closeDirectoryTree = () => {
		this.mask.addEventListener(
			"transitionend",
			() => {
				this.container.classList.remove("visible");
				unlockBodyScroll();
			},
			{ once: true }
		);
		this.mask.classList.remove("visible");
		this.content.classList.remove("visible");
	};

	/** 目录树是否打开 */
	private isOpenDirectoryTree() {
		return this.container.classList.contains("visible");
	}

	/** 初始化处理 */
	private init() {
		if (this.isInit) return;
		this.isInit = true;
		this.listContainer.appendChild(this.pcTreeList);
	}

	/** 触摸开始 */
	private touchStart = (e: TouchEvent) => {
		const [touchData] = e.touches;
		this.touchData.startClientX = touchData.clientX;
		this.touchData.startClientY = touchData.clientY;
		this.hasMove = false;
	};

	/** 触摸中 */
	private touchMove = (e: TouchEvent) => {
		const [touchData] = e.touches;
		// 记录
		this.touchData.endClientX = touchData.clientX;
		this.touchData.endClientY = touchData.clientY;
		// 是否已经滚动到顶部了
		if (this.scrollTop > 0 && !this.hasMove) {
			this.touchData.startClientX = touchData.clientX;
			this.touchData.startClientY = touchData.clientY;
			return;
		}
		this.hasMove = true;
		// 计算y轴与起始值的差
		let diffY = touchData.clientY - this.touchData.startClientY;
		if (diffY <= 0) diffY = 0;
		// 移动内容
		this.content.style.transition = "none";
		this.content.style.transform = `translateY(${diffY}px)`;
	};

	/** 触摸结束 */
	private touchEnd = () => {
		if (!this.hasMove) return;
		// 计算y轴与起始值的差
		let diffY = this.touchData.endClientY - this.touchData.startClientY;
		if (diffY <= 0) diffY = 0;
		// 如果下移的位置大于或等于容器高度一半就视为关闭
		const halfHeight = this.content.offsetHeight / 2;
		// 先恢复行内样式
		this.content.style.transition = "";
		this.content.style.transform = "";
		if (diffY >= halfHeight) {
			this.closeDirectoryTree();
		}
		this.hasMove = false;
	};

	/** 获取滚动容器scrollTop */
	private getScrollTop = () => {
		this.scrollTop = this.listContainer.scrollTop;
	};

	/** 监听窗口变化 */
	private onResize = (width: number) => {
		if (width > 1000 && this.isInit) {
			if (this.isOpenDirectoryTree()) {
				this.closeDirectoryTree();
			}
			// 还原目录树dom元素位置
			this.pcContainer.appendChild(this.pcTreeList);
			this.isInit = false;
		}
	};
}

const mobileDirectoryTree = new MobileDirectoryTree({
	triggerBtn: document.querySelector(".mobile-directory-tree-toggle")!,
	container: document.querySelector(".mobile-directory-tree")!,
	mask: document.querySelector(".mobile-directory-tree-mask")!,
	content: document.querySelector(".mobile-directory-tree-content")!,
	listContainer: document.querySelector(".mobile-directory-tree-body")!,
	closeBtn: document.querySelector(".mobile-directory-tree-close")!,
	pcContainer: document.querySelector(".directory-tree-body")!,
	pcTreeList: document.querySelector(".directory-tree-list")!
});
