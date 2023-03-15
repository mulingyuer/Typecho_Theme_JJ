/*
 * @Author: mulingyuer
 * @Date: 2023-03-15 19:36:49
 * @LastEditTime: 2023-03-16 01:40:30
 * @LastEditors: mulingyuer
 * @Description: header模块
 * @FilePath: \Typecho_Theme_JJ\src\modules\header\header.ts
 * 怎么可能会有bug！！！
 */
import "./header.scss";
import { useDataStore } from "@/store/data";
import { watch } from "vue";
import SearchHistory from "./searchHistory";

//获取数据仓库
const dataStore = useDataStore();

/** header class */
class Header {
  private headerDom: HTMLElement;
  private MAX_SCROLL_Y: number = 400; //隐藏的最大滚动距离
  private scrollStatus: boolean = true; //显示true,隐藏false

  constructor() {
    this.headerDom = document.getElementById("header") as HTMLElement;

    //监听scroll变化
    this.watchCallback = this.watchCallback.bind(this);
    watch(() => dataStore.getScrollY, this.watchCallback, { immediate: true });
  }

  /** 监听的回调函数 */
  private watchCallback(val: number, oldVal: number | undefined) {
    if (typeof oldVal === "number" && oldVal > val) {
      if (this.scrollStatus) return;
      this.headerDom.classList.remove("hidden");
      this.scrollStatus = true;
      return;
    }
    if (val >= this.MAX_SCROLL_Y && this.scrollStatus) {
      if (!this.scrollStatus) return;
      this.headerDom.classList.add("hidden");
      this.scrollStatus = false;
      return;
    }
  }
}
new Header();

/** header-nav class */
class HeaderNav {
  private mobileMenu: HTMLElement; //按钮
  private navList: HTMLElement; //菜单
  private navStatus: boolean = false; //显示true,隐藏false

  constructor() {
    this.mobileMenu = document.querySelector(".header-nav-mobile-menu") as HTMLElement;
    this.navList = document.querySelector(".header-nav-list") as HTMLElement;

    this.toggleMenu = this.toggleMenu.bind(this);
    this.clickOtherCloseMenu = this.clickOtherCloseMenu.bind(this);

    //绑定事件
    this.mobileMenu.addEventListener("click", this.toggleMenu);
    document.addEventListener("click", this.clickOtherCloseMenu);
  }

  /** 切换菜单 */
  private toggleMenu() {
    this.mobileMenu.classList.toggle("active");
    this.navList.classList.toggle("visible");
    this.navStatus = !this.navStatus;
  }

  /** 点击其他区域关闭菜单 */
  private clickOtherCloseMenu(event: MouseEvent) {
    if (!this.navStatus) return;
    const target = event.target as HTMLElement;
    if (this.mobileMenu.contains(target) || this.navList.contains(target)) return;
    this.toggleMenu();
  }
}
new HeaderNav();

//header-search class
class HeaderSearch {
  private searchWrap: HTMLElement; //父级容器
  private searchInput: HTMLElement; //输入框
  private searchHistory: SearchHistory; //搜索历史

  constructor() {
    this.searchWrap = document.querySelector(".header-search-wrap") as HTMLElement;
    this.searchInput = document.querySelector(".header-search-input") as HTMLElement;
    this.searchHistory = new SearchHistory({
      wrapClass: ".header-search-history",
      listClass: ".header-search-history-list",
      clearBtnClass: ".header-search-history-clear-btn",
    });

    this.inputClick = this.inputClick.bind(this);
    this.inputBlur = this.inputBlur.bind(this);

    //绑定事件
    this.searchInput.addEventListener("click", this.inputClick);
    this.searchInput.addEventListener("blur", this.inputBlur);
  }

  /** input点击事件 */
  private inputClick() {
    this.searchWrap.classList.add("open-search");
    this.searchHistory.show();
  }

  /** input 离开事件 */
  private inputBlur() {
    this.searchWrap.classList.remove("open-search");
    this.searchHistory.hide();
  }
}
new HeaderSearch();
