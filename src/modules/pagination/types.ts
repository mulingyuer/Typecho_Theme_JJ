/*
 * @Author: mulingyuer
 * @Date: 2026-10-08 00:30:40
 * @LastEditTime: 2026-10-10 21:52:53
 * @LastEditors: mulingyuer
 * @Description: 通用分页加载器类型
 * @FilePath: \Typecho_Theme_JJ\src\modules\pagination\types.ts
 * 怎么可能会有bug！！！
 */

export interface PaginationLoaderOptions {
  /** 分页根元素（.jj-pagination--infinite） */
  pagination: HTMLElement;
  /** 列表容器：新加载的列表项 append 到这里 */
  listContainer: HTMLElement;
  /** 返回的 HTML 片段中列表项的选择器，如 ".article-card" / ".notification-list-item" */
  itemSelector: string;
  /** 请求下一页的函数，默认走 request 封装（GET + 重试） */
  fetcher?: (url: string) => Promise<string>;
  /** 新插入节点后的钩子：图片懒加载、表情替换等 */
  afterAppend?: (items: HTMLElement[]) => void;
  /** IntersectionObserver 配置，默认 rootMargin 100px（提前触发） */
  observerOptions?: IntersectionObserverInit;
}
