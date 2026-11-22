import { watch } from "vue";
import { useSearchHistory } from "@/composables/useSearchHistory";
import { dataStore } from "@/store/data";
import MobileSearchDialog from "@/components/MobileSearchDialog/index.vue";
import { useModal } from "@/composables/useModal";

/** 统一管理桌面搜索交互和移动端搜索弹窗，两端共享搜索历史。 */
export class HeaderSearch {
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
	private readonly modal = useModal();

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
		this.historyWrap.addEventListener("mousedown", (event) => event.preventDefault());
		this.clearBtn.addEventListener("click", this.onClearClick.bind(this));
		this.historyList.addEventListener("mousemove", this.onHistoryHover.bind(this));
		this.historyList.addEventListener("click", this.onHistoryClick.bind(this));
		document.addEventListener("click", this.onDocumentClick.bind(this));
		document.querySelector(".header-search-icon")?.addEventListener("click", this.openMobileSearch.bind(this));
	}

	/** 站点搜索地址由 PHP 桌面表单提供，移动端复用同一地址。 */
	private openMobileSearch() {
		if (dataStore.windowWidth > 960) return;
		void this.modal
			.open({
				component: MobileSearchDialog,
				props: { action: this.searchForm.action },
				persistent: { key: "mobile-search" }
			})
			.catch(() => {
				// 关闭搜索属于正常取消。
			});
	}

	private onHistoryChange() {
		this.renderHistory();
		if (!this.searchHistory.history.value.length) this.closeHistory();
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
		this.renderHistory();
		this.closeHistory();
		this.searchInput.blur();
	}

	private onDocumentClick(event: MouseEvent) {
		if (this.searchWrap.contains(event.target as Node)) return;
		this.closeHistory();
		this.searchWrap.classList.remove("open-search");
	}
}
