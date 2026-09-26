/*
 * @Author: mulingyuer
 * @Date: 2023-03-26 09:06:37
 * @LastEditTime: 2023-03-29 20:53:19
 * @LastEditors: mulingyuer
 * @Description: 通知列表骨架
 * @FilePath: \Typecho_Theme_JJ\src\modules\notification\list_skeleton\index.ts
 * 怎么可能会有bug！！！
 */
import "./style.scss";
import Skeleton from "@/bin/skeleton";

class ListSkeleton extends Skeleton {
	/** 骨架容器 */
	private list: HTMLElement | null = document.querySelector(".list-skeleton");
	/** 评论列表容器 */
	private listContent: HTMLElement | null = document.querySelector(".notification-list-content");
	/** 外部是否已经通知可以关闭骨架了 */
	private isReceiveClose = false;

	/** 接收外部通知关闭骨架 */
	public receiveClose() {
		this.isReceiveClose = true;
		if (this.isClose) {
			this.close();
		}
	}

	/** 关闭骨架 */
	close() {
		if (!this.isReceiveClose) return;
		this.list?.classList.add("hidden");
		this.listContent?.classList.remove("hidden");
	}
}

const listSkeleton = new ListSkeleton();

export default listSkeleton;
