/*
 * @Author: mulingyuer
 * @Date: 2022-07-17 15:59:49
 * @LastEditTime: 2022-07-18 00:42:14
 * @LastEditors: mulingyuer
 * @Description: header
 * @FilePath: \Typecho_Theme_JJ\src\components\header.ts
 * 怎么可能会有bug！！！
 */
import SearchStorage from "@packages/search/storage";

/* 移动端菜单 */
const mobileMenu = document.querySelector(".header-mobile-menu");
const mobileNav = document.querySelector(".header-mobile-nav");

/**
 * @description: 菜单全局关闭
 * @param {Event} event
 * @Date: 2022-07-17 16:22:20
 * @Author: mulingyuer
 */
function mobileMenuGlobalClose(event: Event) {
  if (!mobileMenu || !mobileNav) {
    return console.warn(`缺失参数：mobileMenu、mobileNav`);
  }
  if (!mobileMenu.contains(event.target as Node) && !mobileNav.contains(event.target as Node)) {
    mobileMenu.classList.remove("active");
    mobileNav.classList.remove("show");
  }
}

//显示菜单
if (mobileMenu && mobileNav) {
  mobileMenu.addEventListener("click", function () {
    if (!mobileMenu.classList.contains("active")) {
      mobileMenu.classList.add("active");
      mobileNav.classList.add("show");
      setTimeout(() => {
        document.documentElement.addEventListener("click", mobileMenuGlobalClose, { once: true });
      }, 200);
    } else {
      mobileMenu.classList.remove("active");
      mobileNav.classList.remove("show");
      document.documentElement.removeEventListener("click", mobileMenuGlobalClose);
    }
  });
}

//搜索记录
const searchStorage = new SearchStorage({
  maxLength: 6,
  storageKey: "searchRecord",
});
const searchForm: HTMLFormElement | null = document.querySelector(".header-search-form");
const searchInput: HTMLInputElement | null = document.querySelector(`.header-search-input-wrap input[type="search"]`);
const searchHistory = document.querySelector(".header-search-history");
const searchClear = document.querySelector(".header-search-history-clear");
const searchHistoryBody = document.querySelector(".header-search-history-body");

//历史记录点击以及渲染
if (searchHistoryBody && searchInput && searchForm) {
  searchHistoryBody.addEventListener("click", function (event: Event) {
    const target = event.target;
    if (!target) return;

    const value = (target as HTMLDivElement).dataset.value;
    if (!value) return;
    searchInput.value = value;
    searchStorage.add(value);
    searchForm.submit();
  });

  renderSearchBodyHtml(searchStorage.getHistory());
  searchStorage.watch(renderSearchBodyHtml);
}

/**
 * @description: 渲染搜索记录列表
 * @param {Array} list
 * @Date: 2022-07-18 00:37:00
 * @Author: mulingyuer
 */
function renderSearchBodyHtml(list: Array<string>) {
  if (!searchHistoryBody) return;
  let html = "";
  list.forEach((str) => {
    html += `<div class="header-search-history-item" data-value="${str}">${str}</div>`;
  });
  searchHistoryBody.innerHTML = html;
}

//记录搜索记录
if (searchForm && searchInput) {
  searchForm.addEventListener("submit", function (event: Event) {
    event.preventDefault();
    //记录搜索记录
    searchStorage.add(searchInput.value);
    //运行原生submit事件，这种方式调用不会触发submit事件
    this.submit();
  });
}

//搜索记录显示
if (searchInput && searchHistory && searchClear && searchHistoryBody) {
  searchInput.addEventListener("focus", function (event: Event) {
    if (!searchHistory.classList.contains("show") && searchStorage.hasData()) {
      searchHistory.classList.add("show");
    }
  });
  //全局关闭事件
  document.documentElement.addEventListener("click", searchHistoryGlobalClose);
}

/**
 * @description: 搜索记录全局关闭事件
 * @Date: 2022-07-18 00:25:17
 * @Author: mulingyuer
 */
function searchHistoryGlobalClose(event: Event) {
  if (!searchHistory || !searchForm) return;
  if (!searchForm.contains(event.target as Node) && searchHistory.classList.contains("show")) {
    searchHistory.classList.remove("show");
  }
}

//清空历史记录
if (searchClear && searchHistory) {
  searchClear.addEventListener("click", function () {
    searchStorage.clear();
    searchHistory.classList.remove("show");
  });
}
