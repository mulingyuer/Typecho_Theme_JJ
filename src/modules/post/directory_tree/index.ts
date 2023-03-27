/*
 * @Author: mulingyuer
 * @Date: 2023-03-23 19:58:22
 * @LastEditTime: 2023-03-26 09:40:25
 * @LastEditors: mulingyuer
 * @Description: 目录树
 * @FilePath: \Typecho_Theme_JJ\src\modules\post\directory_tree\index.ts
 * 怎么可能会有bug！！！
 */
import "./style.scss";
import emitter, { MittEventName } from "@/utils/mittEvent";
import { throttle } from "@/utils/tool";

class DirectoryTree {
  /** 目录树容器 */
  private wrap = document.querySelector(".directory-tree");
  /** list滚动容器 */
  private listWrap = document.querySelector(".directory-tree-body");
  /** 目录列表 */
  private list = document.querySelector(".directory-tree-list");
  /** 当前选中的item元素 */
  private activeItem: HTMLElement | null = null;
  /** 当前页面的title元素数组 */
  private titles: Array<HTMLElement> = [];
  /** 事件代理点击不触发scroll处理 */
  private clickTimer: NodeJS.Timeout | null = null;

  constructor() {
    emitter.on(MittEventName.HEADER_SHOW, this.listenHeaderShow);

    // 事件代理
    this.list?.addEventListener("click", this.onClickProxy);

    //获取标题元素
    this.titles = Array.from(document.querySelectorAll(".markdown-body h1,.markdown-body h2,.markdown-body h3,.markdown-body h4,.markdown-body h5,.markdown-body h6"));
    //监听滚动事件
    this.onScroll = throttle(this.onScroll, 80);
    window.addEventListener("scroll", this.onScroll);
    this.onScroll();
  }

  /** 监听header的显示隐藏 */
  private listenHeaderShow = (status: boolean) => {
    if (status) {
      this.wrap?.classList.add("heighten");
    } else {
      this.wrap?.classList.remove("heighten");
    }
  };

  /** 事件代理 */
  private onClickProxy = (event: Event) => {
    const target = event.target;
    const isA = this.isAnchor(target);
    if (!isA) return;
    if (this.clickTimer) {
      clearTimeout(this.clickTimer);
      this.clickTimer = null;
    }
    this.clickTimer = setTimeout(() => {
      this.clickTimer = null;
    }, 200);
    this.anchorParentActive(target);
  };

  /** 设置a元素的父级item选中 */
  private anchorParentActive(a: HTMLAnchorElement) {
    //获取父级元素
    const parent = this.getParentByClassName(a, "directory-tree-list-item");
    if (!parent) return;
    if (this.activeItem) {
      this.activeItem.classList.remove("active");
    }
    this.activeItem = parent;
    this.activeItem.classList.add("active");
    const scrollTop = this.activeItem.offsetTop;
    this.listWrap?.scrollTo(0, scrollTop);
  }

  /** 滚动事件 */
  private onScroll = () => {
    if (this.clickTimer) return;
    let lastShowTitle: HTMLElement | null = null;
    for (let i = 0, len = this.titles.length; i < len; i++) {
      const title = this.titles[i];
      const rect = title.getBoundingClientRect();
      if (rect.top >= 0) {
        lastShowTitle = title;
        break;
      }
    }
    if (!lastShowTitle) return;
    //找到id对应的a元素
    const id = lastShowTitle.getAttribute("id");
    if (!id) return;
    const a = document.querySelector(`.directory-tree-list-item-link[href="#${id}"]`);
    if (!a || !this.isAnchor(a)) return;
    this.anchorParentActive(a);
  };

  /** 是否是a元素 */
  private isAnchor = (target: EventTarget | null): target is HTMLAnchorElement => {
    return target instanceof HTMLAnchorElement;
  };

  /** 获取第一个指定class的祖先元素 */
  private getParentByClassName(target: HTMLElement, className: string) {
    let parent = target.parentElement;
    while (parent) {
      if (parent.classList.contains(className)) return parent;
      parent = parent.parentElement;
    }
    return null;
  }
}

new DirectoryTree();
