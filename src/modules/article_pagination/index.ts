/*
 * @Author: mulingyuer
 * @Date: 2023-03-20 16:31:55
 * @LastEditTime: 2023-05-20 16:12:37
 * @LastEditors: mulingyuer
 * @Description: 文章分页
 * @FilePath: \Typecho_Theme_JJ\src\modules\article_pagination\index.ts
 * 怎么可能会有bug！！！
 */
import "./style.scss";
import { Observer } from "@/utils/observer";
import { getArticleList } from "@/api/article";
import ThumbLazy from "@/modules/article_card/thumbLazy";
import type { LazyTarget } from "@/modules/article_card/thumbLazy";

//利用配置提前100px触发
const observerOptions: IntersectionObserverInit = {
	rootMargin: "0px 0px 100px 0px"
};

class ArticlePagination {
	private pagination = document.querySelector(".article-pagination"); //分页元素
	private observer = new Observer(observerOptions); //监听器
	/** 文章容器 */
	private articleWrap = document.querySelector(".article-card-wrap");
	/** 是否正在加载下一页 */
	private isLoading = false;
	/** 是否没有了 */
	private isEnd = false;
	/** 图片懒加载 */
	private thumbLazy = ThumbLazy.getInstance();

	constructor() {
		if (!this.pagination) return;
		//监听分页是否出现在视口
		this.observer.observe(this.pagination, this.observerCallback, this);
	}

	/** observer回调 */
	private observerCallback = (entry: IntersectionObserverEntry) => {
		//出现在视口
		if (entry.isIntersecting && !this.isLoading && !this.isEnd) {
			this.isLoading = true;
			this.loadNextPage();
		}
	};

	/** 加载下一页数据 */
	private loadNextPage() {
		const url = this.getNextPageUrl();
		if (typeof url === "string" && url.trim() !== "") {
			getArticleList(url)
				.then((res) => {
					this.renderHtml(res);
				})
				.catch((err) => {
					if (err.name === "noMore") {
						this.isEnd = true;
						this.isLoading = false;
						this.pagination?.classList.add("no-more");
						return;
					}
					console.error("加载下一页失败", err.name);
				});
		} else {
			//没有下一页了
			this.isEnd = true;
			this.isLoading = false;
			this.pagination?.classList.add("no-more");
		}
	}

	/** 获取下一页的链接 */
	private getNextPageUrl() {
		const next = this.pagination?.querySelector("a.next");
		return next?.getAttribute("href");
	}

	/** 渲染返回的html到页面上 */
	private renderHtml(html: string) {
		let div = document.createElement("div");
		div.innerHTML = html;
		const articleCards = Array.from(div.querySelectorAll(".article-card"));
		articleCards.forEach((card) => {
			this.articleWrap?.appendChild(card);
			//图片懒加载
			const img = card.querySelector("img[data-src]");
			if (img) this.thumbLazy.addLazyLoad(img as LazyTarget);
		});
		//更新分页
		const paginationContent = div.querySelector(".article-pagination");
		if (paginationContent && this.pagination) {
			this.pagination.innerHTML = paginationContent.innerHTML;
		}
		this.isLoading = false;
		// @ts-ignore
		div = null; //手动垃圾回收
	}
}
new ArticlePagination();
