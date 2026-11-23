/*
 * @Author: mulingyuer
 * @Date: 2026-11-24 01:02:23
 * @LastEditTime: 2026-11-24 01:46:38
 * @LastEditors: mulingyuer
 * @Description: 目录树
 * @FilePath: \Typecho_Theme_JJ\src\modules\post\directory-tree\index.ts
 * 怎么可能会有bug！！！
 */
import "./style.scss";

/** 阅读线位置（视口高度百分比）：标题越过该线即视为当前所在章节 */
const READING_LINE_PERCENT = 20;
/** 无原生 scrollend 时，滚动停止多久后视为结算（毫秒） */
const SCROLL_SETTLE_DELAY = 120;
/** 程序滚动的兜底结算时间（毫秒），覆盖目标无需滚动等不会产生滚动事件的场景 */
const SCROLL_SETTLE_TIMEOUT = 2000;
/** 是否支持原生 scrollend 事件（支持时无需用定时器猜测滚动是否结束） */
const supportsScrollEnd = "onscrollend" in window;

/**
 * 文章目录树
 *
 * 高亮：
 * - 主要触发源是 IntersectionObserver，标题跨越"阅读线"区域时回调（浏览器原生调度，
 *   滚动过程中无需逐帧计算元素位置）；
 * - 滚动结算（scrollend，降级为滚动停止）时再按阅读线校正一次，覆盖瞬间跳转
 *   （浏览器恢复滚动位置、地址栏锚点跳转等）不产生跨线事件的情况。
 * 导航：点击目录项后平滑滚动到对应标题，滚动期间暂停高亮更新，结算后再校正。
 */
class DirectoryTree {
	/** 目录列表根元素 */
	private readonly list: HTMLElement | null;
	/** 当前高亮的目录项 */
	private activeItem: HTMLElement | null = null;
	/** 标题 id -> 目录项元素，初始化时构建，高亮时 O(1) 查找 */
	private readonly itemMap = new Map<string, HTMLElement>();
	/** 文章标题元素，顺序与目录项一致 */
	private readonly headings: HTMLElement[] = [];
	/** 程序滚动标志位：点击导航期间为 true，暂停观察器的高亮更新 */
	private isProgrammaticScrolling = false;
	/** 滚动结算定时器（程序滚动兜底 + 无 scrollend 时的滚动防抖） */
	private settleTimer: ReturnType<typeof setTimeout> | null = null;

	constructor() {
		this.list = document.querySelector<HTMLElement>(".directory-tree-list");
		if (!this.list) return;

		this.collectHeadings();
		if (this.headings.length === 0) return;

		this.list.addEventListener("click", this.onListClick);

		// 触发区域为视口顶部 READING_LINE_PERCENT% 的高度：标题进入/离开该区域时才回调，
		// 回调里再按阅读线精确计算当前章节，其余滚动过程不需要任何计算
		const observer = new IntersectionObserver(this.onIntersection, {
			rootMargin: `0px 0px -${100 - READING_LINE_PERCENT}% 0px`,
			threshold: 0
		});
		this.headings.forEach((heading) => observer.observe(heading));

		// 滚动结算监听：scrollend 精确可靠；不支持时降级为 scroll + 防抖
		window.addEventListener(supportsScrollEnd ? "scrollend" : "scroll", this.onWindowScroll, { passive: true });
		// 页面完全加载后再校正一次，覆盖浏览器恢复滚动位置、内容替换等异步布局变化
		window.addEventListener("load", this.onWindowLoaded, { once: true });
		// 从后台切回前台时校正一次（后台期间浏览器会暂停回调，切回后高亮可能滞后）
		document.addEventListener("visibilitychange", this.onVisibilityChange);
	}

	/**
	 * 收集文章标题元素，同时构建标题 id -> 目录项的映射
	 *
	 * 取不到标题（如 [hide] 截断、内容尚未渲染）的目录项直接跳过，
	 * 避免留下既无法高亮也无法导航的死项
	 */
	private collectHeadings(): void {
		if (!this.list) return;

		const links = this.list.querySelectorAll<HTMLAnchorElement>(".directory-tree-list-item-link");
		links.forEach((link) => {
			const href = link.getAttribute("href");
			if (!href || !href.startsWith("#")) return;

			const id = href.slice(1);
			if (this.itemMap.has(id)) return;

			const heading = document.getElementById(id);
			const item = link.closest<HTMLElement>(".directory-tree-list-item");
			if (!heading || !item) return;

			this.itemMap.set(id, item);
			this.headings.push(heading);
		});
	}

	/** IntersectionObserver 回调：标题跨越阅读线区域时重新计算高亮 */
	private onIntersection = (): void => {
		if (this.isProgrammaticScrolling) return;
		this.updateActiveHeading();
	};

	/** 页面加载完成：布局稳定后再校正一次高亮 */
	private onWindowLoaded = (): void => {
		if (this.isProgrammaticScrolling) return;
		this.updateActiveHeading();
	};

