/*
 * @Author: mulingyuer
 * @Date: 2023-03-26 23:50:21
 * @LastEditTime: 2023-03-29 20:49:03
 * @LastEditors: mulingyuer
 * @Description: 最近评论骨架屏
 * @FilePath: \Typecho_Theme_JJ\src\modules\home\recent_comments_skeleton\index.ts
 * 怎么可能会有bug！！！
 */
import "./style.scss";
import Skeleton from "@/bin/skeleton";

class RecentCommentsSkeleton extends Skeleton {
  /** 骨架容器 */
  private list: HTMLElement | null = document.querySelector(".recent-comments-skeleton");
  /** 评论列表容器 */
  private listContent: HTMLElement | null = document.querySelector(".recent-comments-list");
  /** 是否已经接收到关闭通知 */
  private isReceiveClose: boolean = false;

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

const listSkeleton = new RecentCommentsSkeleton();

export default listSkeleton;
