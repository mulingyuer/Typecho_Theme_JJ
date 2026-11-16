import { readonly, ref } from "vue";
import { jjLocal } from "@/utils/storage";
import type { SearchHistoryItem, UseSearchHistoryReturn } from "./types";

const STORAGE_KEY = "search_history";
const MAX_COUNT = 6;

/** 清洗可能被手动修改或来自旧版本的本地数据，同时保留原有排列顺序。 */
function normalizeHistory(value: unknown): SearchHistoryItem[] {
	if (!Array.isArray(value)) return [];
	const items = value
		.filter((item): item is string => typeof item === "string")
		.map((item) => item.trim())
		.filter((item) => item.length > 0);
	return [...new Set(items)].slice(0, MAX_COUNT);
}

// 模块级单例让桌面 DOM 交互和移动 Vue 组件共享同一份实时数据。
const history = ref<SearchHistoryItem[]>(normalizeHistory(jjLocal.getItem(STORAGE_KEY)));

/** 搜索历史只读暴露给视图，所有变更统一经过这里同步到 localStorage。 */
export function useSearchHistory(): UseSearchHistoryReturn {
	/** 添加关键词；重复项移到首位，超出上限时移除最旧记录。 */
	function addHistory(keyword: string) {
		const value = keyword.trim();
		if (!value) return;
		history.value = [value, ...history.value.filter((item) => item !== value)].slice(0, MAX_COUNT);
		jjLocal.setItem(STORAGE_KEY, history.value);
	}

	/** 同时清空内存状态和持久化数据，已打开的桌面及移动端视图会自动更新。 */
	function clearHistory() {
		history.value = [];
		jjLocal.setItem(STORAGE_KEY, []);
	}

	return { history: readonly(history), addHistory, clearHistory };
}
