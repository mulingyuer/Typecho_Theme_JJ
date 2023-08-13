/*
 * @Author: mulingyuer
 * @Date: 2023-03-23 05:18:31
 * @LastEditTime: 2023-08-13 13:04:30
 * @LastEditors: mulingyuer
 * @Description: 相关文章
 * @FilePath: /Typecho_Theme_JJ/src/modules/post/articles_related/index.ts
 * 怎么可能会有bug！！！
 */
import "./style.scss";
import toast from "@/utils/toast";

class ArticlesRelated {
	/** 列表容器 */
	private list: HTMLElement | null = document.querySelector(".articles-related-list");
	/** 评论按钮类名 */
	private commentBtnClass = "comments";
	/** 文章卡片类名 */
	private listItemClass = "articles-related-list-item";
	/** 黑名单className */
	private blackClassList = ["author", "comments", "articles-related-list-item-tag"];

	constructor() {
		this.list && this.list.addEventListener("click", this.eventProxy);
	}

	/** 事件代理 */
	private eventProxy = (event: Event) => {
		const target = event.target as HTMLElement;
		//如果点击的元素是黑名单className则不执行
		const isBlack = this.hasBlackClass(target);
		if (isBlack) return;
		const hasCommentBtn = this.hasClassName(target, this.commentBtnClass);
		if (hasCommentBtn) return;
		const articleCard = this.getClassNameElement(target, this.listItemClass);
		if (!articleCard) {
			return toast.warning({ text: "未找到文章卡片" });
		}
		const link = articleCard.dataset.link;
		if (typeof link === "string" && link.trim() !== "") {
			location.href = link;
		} else {
			toast.warning({ text: "未找到卡片的文章链接" });
		}
	};

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
new ArticlesRelated();
