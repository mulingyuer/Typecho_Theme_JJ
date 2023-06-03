/*
 * @Author: mulingyuer
 * @Date: 2023-03-23 05:18:31
 * @LastEditTime: 2023-03-24 17:16:36
 * @LastEditors: mulingyuer
 * @Description: 相关文章
 * @FilePath: \Typecho_Theme_JJ\src\modules\post\articles_related\index.ts
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

	constructor() {
		this.list && this.list.addEventListener("click", this.eventProxy);
	}

	/** 事件代理 */
	private eventProxy = (event: Event) => {
		const target = event.target as HTMLElement;
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
}
new ArticlesRelated();
