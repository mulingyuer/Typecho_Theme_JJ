/*
 * @Author: mulingyuer
 * @Date: 2026-10-08 00:30:39
 * @LastEditTime: 2026-10-10 21:53:10
 * @LastEditors: mulingyuer
 * @Description: 通用分页加载器
 * @FilePath: \Typecho_Theme_JJ\src\modules\pagination\index.ts
 * 怎么可能会有bug！！！
 */
import "./style.scss";
import { Observer } from "@/utils/observer";
import { request, NoMoreError, exponentialDelay } from "@/request";
import type { PaginationLoaderOptions } from "./types";

export type { PaginationLoaderOptions };

export class PaginationLoader {
  /** 分页根元素 */
  private pagination: HTMLElement;
  /** 列表容器 */
  private listContainer: HTMLElement;
  /** 列表项选择器 */
  private itemSelector: string;
  /** 请求函数 */
  private fetcher: (url: string) => Promise<string>;
  /** 追加后钩子 */
  private afterAppend?: (items: HTMLElement[]) => void;
  /** 监听器 */
  private observer: Observer;
  /** 是否正在加载下一页 */
  private isLoading = false;
  /** 是否没有了 */
  private isEnd = false;

  constructor(options: PaginationLoaderOptions) {
    this.pagination = options.pagination;
    this.listContainer = options.listContainer;
    this.itemSelector = options.itemSelector;
    this.fetcher = options.fetcher ?? PaginationLoader.defaultFetcher;
    this.afterAppend = options.afterAppend;
    this.observer = new Observer(
      options.observerOptions ?? { rootMargin: "0px 0px 100px 0px" },
    );

    // 首屏已无更多，直接标记结束
    if (this.pagination.classList.contains("no-more")) {
      this.isEnd = true;
      return;
    }
    // 监听分页是否出现在视口
    this.observer.observe(this.pagination, this.observerCallback, this);
  }

  /** 默认请求：幂等 GET，开重试 */
  private static defaultFetcher(url: string): Promise<string> {
    return request<string>({
      url,
      "axios-retry": {
        retries: 2,
        retryDelay: exponentialDelay,
      },
    });
  }

  /** observer回调 */
  private observerCallback = (entry: IntersectionObserverEntry) => {
    if (entry.isIntersecting && !this.isLoading && !this.isEnd) {
      this.isLoading = true;
      this.loadNextPage();
    }
  };

  /** 加载下一页数据 */
  private loadNextPage() {
    const url = this.getNextPageUrl();
    if (typeof url === "string" && url.trim() !== "") {
      this.fetcher(url)
        .then((res) => {
          this.renderHtml(res);
        })
        .catch((err) => {
          this.isLoading = false;
          if (err instanceof NoMoreError) {
            this.isEnd = true;
            this.pagination.classList.add("no-more");
            return;
          }
          console.error("加载下一页失败", err);
        });
    } else {
      // 没有下一页了
      this.isEnd = true;
      this.isLoading = false;
      this.pagination.classList.add("no-more");
    }
  }

  /** 获取下一页的链接 */
  private getNextPageUrl() {
    const next = this.pagination.querySelector("a.next");
    return next?.getAttribute("href");
  }

  /** 渲染返回的html到页面上 */
  private renderHtml(html: string) {
    let div = document.createElement("div");
    div.innerHTML = html;
    const items = Array.from(
      div.querySelectorAll<HTMLElement>(this.itemSelector),
    );
    items.forEach((item) => {
      this.listContainer.appendChild(item);
    });
    // 追加后钩子：图片懒加载、表情替换等
    if (items.length > 0 && this.afterAppend) {
      this.afterAppend(items);
    }
    // 更新分页（从返回的整页 HTML 中提取新的分页区）
    const paginationContent = div.querySelector(".jj-pagination");
    if (paginationContent) {
      this.pagination.innerHTML = paginationContent.innerHTML;
      this.pagination.className = paginationContent.className;
      // 若新分页已标记 no-more，同步结束状态
      if (paginationContent.classList.contains("no-more")) {
        this.isEnd = true;
      }
    }
    this.isLoading = false;
    // @ts-ignore
    div = null; // 手动垃圾回收
  }
}

export default PaginationLoader;
