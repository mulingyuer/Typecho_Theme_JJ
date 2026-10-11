/*
 * @Author: mulingyuer
 * @Date: 2026-10-11
 * @LastEditTime: 2026-10-11 15:06:44
 * @LastEditors: mulingyuer
 * @Description: 文章列表区模块入口（骨架屏 + 文章卡片 + 分页，时序对齐 notification 页）
 * @FilePath: \Typecho_Theme_JJ\src\modules\article-list\index.ts
 * 怎么可能会有bug！！！
 */
import { ArticleCard } from "@/modules/article-card";
import "@/modules/pagination";
import "@/modules/article-empty";
import { SkeletonController } from "@/modules/skeleton";
import { sleep } from "@/utils/tool";
import { PaginationLoader } from "@/modules/pagination";

/** 初始化分页 */
const initArticlePagination = (articleCard: ArticleCard) => {
	const pagination = document.querySelector<HTMLElement>(".jj-pagination--infinite");
	const listContainer = document.querySelector<HTMLElement>(".article-card-wrap");
	if (!pagination || !listContainer) return;

	return new PaginationLoader({
		pagination,
		listContainer,
		itemSelector: ".article-card",
		afterAppend(items) {
			// 新插入的文章卡片补缩略图懒加载
			items.forEach((card) => articleCard.lazyLoadThumbs(card));
		}
	});
};

/** 初始化文章列表区 */
export async function initArticleList() {
	// 骨架屏
	const listSkeleton = new SkeletonController({
		selector: ".article-skeleton",
		contentSelectors: [
			".article-card-wrap",
			".jj-pagination",
			".jj-pagination-button",
			".jj-pagination-button-no-more"
		],
		waitForCloseSignal: true
	});

	// 关闭骨架屏
	listSkeleton.receiveClose();

	await sleep(500);

	// 文章卡片（点击代理 + 首屏缩略图懒加载）
	const articleCard = new ArticleCard();

	// 初始化分页
	initArticlePagination(articleCard);
}
