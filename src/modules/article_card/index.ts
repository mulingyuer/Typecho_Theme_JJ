/*
 * @Author: mulingyuer
 * @Date: 2023-03-19 17:59:36
 * @LastEditTime: 2024-05-12 13:14:54
 * @LastEditors: mulingyuer
 * @Description: 文章卡片
 * @FilePath: /Typecho_Theme_JJ/src/modules/article_card/index.ts
 * 怎么可能会有bug！！！
 */
import "./style.scss";
import toast from "@/utils/toast";
import ThumbLazy from "./thumbLazy";
import type { LazyTarget } from "./thumbLazy";
import { getThemeConfig } from "@/utils/themeConfig";

class ArticleCard {
	/** 父级容器 */
	private articleWrap = document.querySelector(".article-card-wrap");
	/** 文章卡片类名 */
	private articleCardClass = ".article-card";
	/** 图片懒加载实例 */
	private thumbLazy = ThumbLazy.getInstance();
	/** 黑名单className */
	private blackClassList = ["article-card-tag", "comments", "article-card-category"];
	/** 主题配置 */
	private themeConfig = getThemeConfig();

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
		const parent = target.closest<HTMLElement>(this.articleCardClass);
		if (!parent) return;
		//如果点击的元素是黑名单className则不执行
		const isBlack = this.hasBlackClass(target, parent);
		if (isBlack) return;

		if (!parent) {
			return toast.warning({ text: "未找到文章卡片" });
		}
		const link = parent.dataset.link;
		if (typeof link === "string" && link.trim() !== "") {
			if (!this.themeConfig || this.themeConfig.paginationType === "button") {
				location.href = link;
				return;
			} else {
				window.open(link, "_blank");
			}
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
	private hasBlackClass(target: HTMLElement, parent: HTMLElement): boolean {
		// 当前target是否黑名单元素
		const isBlackTarget = Array.from(target.classList).find((className) => this.blackClassList.includes(className));
		if (isBlackTarget) return true;
		// 当前target的父级是否黑名单元素
		const blackDomList = this.blackClassList.flatMap((className) =>
			Array.from(parent.querySelectorAll<HTMLElement>(`.${className}`))
		);
		const isBlackChild = blackDomList.find((black) => black.contains(target));
		if (isBlackChild) return true;

		return false;
	}
}

new ArticleCard();
