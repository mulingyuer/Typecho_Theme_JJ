/*
 * @Author: mulingyuer
 * @Date: 2023-03-21 02:15:38
 * @LastEditTime: 2023-09-29 21:16:35
 * @LastEditors: mulingyuer
 * @Description: 文章骨架屏
 * @FilePath: /Typecho_Theme_JJ/src/modules/article_skeleton/index.ts
 * 怎么可能会有bug！！！
 */
import "./style.scss";
import Skeleton from "@/bin/skeleton";

class ArticleSkeleton extends Skeleton {
	/** 骨架容器 */
	private skeletonWrap = document.querySelector(".article-skeleton");
	/** 文章列表容器 */
	private articleWrap = document.querySelector(".article-card-wrap");
	/** 分页容器 */
	private pagination = document.querySelector(".article-pagination");
	/** 按钮分页容器 */
	private paginationButton = document.querySelector(".pagination-button");
	/** 按钮分页没有更多容器 */
	private paginationButtonNoMore = document.querySelector(".pagination-button-no-more");

	/** 关闭骨架 */
	close() {
		if (this.skeletonWrap) this.skeletonWrap.classList.add("hidden");
		if (this.articleWrap) this.articleWrap.classList.remove("hidden");
		if (this.pagination) this.pagination.classList.remove("hidden");
		if (this.paginationButton) this.paginationButton.classList.remove("hidden");
		if (this.paginationButtonNoMore) this.paginationButtonNoMore.classList.remove("hidden");
	}
}

new ArticleSkeleton();
