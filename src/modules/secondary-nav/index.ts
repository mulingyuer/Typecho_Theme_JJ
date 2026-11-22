/*
 * @Author: mulingyuer
 * @Date: 2023-03-19 14:30:47
 * @LastEditTime: 2023-03-21 17:43:42
 * @LastEditors: mulingyuer
 * @Description: 二级分类
 * @FilePath: \Typecho_Theme_JJ\src\modules\secondary_nav\index.ts
 * 怎么可能会有bug！！！
 */
import "./style.scss";

/** DOM 元素类型 */
type Dom = HTMLElement | null;

/** 二级分类导航，仅在内容溢出折叠区域时显示展开按钮 */
class SecondaryNav {
	private secondaryNav: Dom = null; //二级导航
	private foldBtn: HTMLButtonElement | null = null; //折叠按钮
	private foldContent: Dom = null; //折叠内容
	private navContent: Dom = null; //展示的容器
	private rightContent: Dom = null; //右侧按钮容器
	private isFold: boolean = true; //是否折叠
	private resizeObserver: ResizeObserver | null = null; //容器尺寸监听器
	private containerWidth: number | null = null; //上一次测量时的容器宽度
	private measureFrame: number | null = null; //待执行的溢出测量帧
	private destroyed = false; //是否已销毁，防止离开页面后继续响应事件

	/** 初始化 DOM、事件监听和首次溢出检测 */
	constructor() {
		this.secondaryNav = document.querySelector(".secondary-nav");
		if (!this.secondaryNav) return;
		this.foldBtn = this.secondaryNav.querySelector(".secondary-nav-fold-btn");
		this.foldContent = this.secondaryNav.querySelector(".secondary-nav-fold");
		this.navContent = this.secondaryNav.querySelector(".secondary-nav-content");
		this.rightContent = this.secondaryNav.querySelector(".secondary-nav-right");
		// 必要元素不完整时不启用交互，避免空元素访问异常
		if (!this.foldBtn || !this.foldContent || !this.navContent || !this.rightContent) return;

		this.foldBtn.addEventListener("click", this.onFoldBtnClick);
		window.addEventListener("pagehide", this.onPageHide);
		this.observeContainerWidth();
		this.checkContainerWidth();
		// 字体加载可能改变分类宽度，加载完成后补测一次
		if (document.fonts) {
			void document.fonts.ready.then(() => {
				this.scheduleOverflowCheck();
			});
		}
	}

	/** 折叠按钮点击事件 */
	private onFoldBtnClick = () => {
		if (this.isFold) {
			this.unfold();
		} else {
			this.fold();
		}
	};

	/** 清除内联高度，恢复 CSS 定义的单行折叠高度 */
	private fold() {
		if (!this.navContent || !this.foldBtn) return;
		this.isFold = true;
		this.navContent.style.height = "";
		this.foldBtn.classList.remove("open");
		this.foldBtn.setAttribute("aria-expanded", "false");
	}

	/** 按内容实际高度展开，并同步按钮样式与无障碍状态 */
	private unfold() {
		if (!this.foldContent || !this.navContent || !this.foldBtn) return;
		this.isFold = false;
		this.navContent.style.height = `${this.foldContent.offsetHeight}px`;
		this.foldBtn.classList.add("open");
		this.foldBtn.setAttribute("aria-expanded", "true");
	}

	/** 仅在容器宽度变化时重新判断，忽略展开引起的高度变化 */
	private observeContainerWidth() {
		if (!this.secondaryNav) return;
		if (typeof ResizeObserver !== "undefined") {
			this.resizeObserver = new ResizeObserver(this.checkContainerWidth);
			this.resizeObserver.observe(this.secondaryNav);
			return;
		}
		window.addEventListener("resize", this.checkContainerWidth);
	}

	/** 比较实际容器宽度，过滤仅由高度变化触发的通知 */
	private checkContainerWidth = () => {
		if (!this.secondaryNav || this.destroyed) return;
		const width = this.secondaryNav.getBoundingClientRect().width;
		if (width === this.containerWidth) return;
		this.containerWidth = width;
		this.scheduleOverflowCheck();
	};

	/** 合并同一帧内的初始化、字体加载和尺寸变化事件 */
	private scheduleOverflowCheck() {
		if (this.destroyed || this.measureFrame !== null) return;
		this.measureFrame = window.requestAnimationFrame(() => {
			this.measureFrame = null;
			this.updateOverflowState();
		});
	}

	/** 以恢复折叠后的实际布局判断是否需要展开按钮 */
	private updateOverflowState() {
		if (!this.foldContent || !this.navContent || !this.rightContent) return;
		// 先恢复折叠状态，并让按钮参与布局，确保测量基于真实的可用宽度
		this.fold();
		this.rightContent.hidden = false;

		const contentHeight = this.foldContent.offsetHeight;
		const visibleHeight = this.navContent.offsetHeight;
		// 元素尚未完成布局时不作最终判断，下一帧继续测量
		if (contentHeight === 0 || visibleHeight === 0) {
			this.scheduleOverflowCheck();
			return;
		}
		this.rightContent.hidden = contentHeight <= visibleHeight;
	}

	/** 非页面缓存离开时销毁实例，缓存页面恢复后仍需保留交互 */
	private onPageHide = (event: PageTransitionEvent) => {
		if (!event.persisted) this.destroy();
	};

	/** 页面销毁时释放监听器及尚未执行的测量帧 */
	private destroy() {
		if (this.destroyed) return;
		this.destroyed = true;
		this.foldBtn?.removeEventListener("click", this.onFoldBtnClick);
		window.removeEventListener("pagehide", this.onPageHide);
		window.removeEventListener("resize", this.checkContainerWidth);
		this.resizeObserver?.disconnect();
		if (this.measureFrame !== null) {
			window.cancelAnimationFrame(this.measureFrame);
			this.measureFrame = null;
		}
	}
}
new SecondaryNav();
