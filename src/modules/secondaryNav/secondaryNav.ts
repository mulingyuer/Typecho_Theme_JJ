/*
 * @Author: mulingyuer
 * @Date: 2023-03-19 14:30:47
 * @LastEditTime: 2023-03-19 15:47:03
 * @LastEditors: mulingyuer
 * @Description: 二级分类
 * @FilePath: \Typecho_Theme_JJ\src\modules\secondaryNav\secondaryNav.ts
 * 怎么可能会有bug！！！
 */
import "./secondaryNav.scss";

/** dom */
type Dom = HTMLElement | null;

class SecondaryNav {
  private secondaryNav: Dom = null; //二级导航
  private foldBtn: Dom = null; //折叠按钮
  private foldContent: Dom = null; //折叠内容
  private navContent: Dom = null; //展示的容器
  private isFold: boolean = true; //是否折叠

  constructor() {
    this.secondaryNav = document.querySelector(".secondary-nav");
    if (!this.secondaryNav) return;
    this.foldBtn = this.secondaryNav.querySelector(".secondary-nav-fold-btn");
    this.foldContent = this.secondaryNav.querySelector(".secondary-nav-fold");
    this.navContent = this.secondaryNav.querySelector(".secondary-nav-content");

    //添加事件
    this.foldBtn && this.foldBtn.addEventListener("click", this.onFoldBtnClick.bind(this));
  }

  /** 折叠按钮点击事件 */
  private onFoldBtnClick() {
    if (this.isFold) {
      this.unfold();
    } else {
      this.fold();
    }
  }

  /** 折叠 */
  private fold() {
    this.isFold = true;
    this.navContent && (this.navContent.style.height = "");
    this.foldBtn && this.foldBtn.classList.remove("open");
  }

  /** 展开 */
  private unfold() {
    this.isFold = false;
    //计算高度
    let height = 0;
    if (this.foldContent) {
      height = this.foldContent.offsetHeight;
    }
    this.navContent && (this.navContent.style.height = `${height}px`);
    this.foldBtn && this.foldBtn.classList.add("open");
  }
}
new SecondaryNav();
