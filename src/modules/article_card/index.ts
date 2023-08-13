/*
 * @Author: mulingyuer
 * @Date: 2023-03-19 17:59:36
 * @LastEditTime: 2023-08-13 11:29:30
 * @LastEditors: mulingyuer
 * @Description: 文章卡片
 * @FilePath: /Typecho_Theme_JJ/src/modules/article_card/index.ts
 * 怎么可能会有bug！！！
 */
import "./style.scss";
import toast from "@/utils/toast";
import ThumbLazy from "./thumbLazy";
import type { LazyTarget } from "./thumbLazy";

class ArticleCard {
	/** 父级容器 */
	private articleWrap = document.querySelector(".article-card-wrap");
	/** 评论按钮类名 */
	private commentBtnClass = "comments";
	/** 文章卡片类名 */
	private articleCardClass = "article-card";
	/** 图片懒加载实例 */
	private thumbLazy = ThumbLazy.getInstance();
	/** 黑名单className */
	private blackClassList = ["article-card-tag"];

	constructor() {
		if (this.articleWrap) {
			this.articleWrap.addEventListener("click", this.wrapEvent.bind(this));
			//图片懒加载
			const imgs: LazyTarget = Array.from(this.articleWrap.querySelectorAll("img[data-src]"));
			this.thumbLazy.addLazyLoad(imgs);
		}
	}

	/** 事件代理 */
	private wrapEvent(event: Event) {
		const target = event.target as HTMLElement;
		//如果点击的元素是黑名单className则不执行
		const isBlack = this.hasBlackClass(target);
		if (isBlack) return;
		const hasCommentBtn = this.hasClassName(target, this.commentBtnClass);
		if (hasCommentBtn) return;
		const articleCard = this.getClassNameElement(target, this.articleCardClass);
		if (!articleCard) {
			return toast.warning({ text: "未找到文章卡片" });
		}
		const link = articleCard.dataset.link;
		if (typeof link === "string" && link.trim() !== "") {
			location.href = link;
		} else {
			toast.warning({ text: "未找到卡片的文章链接" });
		}
	}

	/** 冒泡查询自身或者父级是否存在指定的类名 */
	private hasClassName(target: HTMLElement, className: string): boolean {
		if (target.classList.contains(className)) return true;
		const parent = target.parentElement;
		if (!parent) return false;
		return this.hasClassName(parent, className);
	}

	/** 冒泡获取自身或者父级指定的类名元素 */
	private getClassNameElement(target: HTMLElement, className: string): HTMLElement | null {
		if (target.classList.contains(className)) return target;
		const parent = target.parentElement;
		if (!parent) return null;
		return this.getClassNameElement(parent, className);
	}

	/** 元素class是否存在黑名单中 */
	private hasBlackClass(target: HTMLElement): boolean {
		const findIndex = Array.from(target.classList).findIndex((item) => this.blackClassList.includes(item));
		return findIndex !== -1;
	}
}

new ArticleCard();
