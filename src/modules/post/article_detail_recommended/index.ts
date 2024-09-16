/*
 * @Author: mulingyuer
 * @Date: 2024-09-16 15:43:24
 * @LastEditTime: 2024-09-16 16:06:36
 * @LastEditors: mulingyuer
 * @Description: 文章右侧推荐文章
 * @FilePath: /Typecho_Theme_JJ/src/modules/post/article_detail_recommended/index.ts
 * 怎么可能会有bug！！！
 */
import "./style.scss";
import ThumbLazy from "@/modules/article_card/thumbLazy";
import type { LazyTarget } from "@/modules/article_card/thumbLazy";

class ArticleDetailRecommended {
	/** 父级容器 */
	private parent = document.querySelector(".article-detail-recommended");
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
new ArticleDetailRecommended();
