/*
 * @Author: mulingyuer
 * @Date: 2023-03-15 19:36:49
 * @LastEditTime: 2023-03-17 08:29:30
 * @LastEditors: mulingyuer
 * @Description: header模块
 * @FilePath: \Typecho_Theme_JJ\src\modules\header\header.ts
 * 怎么可能会有bug！！！
 */
import "./header.scss";
import { useDataStore } from "@/store/data";
import { watch } from "vue";
import SearchHistory from "./searchHistory";
import { lockBodyScroll, unlockBodyScroll } from "@/utils/rollingLock";

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
  private searchForm: HTMLFormElement; //表单
  private searchInput: HTMLInputElement; //输入框
  private searchBtn: HTMLElement; //搜索按钮
  private searchHistory: SearchHistory; //搜索历史
  private blurTimer: NodeJS.Timeout | null = null; //延时器

  constructor() {
    this.searchWrap = document.querySelector(".header-search-wrap") as HTMLElement;
    this.searchForm = document.querySelector(".header-search-form") as HTMLFormElement;
    this.searchInput = document.querySelector(".header-search-input") as HTMLInputElement;
    this.searchBtn = document.querySelector(".header-search-btn") as HTMLElement;
    this.searchHistory = new SearchHistory({
      wrapClass: ".search-history",
      listClass: ".search-history-list",
      clearBtnClass: ".search-history-clear-btn",
      closeBlacklist: [this.searchWrap, document.querySelector(".mobile-search") as HTMLElement],
      onListClick: this.onListClick.bind(this),
    });

    this.inputClick = this.inputClick.bind(this);
    this.inputBlur = this.inputBlur.bind(this);

    //绑定事件
    this.searchInput.addEventListener("click", this.inputClick);
    this.searchInput.addEventListener("blur", this.inputBlur);
    //阻止回车按下时提交表单
    this.searchForm.addEventListener("keydown", (event) => {
      if (event.key.toLocaleLowerCase() === "enter") {
        event.preventDefault();
      }
    });
    //回车回位时触发搜索
    this.searchForm.addEventListener("keyup", (event) => {
      if (event.key.toLocaleLowerCase() === "enter") {
        this.onSubmit();
      }
    });
    //搜索按钮点击事件
    this.searchBtn.addEventListener("click", () => {
      if (this.blurTimer) {
        clearTimeout(this.blurTimer);
        this.blurTimer = null;
      }
      this.onSubmit();
    });
  }

  /** input点击事件 */
  private inputClick() {
    //如果开启了移动端搜索,则不处理open展开
    if (!dataStore.getEnableMobileSearch) {
      this.searchWrap.classList.add("open-search");
    }
    this.searchHistory.show();
  }

  /** input 离开事件 */
  private inputBlur() {
    //如果开启了移动端搜索,则不处理open展开
    if (dataStore.getEnableMobileSearch) return;
    this.blurTimer = setTimeout(() => {
      this.searchWrap.classList.remove("open-search");
    }, 200);
  }

  /** 历史记录点击回调 */
  private onListClick(val: string) {
    this.searchInput.setAttribute("value", val);
    this.searchHistory.hide();
    this.searchForm.submit();
  }

  /** 表单提交事件 */
  private onSubmit() {
    const value = this.searchInput.value;
    if (value.trim() === "") return; //空值不提交
    this.searchHistory.addHistory(value);
    this.searchForm.submit();
  }
}
new HeaderSearch();

// mobile-search
class MobileSearch {
  private wrap: HTMLElement; //父级容器
  private searchContent: HTMLElement; //搜索存放容器
  private mask: HTMLElement; //遮罩层
  private closeBtn: HTMLElement; //关闭按钮
  private searchFromWrap: HTMLElement; //表单容器
  private searchForm: HTMLFormElement; //表单
  private iconBtn: HTMLElement; //搜索按钮
  private init: boolean = false; //是否初始化

  constructor() {
    this.wrap = document.querySelector(".mobile-search") as HTMLElement;
    this.searchContent = document.querySelector(".mobile-search-body") as HTMLElement;
    this.mask = document.querySelector(".mobile-search-mask") as HTMLElement;
    this.closeBtn = document.querySelector(".mobile-search-close") as HTMLElement;
    this.searchFromWrap = document.querySelector(".header-search-wrap") as HTMLElement;
    this.searchForm = document.querySelector(".header-search-form") as HTMLFormElement;
    this.iconBtn = document.querySelector(".header-search-icon") as HTMLElement;

    //绑定事件
    this.iconBtn.addEventListener("click", this.onIconClick.bind(this));
    this.onClickClose = this.onClickClose.bind(this);
    this.mask.addEventListener("click", this.onClickClose);
    this.closeBtn.addEventListener("click", this.onClickClose);

    //监听
    watch(() => dataStore.getWindowWidth, this.onResize.bind(this));
  }

  /** 搜索按钮点击事件 */
  private onIconClick() {
    //初始化
    if (!this.init) {
      this.init = true;
      dataStore.setEnableMobileSearch(true);
      this.searchContent.appendChild(this.searchForm);
      this.searchForm.style.display = "block";
    }
    lockBodyScroll();
    this.wrap.style.display = "block";
    getComputedStyle(this.wrap).display;
    this.wrap.classList.add("visible");
  }

  /** 关闭 */
  private onClickClose() {
    this.wrap.addEventListener(
      "transitionend",
      () => {
        this.wrap.style.display = "none";
      },
      { once: true }
    );
    this.wrap.classList.remove("visible");
    unlockBodyScroll();
  }

  /** 监听窗口变化，在宽度足够的情况下还原搜索 */
  private onResize(width: number) {
    if (!dataStore.getEnableMobileSearch) return;
    if (width > 960) {
      this.init = false;
      dataStore.setEnableMobileSearch(false);
      //前头插入
      this.searchForm.style.display = "";
      this.searchFromWrap.insertBefore(this.searchForm, this.searchFromWrap.firstChild);
    }
  }
}
new MobileSearch();
