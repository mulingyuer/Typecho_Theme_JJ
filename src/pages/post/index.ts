/*
 * @Author: mulingyuer
 * @Date: 2022-12-18 23:34:05
 * @LastEditTime: 2023-11-19 19:12:02
 * @LastEditors: mulingyuer
 * @Description: post
 * @FilePath: /Typecho_Theme_JJ/src/pages/post/index.ts
 * 怎么可能会有bug！！！
 */
import "./style.scss";
import "@/modules/article_content";
import "@/modules/article_relevant_info";
import "@/modules/copyright";
import "@/modules/article_author";
import "@/modules/post/latest_posts";
import "@/modules/post/directory_tree";
import "@/modules/comment";
import "@/modules/post/articles_related";
import "@/modules/article_tool";
import "@/modules/post/next_article";
import "@/modules/post/mobile_directory_tree";
import emitter, { MittEventName } from "@/utils/mittEvent";

class PostRightSticky {
	/** 容器 */
	private wrap = document.querySelector(".post-right-sticky");

	constructor() {
		emitter.on(MittEventName.HEADER_SHOW, this.listenHeaderShow);
	}

	/** 监听header的显示隐藏 */
	private listenHeaderShow = (status: boolean) => {
		if (status) {
			this.wrap?.classList.add("heighten");
		} else {
			this.wrap?.classList.remove("heighten");
		}
	};
}

new PostRightSticky();
