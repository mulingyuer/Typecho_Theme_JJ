/*
 * @Author: mulingyuer
 * @Date: 2023-03-18 23:27:06
 * @LastEditTime: 2023-03-21 17:45:38
 * @LastEditors: mulingyuer
 * @Description: nav分类菜单
 * @FilePath: \Typecho_Theme_JJ\src\modules\nav\nav.ts
 * 怎么可能会有bug！！！
 */
import "./style.scss";
import eventMitt, { MittEventName } from "@/utils/mittEvent";
import { computePosition, flip, shift } from "@floating-ui/dom";

/** 气泡按钮 */
type PopoverBtn = HTMLElement;
/** 气泡内容 */
type PopoverChildWrap = HTMLElement;
/** 气泡dom数据 */
type PopoverDomData = Map<
  HTMLElement,
  {
    timer: NodeJS.Timeout | null;
    childWrap: HTMLElement;
  }
>;

class Nav {
  private nav: HTMLElement | null = null;
  private itemParent: Array<HTMLElement> = [];
  private navSecondaryWarp: HTMLElement | null = null;
  private scrollWrap: HTMLElement | null = null;
  private popoverDomData: PopoverDomData = new Map();

  constructor() {
    this.nav = document.querySelector(".nav");
    if (!this.nav) return;
    this.itemParent = Array.from(this.nav.querySelectorAll(".nav-list-item-parent"));
    this.navSecondaryWarp = document.querySelector(".nav-secondary-warp");
    this.scrollWrap = document.querySelector(".nav-list");

    //监听事件
    eventMitt.on(MittEventName.HEADER_SHOW, this.listenHeader.bind(this));

    //气泡菜单
    this.itemParent.forEach((parent) => {
      const btn: HTMLElement | null = parent.querySelector(".nav-list-item-parent-name");
      const childWrap: HTMLElement | null = parent.querySelector(".nav-list-secondary");
      if (!btn || !childWrap) return;
      this.popoverDomData.set(btn, {
        timer: null,
        childWrap,
      });
      //将气泡菜单放到navSecondaryWarp中
      this.navSecondaryWarp?.appendChild(childWrap);
    });

    //气泡菜单事件
    for (let [btn, domData] of this.popoverDomData.entries()) {
      //btn事件
      [
        ["mouseenter", this.onBtnShowPopover.bind(this)],
        ["mouseleave", this.onBtnHidePopover.bind(this)],
        ["focus", this.onBtnShowPopover.bind(this)],
        ["blur", this.onBtnHidePopover.bind(this)],
      ].forEach(([eventName, callback]) => {
        btn.addEventListener(eventName as keyof HTMLElementEventMap, callback as EventListener);
      });
      //childWrap事件
      [
        ["mouseenter", this.onChildWrapShowPopover.bind(this)],
        ["mouseleave", this.onChildWrapHidePopover.bind(this)],
        ["focus", this.onChildWrapShowPopover.bind(this)],
        ["blur", this.onChildWrapHidePopover.bind(this)],
      ].forEach(([eventName, callback]) => {
        domData.childWrap.addEventListener(eventName as keyof HTMLElementEventMap, callback as EventListener);
      });
    }
  }

  /** 监听header显示隐藏 */
  private listenHeader(status: boolean) {
    if (!status) {
      this.nav?.classList.add("sticky");
    } else {
      this.nav?.classList.remove("sticky");
    }
  }

  /** btn显示气泡 */
  private onBtnShowPopover(event: MouseEvent) {
    if (this.isScrollWrapScroll()) return;
    const btn = event.currentTarget as PopoverBtn;
    const domData = this.popoverDomData.get(btn);
    if (!domData) return;
    clearTimeout(domData.timer!);
    domData.timer = setTimeout(() => {
      this.showPopover(btn, domData.childWrap);
    }, 350);
  }

  /** btn隐藏气泡 */
  private onBtnHidePopover(event: MouseEvent) {
    const btn = event.currentTarget as PopoverBtn;
    const domData = this.popoverDomData.get(btn);
    if (!domData) return;
    clearTimeout(domData.timer!);
    domData.timer = setTimeout(() => {
      this.hidePopover(domData.childWrap);
    }, 350);
  }

  /** 气泡菜单更新 */
  private popoverUpdate(btn: PopoverBtn, childWrap: PopoverChildWrap) {
    computePosition(btn, childWrap, {
      placement: "bottom",
      middleware: [flip(), shift({ padding: 5 })],
    }).then(({ x, y }) => {
      Object.assign(childWrap.style, {
        left: `${x}px`,
        top: `${y}px`,
      });
    });
  }

  /** childWrap 显示气泡 */
  private onChildWrapShowPopover(event: MouseEvent) {
    const childWrap = event.currentTarget as PopoverChildWrap;
    const btn = this.findBtnByChildWrap(childWrap);
    if (!btn) return;
    const domData = this.popoverDomData.get(btn);
    if (!domData) return;
    childWrap.removeEventListener("transitionend", this.onChildWrapTransitionEnd);
    clearTimeout(domData.timer!);
    this.showPopover(btn, childWrap);
  }

  /** childWrap 隐藏气泡 */
  private onChildWrapHidePopover(event: MouseEvent) {
    const childWrap = event.currentTarget as PopoverChildWrap;
    const btn = this.findBtnByChildWrap(childWrap);
    if (!btn) return;
    const domData = this.popoverDomData.get(btn);
    if (!domData) return;
    childWrap.removeEventListener("transitionend", this.onChildWrapTransitionEnd);
    clearTimeout(domData.timer!);
    domData.timer = setTimeout(() => {
      this.hidePopover(domData.childWrap);
    }, 350);
  }

  /** 显示气泡 */
  private showPopover(btn: PopoverBtn, childWrap: PopoverChildWrap) {
    childWrap.removeEventListener("transitionend", this.onChildWrapTransitionEnd);
    childWrap.style.display = "block";
    getComputedStyle(childWrap).display;
    this.popoverUpdate(btn, childWrap);
    childWrap.classList.add("visible");
  }

  /** 隐藏气泡 */
  private hidePopover(childWrap: PopoverChildWrap) {
    childWrap.addEventListener("transitionend", this.onChildWrapTransitionEnd);
    childWrap.classList.remove("visible");
  }

  /** childWrap动画结束事件 */
  private onChildWrapTransitionEnd(event: TransitionEvent) {
    const childWrap = event.currentTarget as PopoverChildWrap;
    childWrap.style.display = "none";
  }

  /** 通过childWrap查找btn */
  private findBtnByChildWrap(childWrap: PopoverChildWrap) {
    let btn: PopoverBtn | null = null;
    for (let [key, value] of this.popoverDomData.entries()) {
      if (value.childWrap === childWrap) {
        btn = key;
        break;
      }
    }
    return btn;
  }

  /** 判断scroll容器是否出现滚动条 */
  private isScrollWrapScroll(): boolean {
    let flag = false;
    if (this.scrollWrap) {
      flag = this.scrollWrap.scrollWidth > this.scrollWrap.clientWidth;
    }
    return flag;
  }
}
new Nav();
