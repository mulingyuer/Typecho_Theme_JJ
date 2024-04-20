/*
 * @Author: mulingyuer
 * @Date: 2023-03-21 17:40:33
 * @LastEditTime: 2024-04-21 02:46:07
 * @LastEditors: mulingyuer
 * @Description: 最近评论
 * @FilePath: /Typecho_Theme_JJ/src/modules/home/recent_comments/index.ts
 * 怎么可能会有bug！！！
 */
import "./style.scss";
import { singletonFaceReplace } from "@/modules/comment/emoji/faceReplace";
import recentCommentsSkeleton from "@/modules/home/recent_comments_skeleton";

class RecentComments {
	/** 评论列表 */
	private commentList: HTMLElement | null = document.querySelector(".recent-comments-list");

	constructor() {
		//表情替换
		if (this.commentList) {
			singletonFaceReplace.start(this.commentList);
		}

		//关闭骨架
		recentCommentsSkeleton.receiveClose();
	}
}
new RecentComments();
