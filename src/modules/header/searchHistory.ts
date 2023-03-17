/*
 * @Author: mulingyuer
 * @Date: 2023-03-16 00:12:43
 * @LastEditTime: 2023-03-17 07:44:29
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
  /** 关闭黑名单：加入名单的元素在click点击后不会关闭历史记录弹窗 */
  closeBlacklist?: Array<HTMLElement>;
  /** list事件代理回调 */
  onListClick?: (value: string, event: MouseEvent) => void;
}

class SearchHistory {
  private wrap: HTMLElement; //容器
  private list: HTMLElement; //列表
  private clearBtn: HTMLElement; //清空按钮
  private history: Set<string> = new Set(); //历史记录
  private historyKey: string = "search_history"; //历史记录key
  private maxCount: number = 6; //最大历史记录数
  private closeBlacklist: Array<HTMLElement> = []; //黑名单
  private onListClick: (value: string, event: MouseEvent) => void = () => {}; //list事件代理回调

  constructor(options: historyOptions) {
    const { wrapClass, listClass, clearBtnClass, maxCount, closeBlacklist, onListClick } = options;
    this.wrap = document.querySelector(wrapClass) as HTMLElement;
    this.list = document.querySelector(listClass) as HTMLElement;
    this.clearBtn = document.querySelector(clearBtnClass) as HTMLElement;
    if (typeof maxCount === "number") this.maxCount = maxCount; //设置最大历史记录数
    if (closeBlacklist) this.closeBlacklist = closeBlacklist; //设置白名单
    if (onListClick) this.onListClick = onListClick; //设置list事件代理回调
    //历史记录
    // jjLocal.setItem(this.historyKey, [1, 2, 3, 4, 5, 6, 7, 8]);
    const historyArr = jjLocal.getItem<Array<string> | null>(this.historyKey);
    if (historyArr) {
      this.history = new Set(historyArr.splice(0, this.maxCount));
    }

    this.clear = this.clear.bind(this);
    this.onClickOtherClose = this.onClickOtherClose.bind(this);
    this.onListClickProxy = this.onListClickProxy.bind(this);
    //绑定事件
    this.clearBtn.addEventListener("click", this.clear);
    document.addEventListener("click", this.onClickOtherClose);
    this.list.addEventListener("click", this.onListClickProxy);
  }

  /** 显示容器 */
  public show(): this {
    if (this.getHistoryLength() <= 0) {
      this.hide();
      return this;
    }
    if (this.wrap.classList.contains("visible")) return this; //已经显示了
    const listHtml = this.createList();
    this.list.innerHTML = listHtml;
    this.wrap.classList.add("visible");
    return this;
  }

  /** 隐藏容器 */
  public hide(): this {
    if (!this.wrap.classList.contains("visible")) return this; //没有显示
    this.wrap.classList.remove("visible");
    return this;
  }

  /** 清空 */
  public clear(): this {
    this.hide();
    this.clearHistory();
    this.list.innerHTML = "";
    return this;
  }

  /** 点击其他区域关闭事件 */
  private onClickOtherClose(event: MouseEvent) {
    if (!this.wrap.classList.contains("visible")) return; //没有显示
    const target = event.target as HTMLElement;
    const findData = this.closeBlacklist.find((item) => item.contains(target));
    if (findData || this.wrap.contains(target)) return;
    this.hide();
  }

  /** 生成list */
  private createList(): string {
    let html = "";
    this.history.forEach((item) => {
      html += `<div class="search-history-list-item">${item}</div>`;
    });
    return html;
  }

  /** list事件代理 */
  private onListClickProxy(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const text = target.innerText;
    //通知回调
    this.onListClick(text, event);
  }

  /** 添加一条搜索记录 */
  public addHistory(val: string): this {
    if (this.history.has(val)) return this;
    if (this.history.size >= this.maxCount) {
      const newArr = [...this.history].slice(0, this.maxCount);
      newArr.pop(); //尾出栈
      this.history = new Set(newArr);
    }
    this.history.add(val);
    this.saveHistory();
    return this;
  }

  /** 清空搜索记录 */
  private clearHistory() {
    this.history.clear();
    this.saveHistory();
  }

  /** 获取记录条数 */
  public getHistoryLength(): number {
    return this.history.size;
  }

  /** 本地保存搜索记录 */
  private saveHistory() {
    jjLocal.setItem(this.historyKey, [...this.history]);
  }
}

export default SearchHistory;
