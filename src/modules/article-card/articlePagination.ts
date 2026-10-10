/*
 * @Author: mulingyuer
 * @Date: 2026-10-08 00:33:04
 * @LastEditTime: 2026-10-08 00:33:04
 * @LastEditors: mulingyuer
 * @Description:
 * @FilePath: \Typecho_Theme_JJ\src\modules\article-card\articlePagination.ts
 * 怎么可能会有bug！！！
 */
/*
 * @Author: mulingyuer
 * @Date: 2026-10-08
 * @LastEditors: mulingyuer
 * @Description: 文章列表分页（通用分页组件的薄封装：接入缩略图懒加载）
 * @FilePath: /Typecho_Theme_JJ/src/modules/article-card/articlePagination.ts
 * 怎么可能会有bug！！！
 */
import PaginationLoader from "@/modules/pagination";
import ThumbLazy from "./thumbLazy";
import type { LazyTarget } from "./thumbLazy";

/** 初始化文章列表无限滚动分页；非 infinite 模式（无分页元素）时静默跳过 */
export function initArticlePagination() {
	const pagination = document.querySelector<HTMLElement>(".jj-pagination--infinite");
	const listContainer = document.querySelector<HTMLElement>(".article-card-wrap");
	if (!pagination || !listContainer) return;

	const thumbLazy = ThumbLazy.getInstance();
	new PaginationLoader({
		pagination,
		listContainer,
		itemSelector: ".article-card",
		afterAppend(items) {
			// 新插入的文章卡片补缩略图懒加载
			items.forEach((card) => {
				const img = card.querySelector("img[data-src]");
				if (img) thumbLazy.addLazyLoad(img as LazyTarget);
			});
		}
	});
}
