/*
 * @Author: mulingyuer
 * @Date: 2023-03-19 17:59:36
 * @LastEditTime: 2026-10-11 13:04:50
 * @LastEditors: mulingyuer
 * @Description: 文章卡片
 * @FilePath: \Typecho_Theme_JJ\src\modules\article-card\index.ts
 * 怎么可能会有bug！！！
 */
import "./style.scss";
import { ElMessage } from "element-plus";
import ThumbLazy from "./thumbLazy";
import type { LazyTarget } from "./thumbLazy";
import { getThemeConfig } from "@/utils/themeConfig";

export class ArticleCard {
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
			//首屏图片懒加载
			this.lazyLoadThumbs(this.articleWrap);
		}
	}

	/** 对指定范围内的缩略图补充懒加载（首屏 / 分页追加共用） */
	public lazyLoadThumbs(scope: ParentNode) {
		const imgs: LazyTarget = Array.from(scope.querySelectorAll("img[data-src]"));
		if (imgs.length > 0) this.thumbLazy.addLazyLoad(imgs);
	}

	/** 事件代理 */
	private wrapEvent(event: Event) {
		const target = event.target as HTMLElement;
		const parent = target.closest<HTMLElement>(this.articleCardClass);
		if (!parent) return;
		//如果点击的元素是黑名单className则不执行
		const isBlack = this.hasBlackClass(target, parent);
		if (isBlack) return;

		const link = parent.dataset.link;
		if (typeof link === "string" && link.trim() !== "") {
			if (!this.themeConfig || this.themeConfig.paginationType === "button") {
				location.href = link;
				return;
			} else {
				window.open(link, "_blank");
			}
		} else {
			ElMessage.warning({ message: "未找到卡片的文章链接", plain: true });
		}
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
