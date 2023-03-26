/*
 * @Author: mulingyuer
 * @Date: 2023-03-25 22:25:07
 * @LastEditTime: 2023-03-27 01:35:27
 * @LastEditors: mulingyuer
 * @Description: 表情
 * @FilePath: \Typecho_Theme_JJ\src\modules\comment\emoji\index.ts
 * 怎么可能会有bug！！！
 */
import "./style.scss";
import { emojiData, getEmojiPrefix } from "./data";
import { computePosition, flip, shift, arrow, offset } from "@floating-ui/dom";
import FaceReplace from "./faceReplace";
import { Observer } from "@/utils/observer";

class Emoji {
  /** head容器 */
  private headWrap: HTMLElement | null = document.querySelector(".emoji-picker-head");
  /** head item数组 */
  private headItemArr: Array<HTMLElement> = [];
  /** 表情容器 */
  private emojiWrap: HTMLElement | null = document.querySelector(".emoji-picker-slide");
  /** 表情item数组 */
  private emojiItemArr: Array<HTMLElement> = [];
  /** 评论容器textarea */
  private textarea: HTMLTextAreaElement | null = document.querySelector(".comment-form-textarea");
  /** emoji-picker */
  private emojiPicker: HTMLElement | null = document.querySelector(".emoji-picker");
  /** 表情按钮 */
  private emojiBtn: HTMLElement | null = document.querySelector(".emoji-btn");
  /** 是否显示表情 */
  private isShowEmoji: boolean = false;
  /** 是否在隐藏动画中 */
  private isHideEmojiAnimation: boolean = false;
  /** 箭头 */
  private arrow: HTMLElement | null = document.querySelector(".emoji-picker-arrow");
  /** 评论列表 */
  private commentList: HTMLElement | null = document.querySelector(".comment-list");
  /** 已经懒加载处理的scroll数组 */
  private lazyLoadScrollArr: Array<HTMLElement> = [];

  constructor() {
    if (!this.headWrap || !this.emojiWrap) return;

    //容器渲染
    this.headRender(this.headWrap);
    this.emojiRender(this.emojiWrap);

    //绑定事件
    this.emojiBtn?.addEventListener("click", this.onEmojiBtnClick);
    document.addEventListener("click", this.onDocumentClick);

    //默认第一个表情scroll容器做懒加载
    const firstScrollWrap: HTMLElement | null = document.querySelector(".emoji-picker-body-item-scroll");
    if (firstScrollWrap) {
      this.initLazyLoad(firstScrollWrap);
      this.lazyLoadScrollArr.push(firstScrollWrap);
    }

    //评论列表表情替换
    if (this.commentList) {
      new FaceReplace(this.commentList).start();
    }
  }

  /** head容器渲染 */
  private headRender(headWrap: HTMLElement) {
    emojiData.forEach((item, index) => {
      let isActive = false; //是否选中
      if (index === 0) isActive = true;
      const { name, icon, text } = item;
      let itemHtml = "";
      if (icon) {
        itemHtml = `<img src="${getEmojiPrefix() + icon}" alt="${name}">`;
      } else {
        itemHtml = `<span>${text}</span>`;
      }
      const itemWrap = document.createElement("div");
      itemWrap.classList.add("emoji-picker-head-item");
      if (isActive) itemWrap.classList.add("active");
      itemWrap.dataset.index = `${index}`;
      itemWrap.innerHTML = itemHtml;
      itemWrap.addEventListener("click", this.onHeadItemClick);
      this.headItemArr.push(itemWrap);
      headWrap.appendChild(itemWrap);
    });
  }

  /** head item点击事件 */
  private onHeadItemClick = (event: Event) => {
    const target = event.currentTarget as HTMLElement;
    const index = target.dataset.index;
    if (!index) return;
    //去除选中
    this.headItemArr.forEach((item) => {
      item.classList.remove("active");
    });
    //添加选中
    this.headItemArr[Number(index)]?.classList.add("active");
    //对应的scroll容器添加懒加载
    const scrollWrap: HTMLElement | null = this.emojiItemArr[Number(index)]?.querySelector(".emoji-picker-body-item-scroll");
    if (scrollWrap && !this.lazyLoadScrollArr.includes(scrollWrap)) {
      this.initLazyLoad(scrollWrap);
      this.lazyLoadScrollArr.push(scrollWrap);
    }
    //切换表情
    const width = this.emojiItemArr[0].offsetWidth;
    if (this.emojiWrap) {
      this.emojiWrap.style.transform = `translateX(-${width * Number(index)}px)`;
    }
  };

  /** 表情渲染 */
  private emojiRender(emojiWrap: HTMLElement) {
    let html = "";
    emojiData.forEach((item) => {
      const { icon, data, className } = item;
      let itemHtml = "";
      if (icon) {
        Object.keys(data).forEach((key) => {
          const value: string = data[key as keyof typeof data];
          itemHtml += `<img src="${getEmojiPrefix()}/loading2.gif" data-src="${getEmojiPrefix() + value}" alt="${key}" data-value="${key}" title="${key}">`;
        });
      } else {
        Object.keys(data).forEach((key) => {
          const value: string = data[key as keyof typeof data];
          itemHtml += `<span data-value="${value}">${value}</span>`;
        });
      }
      html += `<div class="emoji-picker-body-item${className ? " " + className : ""}"><div class="emoji-picker-body-item-scroll">${itemHtml}</div></div>`;
    });
    emojiWrap.innerHTML = html;

    //获取到item
    this.emojiItemArr = Array.from(emojiWrap.querySelectorAll(".emoji-picker-body-item"));
    //事件代理
    emojiWrap.addEventListener("click", this.onEmojiItemClick);
  }

