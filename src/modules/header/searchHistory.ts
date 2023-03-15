/*
 * @Author: mulingyuer
 * @Date: 2023-03-16 00:12:43
 * @LastEditTime: 2023-03-16 01:40:04
 * @LastEditors: mulingyuer
 * @Description: 搜索记录类
 * @FilePath: \Typecho_Theme_JJ\src\modules\header\searchHistory.ts
 * 怎么可能会有bug！！！
 */
import { jjLocal } from "@/utils/storage";

/** 参数 */
interface historyOptions {
  /** 历史记录容器选择器 */
  wrapClass: string;
  /** 列表容器选择器 */
  listClass: string;
  /** 清空按钮选择器 */
  clearBtnClass: string;
  /** 最大历史记录数 */
  maxCount?: number;
}

class SearchHistory {
  private wrap: HTMLElement; //容器
  private list: HTMLElement; //列表
  private clearBtn: HTMLElement; //清空按钮
  private history: Set<string> = new Set(); //历史记录
  private historyKey: string = "search_history"; //历史记录key
  private maxCount: number = 6; //最大历史记录数

  constructor(options: historyOptions) {
    const { wrapClass, listClass, clearBtnClass, maxCount } = options;
    this.wrap = document.querySelector(wrapClass) as HTMLElement;
    this.list = document.querySelector(listClass) as HTMLElement;
    this.clearBtn = document.querySelector(clearBtnClass) as HTMLElement;
    if (typeof maxCount === "number") this.maxCount = maxCount; //设置最大历史记录数
    //历史记录
    jjLocal.setItem(this.historyKey, [1, 2, 3, 4, 5, 6, 7]);
    const historyArr = jjLocal.getItem<Array<string> | null>(this.historyKey);
    if (historyArr) {
      this.history = new Set(historyArr.splice(0, this.maxCount));
    }

    this.clear = this.clear.bind(this);
    //绑定事件
    this.clearBtn.addEventListener("click", this.clear);
  }

  /** 显示容器 */
  public show() {
    if (this.getHistoryLength() <= 0) {
      this.hide();
      return;
    }
    const listHtml = this.createList();
    this.list.innerHTML = listHtml;
    this.wrap.classList.add("visible");
  }

  /** 隐藏容器 */
  public hide() {
    this.wrap.classList.remove("visible");
  }

  /** 清空 */
  public clear() {
    this.hide();
    this.clearHistory();
    this.list.innerHTML = "";
  }

  /** 生成list */
  private createList(): string {
    let html = "";
    this.history.forEach((item) => {
      html += `<div class="header-search-history-list-item">${item}</div>`;
    });
    return html;
  }

  /** 添加一条搜索记录 */
  public addHistory(val: string) {
    if (this.history.has(val)) return;
    if (this.history.size >= this.maxCount) {
      const newArr = [...this.history].slice(0, this.maxCount);
      newArr.pop(); //尾出栈
      this.history = new Set(newArr);
    }
    this.history.add(val);
    this.saveHistory();
  }

  /** 清空搜索记录 */
  public clearHistory() {
    this.history.clear();
    this.saveHistory();
  }

  /** 获取记录条数 */
  public getHistoryLength() {
    return this.history.size;
  }

  /** 本地保存搜索记录 */
  private saveHistory() {
    jjLocal.setItem(this.historyKey, [...this.history]);
  }
}

export default SearchHistory;
