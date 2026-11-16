/*
 * @Author: mulingyuer
 * @Date: 2023-03-15 19:36:49
 * @LastEditTime: 2023-07-16 17:35:48
 * @LastEditors: mulingyuer
 * @Description: header模块
 * @FilePath: /Typecho_Theme_JJ/src/modules/header/index.ts
 * 怎么可能会有bug！！！
 */
import "./style.scss";
import { dataStore } from "@/store/data";
import { watch } from "vue";
import { useSearchHistory } from "@/composables/useSearchHistory";
import eventMitt from "@/utils/mittEvent";
import MobileSearchDialog from "@/components/MobileSearchDialog";
import LoginDialog from "@/components/LoginDialog";
import type { LoginDialogProps } from "@/components/LoginDialog/types";
import { useModal } from "@/composables/useModal";

const modal = useModal();

/** header class */
class Header {
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
new Header();

/** header-nav class */
class HeaderNav {
	private mobileMenu: HTMLElement; //按钮
	private navList: HTMLElement; //菜单
	private navStatus: boolean = false; //显示true,隐藏false

	constructor() {
		this.mobileMenu = document.querySelector(".header-nav-mobile-menu") as HTMLElement;
		this.navList = document.querySelector(".header-nav-list") as HTMLElement;

		this.toggleMenu = this.toggleMenu.bind(this);
		this.clickOtherCloseMenu = this.clickOtherCloseMenu.bind(this);

		//绑定事件
		this.mobileMenu.addEventListener("click", this.toggleMenu);
		document.addEventListener("click", this.clickOtherCloseMenu);
	}

	/** 切换菜单 */
	private toggleMenu() {
		this.mobileMenu.classList.toggle("active");
		this.navList.classList.toggle("visible");
		this.navStatus = !this.navStatus;
	}

	/** 点击其他区域关闭菜单 */
	private clickOtherCloseMenu(event: MouseEvent) {
		if (!this.navStatus) return;
		const target = event.target as HTMLElement;
		if (this.mobileMenu.contains(target) || this.navList.contains(target)) return;
		this.toggleMenu();
	}
}
new HeaderNav();

/** 桌面搜索保留 PHP 表单，只负责历史 DOM 渲染、键盘交互和原生提交。 */
class HeaderSearch {
	private searchWrap: HTMLElement;
	private searchForm: HTMLFormElement;
	private searchInput: HTMLInputElement;
	private historyWrap: HTMLElement;
	private historyList: HTMLUListElement;
	private clearBtn: HTMLButtonElement;
	/** -1 表示未选择历史项。 */
	private activeIndex = -1;
	/** 中文输入法组词期间不处理 Enter 和方向键。 */
	private isComposing = false;
	private readonly searchHistory = useSearchHistory();

	constructor() {
		this.searchWrap = document.querySelector(".header-search-wrap") as HTMLElement;
		this.searchForm = this.searchWrap.querySelector(".header-search-form") as HTMLFormElement;
		this.searchInput = this.searchForm.querySelector(".header-search-input") as HTMLInputElement;
		this.historyWrap = this.searchForm.querySelector(".search-history") as HTMLElement;
		this.historyList = this.searchForm.querySelector(".search-history-list") as HTMLUListElement;
		this.clearBtn = this.searchForm.querySelector(".search-history-clear-btn") as HTMLButtonElement;

		this.renderHistory();
		// 移动端清空历史时，桌面列表也会通过共享状态同步更新。
		watch(this.searchHistory.history, this.onHistoryChange.bind(this));
		this.searchForm.addEventListener("submit", this.onSubmit.bind(this));
		this.searchInput.addEventListener("focus", this.onInputFocus.bind(this));
		this.searchInput.addEventListener("keydown", this.onInputKeydown.bind(this));
		this.searchInput.addEventListener("compositionstart", () => (this.isComposing = true));
		this.searchInput.addEventListener("compositionend", () => (this.isComposing = false));
		this.searchInput.addEventListener("blur", this.onInputBlur.bind(this));
		this.clearBtn.addEventListener("click", this.onClearClick.bind(this));
		this.historyList.addEventListener("mousemove", this.onHistoryHover.bind(this));
		this.historyList.addEventListener("click", this.onHistoryClick.bind(this));
		document.addEventListener("click", this.onDocumentClick.bind(this));
	}