  /** 表情点击事件 */
  private onEmojiItemClick = (event: Event) => {
    const target = event.target as HTMLElement;
    const isImg = this.isImgElement(target);
    const isSpan = this.isSpanElement(target);
    if (!isImg && !isSpan) return;
    let value = target.dataset.value;
    if (typeof value !== "string" || value.trim() === "") return;
    if (isImg) value = `[${value}]`;
    //插入textarea
    //todo 不知道为什么插入一次内容后，textarea的selectionStart会变成0
    if (this.textarea) {
      console.log(this.textarea.selectionStart, this.textarea.selectionEnd);
      const textareaValue = this.textarea.value;
      const start = this.textarea.selectionStart;
      const end = this.textarea.selectionEnd;
      if (start === end) {
        this.textarea.value = `${textareaValue.slice(0, start)}${value}${textareaValue.slice(start)}`;
      } else {
        this.textarea.value = textareaValue.replace(textareaValue.slice(start, end), value);
      }
    }
  };

  /** 是否是图片元素 */
  private isImgElement(target: any): target is HTMLImageElement {
    return target instanceof HTMLImageElement;
  }

  /** 是否是span元素 */
  private isSpanElement(target: any): target is HTMLSpanElement {
    return target instanceof HTMLSpanElement;
  }

  /** 表情按钮点击事件 */
  private onEmojiBtnClick = () => {
    if (this.isHideEmojiAnimation) return;
    if (!this.isShowEmoji) {
      this.isShowEmoji = true;
      this.emojiBtn?.classList.add("active");
      this.showEmoji();
    } else {
      this.isShowEmoji = false;
      this.emojiBtn?.classList.remove("active");
      this.hideEmoji();
    }
  };

  /** 点击其他区域关闭表情 */
  private onDocumentClick = (event: Event) => {
    if (this.isHideEmojiAnimation || !this.isShowEmoji) return;
    const target = event.target as HTMLElement;
    if (this.emojiPicker?.contains(target)) return;
    if (this.textarea?.contains(target)) return;
    if (this.emojiBtn?.contains(target)) return;
    this.isShowEmoji = false;
    this.emojiBtn?.classList.remove("active");
    this.hideEmoji();
  };

  /** 显示表情 */
  private showEmoji() {
    if (!this.emojiPicker) return;
    this.emojiPicker.style.display = "block";
    getComputedStyle(this.emojiPicker).display;
    this.popoverUpdate(this.emojiBtn!, this.emojiPicker, this.arrow!);
    this.emojiPicker.classList.add("visible");
  }

  /** 隐藏表情 */
  private hideEmoji() {
    if (!this.emojiPicker) return;
    this.isHideEmojiAnimation = true;
    this.emojiPicker.classList.remove("visible");
    this.emojiPicker.addEventListener(
      "transitionend",
      () => {
        if (!this.emojiPicker) return;
        this.emojiPicker.style.display = "";
        this.isHideEmojiAnimation = false;
      },
      { once: true }
    );
  }

  /** 气泡菜单更新 */
  private popoverUpdate(btn: HTMLElement, childWrap: HTMLElement, arrowWrap: HTMLElement) {
    computePosition(btn, childWrap, {
      placement: "bottom-start",
      middleware: [offset(12), flip({ crossAxis: false }), shift(), arrow({ element: arrowWrap })],
    }).then(({ x, y, middlewareData, placement }) => {
      Object.assign(childWrap.style, {
        left: `${x ?? 0}px`,
        top: `${y ?? 0}px`,
      });
      //箭头
      const side = placement.split("-")[0];
      if (middlewareData.arrow) {
        arrowWrap.classList.remove("top", "bottom", "left", "right");
        arrowWrap.classList.add(side);
      }
    });
  }

  /**
   * @description: 初始化图片懒加载
   * @param {Array} scrollWrapArr 图片容器（滚动条容器）
   * @Date: 2023-03-27 01:05:57
   * @Author: mulingyuer
   */
  private initLazyLoad(scrollWrap: HTMLElement) {
    const imgArr = Array.from(scrollWrap.querySelectorAll("img[data-src]"));
    if (imgArr.length <= 0) return;
    //创建observer实例
    const observer = new Observer({
      root: scrollWrap,
    });
    imgArr.forEach((img) => {
      observer.observe(img, this.lazyLoadCallback, this);
    });
  }

  /** 图片懒加载回调 */
  private lazyLoadCallback(entry: IntersectionObserverEntry, observer: Observer) {
    const target = entry.target as HTMLImageElement;
    if (!entry.isIntersecting) return;
    const src = target.dataset.src;
    target.removeAttribute("data-src"); //拿到就删除，防止重复加载
    if (typeof src === "string" && src.trim() !== "") {
      const img = new Image();
      img.addEventListener("load", () => {
        target.src = src;
        //打入标记
        target.dataset.lazy = "true";
        //移除监听
        observer.unobserve(target, this.lazyLoadCallback, this);
      });
      img.src = src;
    }
  }
}
new Emoji();
