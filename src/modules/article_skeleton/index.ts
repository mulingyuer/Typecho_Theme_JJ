/*
 * @Author: mulingyuer
 * @Date: 2023-03-21 02:15:38
 * @LastEditTime: 2023-03-21 17:44:28
 * @LastEditors: mulingyuer
 * @Description: 文章骨架屏
 * @FilePath: \Typecho_Theme_JJ\src\modules\article_skeleton\index.ts
 * 怎么可能会有bug！！！
 */
import "./style.scss";
import browserPerformance from "@/utils/browserPerformance";

class ArticleSkeleton {
  /** 骨架容器 */
  private skeletonWrap = document.querySelector(".article-skeleton");
  /** 文章列表容器 */
  private articleWrap = document.querySelector(".article-card-wrap");
  /** 分页容器 */
  private pagination = document.querySelector(".article-pagination");
  /** 是否已经关闭骨架 */
  private isClose = false;
  /** 允许最大延迟 */
  private maxDelay = 1000;

  constructor() {
    //监听性能
    browserPerformance.addCallback(this.performanceCallback);
  }

  /** 监听性能 */
  private performanceCallback = (entry: PerformanceEntry) => {
    if (this.isClose) return;
    this.isClose = true;
    //如果页面加载时间小于1s则延迟一会再关闭
    if (entry.domContentLoadedEventEnd < this.maxDelay) {
      const delay = this.maxDelay - entry.domContentLoadedEventEnd;
      setTimeout(() => {
        this.close();
      }, delay);
    } else {
      this.close();
    }
    //移除监听
    browserPerformance.removeCallback(this.performanceCallback);
  };

  /** 关闭骨架 */
  private close() {
    if (this.skeletonWrap) this.skeletonWrap.classList.add("hidden");
    if (this.articleWrap) this.articleWrap.classList.remove("hidden");
    if (this.pagination) this.pagination.classList.remove("hidden");
  }
}

new ArticleSkeleton();