	private onHistoryChange() {
		this.renderHistory();
		if (this.searchHistory.history.value.length) this.historyWrap.classList.add("visible");
	}

	private onInputFocus() {
		this.searchWrap.classList.add("open-search");
		this.openHistory();
	}

	private onInputBlur() {
		if (!this.searchWrap.contains(document.activeElement)) this.searchWrap.classList.remove("open-search");
	}

	/** 历史展开时接管方向键和 Escape，Enter 仍统一由 form 的 submit 处理。 */
	private onInputKeydown(event: KeyboardEvent) {
		if (this.isComposing || event.isComposing || event.keyCode === 229) {
			if (event.key === "Enter") event.preventDefault();
			return;
		}
		if (event.key === "Escape") {
			this.closeHistory();
			return;
		}
		if (!["ArrowDown", "ArrowUp"].includes(event.key) || !this.isHistoryVisible()) return;
		event.preventDefault();
		const length = this.searchHistory.history.value.length;
		// 首尾循环；从 -1 按上键会选中最后一项。
		const direction = event.key === "ArrowDown" ? 1 : -1;
		this.setActiveIndex((this.activeIndex + direction + length) % length);
	}

	/** 有选中项时提交该项，否则提交当前输入；统一入口避免 Enter 重复请求。 */
	private onSubmit(event: SubmitEvent) {
		event.preventDefault();
		const activeItem = this.getHistoryItem(this.activeIndex);
		const keyword = this.isHistoryVisible() && activeItem ? activeItem.dataset.value : this.searchInput.value;
		if (!keyword) return;
		this.submit(keyword);
	}

	/** 鼠标点击、键盘选择和普通输入最终都使用 Typecho 原生 POST。 */
	private submit(keyword: string) {
		const value = keyword.trim();
		if (!value) return;
		this.searchHistory.addHistory(value);
		this.closeHistory();
		this.searchInput.value = value;
		this.searchForm.submit();
	}

	private openHistory() {
		this.setActiveIndex(-1);
		if (!this.searchHistory.history.value.length) {
			this.closeHistory();
			return;
		}
		this.historyWrap.classList.add("visible");
		this.searchInput.setAttribute("aria-expanded", "true");
	}

	private closeHistory() {
		this.historyWrap.classList.remove("visible");
		this.searchInput.setAttribute("aria-expanded", "false");
		this.setActiveIndex(-1);
	}

	private isHistoryVisible() {
		return this.historyWrap.classList.contains("visible");
	}

	/** 使用 textContent 而非 HTML 拼接，特殊字符只作为文本显示。 */
	private renderHistory() {
		this.historyList.replaceChildren();
		this.searchHistory.history.value.forEach((value, index) => {
			const item = document.createElement("li");
			item.id = `header-search-history-${index}`;
			item.className = "search-history-list-item";
			item.dataset.value = value;
			item.setAttribute("role", "option");
			item.setAttribute("aria-selected", "false");
			item.textContent = value;
			this.historyList.appendChild(item);
		});
	}

	/** 同步高亮、输入值和 ARIA，鼠标悬停与键盘选择共用此状态。 */
	private setActiveIndex(index: number) {
		this.activeIndex = index;
		this.historyList.querySelectorAll<HTMLLIElement>("[role='option']").forEach((item, itemIndex) => {
			const active = itemIndex === index;
			item.classList.toggle("active", active);
			item.setAttribute("aria-selected", String(active));
		});
		const activeItem = this.getHistoryItem(index);
		if (activeItem) {
			this.searchInput.value = activeItem.dataset.value ?? "";
			this.searchInput.setAttribute("aria-activedescendant", activeItem.id);
			activeItem.scrollIntoView({ block: "nearest" });
		} else {
			this.searchInput.removeAttribute("aria-activedescendant");
		}
	}

