/*
 * @Author: mulingyuer
 * @Date: 2023-03-26 23:50:21
 * @LastEditTime: 2023-03-27 00:06:03
 * @LastEditors: mulingyuer
 * @Description: 最近评论骨架屏
 * @FilePath: \Typecho_Theme_JJ\src\modules\home\recent_comments_skeleton\index.ts
 * 怎么可能会有bug！！！
 */
import "./style.scss";
import browserPerformance from "@/utils/browserPerformance";

class RecentCommentsSkeleton {
  /** 骨架容器 */
  private list: HTMLElement | null = document.querySelector(".recent-comments-skeleton");
  /** 评论列表容器 */
  private listContent: HTMLElement | null = document.querySelector(".recent-comments-list");
  /** 性能订阅返回的内容 */
  private entryData: PerformanceEntry | null = null;
  /** 允许最大延迟 */
  private maxDelay = 1000;
  /** 外部是否已经通知可以关闭骨架了 */
  private isReceiveClose = false;

  constructor() {
    browserPerformance.addCallback(this.performanceCallback);
  }

  /** 性能订阅回调 */
  private performanceCallback = (entry: PerformanceEntry) => {
    this.entryData = entry;
    if (this.isReceiveClose) {
      return this.close();
    }
    if (entry.domContentLoadedEventEnd < this.maxDelay) {
      const delay = this.maxDelay - entry.domContentLoadedEventEnd;
      setTimeout(() => {
        this.close();
      }, delay);
    } else {
      this.close();
    }

    browserPerformance.removeCallback(this.performanceCallback);
  };

  /** 接收外部通知关闭骨架 */
  public receiveClose() {
    this.isReceiveClose = true;
    if (this.entryData) {
      this.close();
    }
  }

  /** 关闭骨架 */
  private close() {
    this.list?.classList.add("hidden");
    this.listContent?.classList.remove("hidden");
  }
}

const listSkeleton = new RecentCommentsSkeleton();

export default listSkeleton;
