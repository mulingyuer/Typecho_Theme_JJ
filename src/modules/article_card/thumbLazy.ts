/*
 * @Author: mulingyuer
 * @Date: 2023-03-21 01:26:37
 * @LastEditTime: 2023-03-21 01:48:51
 * @LastEditors: mulingyuer
 * @Description: 文章卡片图片懒加载
 * @FilePath: \Typecho_Theme_JJ\src\modules\articleCard\thumbLazy.ts
 * 怎么可能会有bug！！！
 */
import observer from "@/utils/observer";

/** 懒加载参数 */
export type LazyTarget = HTMLImageElement | Array<HTMLImageElement>;

class ThumbLazy {
  public static instance: ThumbLazy;
  /** 懒加载中的img Set */
  private lazyLoadSet: Set<HTMLImageElement> = new Set();

  private constructor() {}

  /** 获取实例 */
  public static getInstance() {
    if (!ThumbLazy.instance) {
      ThumbLazy.instance = new ThumbLazy();
    }
    return ThumbLazy.instance;
  }

  /** 添加一个图片懒加载 */
  public addLazyLoad(target: LazyTarget) {
    if (Array.isArray(target)) {
      target.forEach((item) => {
        observer.observe(item, this.lazyLoad, this);
      });
    } else {
      observer.observe(target, this.lazyLoad, this);
    }
  }

  /** 移除一个图片懒加载 */
  private removeLazyLoad(target: LazyTarget) {
    if (Array.isArray(target)) {
      target.forEach((item) => {
        observer.unobserve(item, this.lazyLoad, this);
      });
    } else {
      observer.unobserve(target, this.lazyLoad, this);
    }
  }

  /** 图片懒加载回调 */
  private lazyLoad = (entry: IntersectionObserverEntry) => {
    const target = entry.target as HTMLImageElement;
    if (!entry.isIntersecting && !this.isLazyLoad(target)) return;
    const src = target.dataset.src;
    if (typeof src === "string" && src.trim() !== "") {
      const img = new Image();
      img.addEventListener("load", () => {
        target.src = src;
        this.lazyLoadSet.delete(target);
        target.removeAttribute("data-src");
        //打入标记
        target.dataset.lazy = "true";
        //移除监听
        this.removeLazyLoad(target);
      });
      img.src = src;
    }
  };

  /** 是否已经在懒加载中了 */
  private isLazyLoad(target: HTMLImageElement) {
    return this.lazyLoadSet.has(target);
  }
}

export default ThumbLazy;
