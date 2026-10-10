/*
 * @Author: mulingyuer
 * @Date: 2023-03-21 17:40:33
 * @LastEditTime: 2024-04-21 02:46:07
 * @LastEditors: mulingyuer
 * @Description: 最近评论
 * @FilePath: /Typecho_Theme_JJ/src/modules/home/recent-comments/index.ts
 * 怎么可能会有bug！！！
 */
import "./style.scss";
import { SkeletonController } from "@/modules/skeleton";
import { singletonFaceReplace } from "@/modules/comment/emoji/faceReplace";

class RecentComments {
	/** 评论列表 */
	private commentList: HTMLElement | null = document.querySelector(".recent-comments-list");
	/** 骨架控制器 */
	private skeleton = new SkeletonController({
		selector: ".recent-comments-skeleton",
		contentSelectors: [".recent-comments-list"],
		waitForCloseSignal: true
	});

	constructor() {
		//表情替换
		if (this.commentList) {
			singletonFaceReplace.start(this.commentList);
		}

		//关闭骨架
		this.skeleton.receiveClose();
	}
}
new RecentComments();
