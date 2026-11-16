import type { DeepReadonly, Ref } from "vue";

export type SearchHistoryItem = string;

export interface UseSearchHistoryReturn {
	/** 最新记录在前，视图只能读取，不能直接修改。 */
	history: DeepReadonly<Ref<SearchHistoryItem[]>>;
	addHistory: (keyword: string) => void;
	clearHistory: () => void;
}
