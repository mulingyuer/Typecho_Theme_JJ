/*
 * @Author: mulingyuer
 * @Date: 2023-03-26 09:06:37
 * @LastEditTime: 2023-03-26 09:21:17
 * @LastEditors: mulingyuer
 * @Description: 通知列表骨架
 * @FilePath: \Typecho_Theme_JJ\src\modules\notification\list_skeleton\index.ts
 * 怎么可能会有bug！！！
 */
import "./style.scss";

class ListSkeleton {
  /** 骨架容器 */
  private list: HTMLElement | null = document.querySelector(".list-skeleton");
  /** 评论列表容器 */
  private listContent: HTMLElement | null = document.querySelector(".notification-list-content");

  constructor() {
    this.list?.classList.add("hidden");
    this.listContent?.classList.remove("hidden");
  }
}

export default ListSkeleton;
