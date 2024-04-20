/*
 * @Author: mulingyuer
 * @Date: 2023-03-26 08:13:45
 * @LastEditTime: 2024-04-21 02:46:25
 * @LastEditors: mulingyuer
 * @Description: 通知列表
 * @FilePath: /Typecho_Theme_JJ/src/modules/notification/list/index.ts
 * 怎么可能会有bug！！！
 */
import "./style.scss";
import { singletonFaceReplace } from "@/modules/comment/emoji/faceReplace";

class NotificationList {
	/** 评论列表容器 */
	private list: HTMLElement | null = document.querySelector(".notification-list-content");

	constructor(callback: () => void) {
		if (this.list) {
			singletonFaceReplace.start(this.list);
		}
		callback();
	}
}

export default NotificationList;
