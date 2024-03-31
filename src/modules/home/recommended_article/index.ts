/*
 * @Author: mulingyuer
 * @Date: 2023-12-21 21:00:27
 * @LastEditTime: 2024-04-01 04:02:52
 * @LastEditors: mulingyuer
 * @Description: 首页右侧推荐文章
 * @FilePath: /Typecho_Theme_JJ/src/modules/home/recommended_article/index.ts
 * 怎么可能会有bug！！！
 */
import "./style.scss";
import ThumbLazy from "@/modules/article_card/thumbLazy";
import type { LazyTarget } from "@/modules/article_card/thumbLazy";

class RecommendedArticle {
	/** 父级容器 */
	private parent = document.querySelector(".recommended-article");
	/** 图片懒加载实例 */
	private thumbLazy = ThumbLazy.getInstance();

	constructor() {
		if (this.parent) {
			//图片懒加载
			const imgs: LazyTarget = Array.from(this.parent.querySelectorAll("img[data-src]"));
			this.thumbLazy.addLazyLoad(imgs);
		}
	}
}
new RecommendedArticle();