	/** 从后台切回前台：校正一次高亮（后台期间浏览器会暂停观察器回调） */
	private onVisibilityChange = (): void => {
		if (document.visibilityState !== "visible") return;
		if (this.isProgrammaticScrolling) return;
		this.updateActiveHeading();
	};

	/**
	 * window 滚动事件处理
	 *
	 * scrollend 下直接结算；否则防抖，滚动停止一段时间后才结算，
	 * 保证滚动过程中只由 IntersectionObserver 驱动高亮，避免逐帧计算位置
	 */
	private onWindowScroll = (): void => {
		if (supportsScrollEnd) {
			this.settleScroll();
			return;
		}
		if (this.settleTimer) clearTimeout(this.settleTimer);
		this.settleTimer = setTimeout(this.settleScroll, SCROLL_SETTLE_DELAY);
	};

	/** 滚动结算：结束程序滚动状态，并按阅读线校正一次高亮 */
	private settleScroll = (): void => {
		this.clearSettleTimer();
		this.isProgrammaticScrolling = false;
		this.updateActiveHeading();
	};

	/** 清理滚动结算定时器 */
	private clearSettleTimer(): void {
		if (this.settleTimer) {
			clearTimeout(this.settleTimer);
			this.settleTimer = null;
		}
	}

	/**
	 * 按阅读线计算并设置当前高亮的目录项
	 *
	 * 当前章节 = 最后一个越过阅读线的标题；尚未有标题越线时高亮第一项；
	 * 页面已滚动到底部时高亮最后一项（末尾标题可能永远越不过阅读线）。
	 */
	private updateActiveHeading(): void {
		// 标题没有 layout（如移动端隐藏了桌面目录树）时不做判定，避免尺寸全为 0 导致误判
		if (this.headings[0].getClientRects().length === 0) return;

		const line = (window.innerHeight * READING_LINE_PERCENT) / 100;
		const lastHeading = this.headings[this.headings.length - 1];
		let activeHeading: HTMLElement | undefined;

		// 标题在文档中自上而下排列，从后往前找到第一个越过阅读线的即可
		for (let i = this.headings.length - 1; i >= 0; i--) {
			if (this.headings[i].getBoundingClientRect().top <= line) {
				activeHeading = this.headings[i];
				break;
			}
		}

		if (!activeHeading) {
			activeHeading = this.headings[0];
		} else if (activeHeading !== lastHeading && this.isScrolledToBottom()) {
			activeHeading = lastHeading;
		}

		this.setActive(activeHeading.id);
	}

	/** 页面是否已滚动到底部（页面本身不可滚动时返回 false） */
	private isScrolledToBottom(): boolean {
		const doc = document.documentElement;
		if (doc.scrollHeight <= doc.clientHeight) return false;
		const scrollTop = window.scrollY || doc.scrollTop;
		return scrollTop + doc.clientHeight >= doc.scrollHeight - 2;
	}

	/**
	 * 设置高亮的目录项
	 * @param headingId 目标标题的 id
	 */
	private setActive(headingId: string): void {
		const item = this.itemMap.get(headingId);
		if (!item || item === this.activeItem) return;

		this.activeItem?.classList.remove("active");
		item.classList.add("active");
		this.activeItem = item;

		// 目录项不可见（移动端面板未打开等）时无需滚动
		if (item.getClientRects().length === 0) return;
		// block: "nearest" 只在目录项不可见时滚动，已可见时不会产生跳动
		item.scrollIntoView({ block: "nearest" });
	}

	/** 目录列表点击事件代理：点击目录项平滑滚动到对应标题 */
	private onListClick = (event: Event): void => {
		const target = event.target;
		if (!(target instanceof Element)) return;

		// 兼容点击链接本身与它外层的包装元素
		const link =
			target.closest<HTMLAnchorElement>("a.directory-tree-list-item-link") ??
			target
				.closest<HTMLElement>(".directory-tree-list-item-link-wrapper")
				?.querySelector<HTMLAnchorElement>("a.directory-tree-list-item-link") ??
			null;
		if (!link) return;

		const href = link.getAttribute("href");
		if (!href || !href.startsWith("#")) return;

		const headingId = href.slice(1);
		const heading = document.getElementById(headingId);
		if (!heading) return;

		event.preventDefault();
		// 标记为程序滚动，期间观察器不更新高亮，避免平滑滚动途中反复切换
		this.isProgrammaticScrolling = true;
		this.clearSettleTimer();
		// 兜底：目标位置无需滚动时不会产生滚动事件
		this.settleTimer = setTimeout(this.settleScroll, SCROLL_SETTLE_TIMEOUT);
		// 同步地址栏锚点但不触发浏览器默认跳转
		window.history.replaceState(null, "", href);
		// scrollIntoView 遵循 html 上的 scroll-padding-top，标题不会被固定头部遮挡
		heading.scrollIntoView({ behavior: "smooth", block: "start" });
		this.setActive(headingId);
	};
}

new DirectoryTree();