	private getHistoryItem(index: number) {
		return index >= 0 ? this.historyList.querySelectorAll<HTMLLIElement>("[role='option']")[index] : undefined;
	}

	private onHistoryHover(event: MouseEvent) {
		const item = (event.target as HTMLElement).closest<HTMLLIElement>("[role='option']");
		if (!item || item.parentElement !== this.historyList) return;
		this.setActiveIndex(Array.from(this.historyList.children).indexOf(item));
	}

	private onHistoryClick(event: MouseEvent) {
		const item = (event.target as HTMLElement).closest<HTMLLIElement>("[role='option']");
		if (item?.parentElement === this.historyList && item.dataset.value) this.submit(item.dataset.value);
	}

	private onClearClick(event: MouseEvent) {
		event.preventDefault();
		this.searchHistory.clearHistory();
		this.closeHistory();
		this.searchInput.focus();
	}

	private onDocumentClick(event: MouseEvent) {
		if (this.searchWrap.contains(event.target as Node)) return;
		this.closeHistory();
		this.searchWrap.classList.remove("open-search");
	}
}
new HeaderSearch();

/** Header 只负责打开单例弹窗，站点搜索地址由 PHP 表单提供。 */
function openMobileSearch() {
	const searchForm = document.querySelector<HTMLFormElement>(".header-search-form");
	if (!searchForm || dataStore.windowWidth > 960) return;
	void modal
		.open({
			component: MobileSearchDialog,
			props: { action: searchForm.action },
			persistent: { key: "mobile-search" }
		})
		.catch(() => {
			// 关闭搜索属于正常取消。
		});
}
document.querySelector(".header-search-icon")?.addEventListener("click", openMobileSearch);

//header-menu
class HeaderMenu {
	private menuBtn: HTMLElement | null = null; //菜单按钮
	private menuWrap: HTMLElement | null = null; //菜单容器

	constructor() {
		this.menuBtn = document.querySelector(".header-avatar");
		this.menuWrap = document.querySelector(".header-menu-body");

		if (!this.menuBtn || !this.menuWrap) return;

		//绑定事件
		this.menuBtn.addEventListener("click", this.onClickMenu.bind(this));
		document.addEventListener("click", this.onClickOtherClose.bind(this));
	}

	/** 菜单按钮事件 */
	private onClickMenu() {
		this.menuWrap && this.menuWrap.classList.toggle("visible");
	}

	/** 点击其他区域关闭 */
	private onClickOtherClose(event: MouseEvent) {
		if (!this.menuBtn || !this.menuWrap) return;
		if (!this.menuWrap.classList.contains("visible")) return;
		const target = event.target as HTMLElement;
		if (this.menuBtn.contains(target) || this.menuWrap.contains(target)) return;
		this.menuWrap.classList.remove("visible");
	}
}
new HeaderMenu();

type LoginConfig = Pick<LoginDialogProps, "action" | "referer">;

function initLoginDialog() {
	const configElement = document.querySelector<HTMLScriptElement>("#header-login-config");
	// 已登录页面没有登录配置，无需初始化。
	if (!configElement) return;

	let config: LoginConfig;
	try {
		config = JSON.parse(configElement.textContent || "") as LoginConfig;
	} catch (error) {
		console.error("登录弹窗配置解析失败", error);
		return;
	}
	if (!config.action || !config.referer) {
		console.error("登录弹窗配置缺少 action 或 referer");
		return;
	}

	function openLoginDialog() {
		// 两个入口复用同一常驻实例；关闭产生的 rejection 属于正常取消。
		void modal
			.open({
				component: LoginDialog,
				props: { action: config.action, referer: config.referer },
				persistent: { key: "login-dialog" }
			})
			.catch(() => {});
	}

	document.querySelector(".header-login-btn")?.addEventListener("click", openLoginDialog);
	document.querySelector(".header-article-btn.login")?.addEventListener("click", openLoginDialog);
}
initLoginDialog();
