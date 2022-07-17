/*
 * @Author: mulingyuer
 * @Date: 2022-07-17 19:42:51
 * @LastEditTime: 2022-07-18 00:40:35
 * @LastEditors: mulingyuer
 * @Description: 搜索记录存储
 * @FilePath: \Typecho_Theme_JJ\packages\search\storage.ts
 * 怎么可能会有bug！！！
 */

type SearchStorageOptions = {
  maxLength: number;
  storageKey: string;
};

class SearchStorage {
  private history: Array<string> = []; //搜索记录
  private maxLength: number = 6; //最大长度
  private storageKey: string = "searchRecord"; //缓存的key
  private noticeList: Array<Function> = []; //通知队列

  constructor(options: SearchStorageOptions) {
    const { maxLength, storageKey } = options;

    this.maxLength = maxLength;
    this.storageKey = storageKey;

    //初始化
    this.init();
  }

  /**
   * @description: 初始化
   * @Date: 2022-07-17 19:49:13
   * @Author: mulingyuer
   */
  private init() {
    this.history = this.getLocalHistory().splice(0, this.maxLength);
  }

  /**
   * @description: 添加一条搜索记录
   * @param {string} value
   * @Date: 2022-07-17 19:51:10
   * @Author: mulingyuer
   */
  public add(value: string) {
    value = value.trim();
    const findIndex = this.findIndex(value);

    if (this.history.length === this.maxLength) {
      if (findIndex !== -1) {
        this.history.splice(findIndex, 1);
      } else {
        this.history.pop();
      }
    } else {
      if (findIndex !== -1) {
        this.history.splice(findIndex, 1);
      }
    }

    this.history.unshift(value);
    this.saveLocalHistory(this.history);
    //通知订阅者
    this.updateNoticeList();
  }

  /**
   * @description: 删除指定的记录
   * @param {string} value
   * @Date: 2022-07-17 21:42:18
   * @Author: mulingyuer
   */
  public remove(value: string | number) {
    if (typeof value === "string") {
      value = value.trim();
      const findIndex = this.findIndex(value);
      if (findIndex !== -1) {
        this.history.splice(findIndex, 1);
        this.saveLocalHistory(this.history);
        //通知订阅者
        this.updateNoticeList();
      }
    } else {
      if (value <= this.history.length) {
        this.history.splice(value, 1);
        this.saveLocalHistory(this.history);
        //通知订阅者
        this.updateNoticeList();
      }
    }
  }

  /**
   * @description: 清空记录
   * @Date: 2022-07-17 21:51:55
   * @Author: mulingyuer
   */
  public clear() {
    this.history = [];
    this.saveLocalHistory(this.history);
    //通知订阅者
    this.updateNoticeList();
  }

  /**
   * @description: 获取记录
   * @Date: 2022-07-17 21:44:29
   * @Author: mulingyuer
   */
  public getHistory() {
    return [...this.history];
  }

  /**
   * @description: 是否有数据
   * @Date: 2022-07-18 00:40:20
   * @Author: mulingyuer
   */
  public hasData(): boolean {
    return this.history.length > 0;
  }

  /**
   * @description: 是否已经存在该记录
   * @param {string} value
   * @Date: 2022-07-17 19:54:00
   * @Author: mulingyuer
   */
  public findIndex(value: string): number {
    return this.history.findIndex((val) => val === value.trim());
  }

  /**
   * @description: 订阅
   * @param {Function} fn
   * @Date: 2022-07-17 21:47:13
   * @Author: mulingyuer
   */
  public watch(fn: Function) {
    if (!this.noticeList.includes(fn)) {
      this.noticeList.push(fn);
    } else {
      console.log(`该订阅函数已经存在，请勿重复订阅`);
    }
  }

  /**
   * @description: 取消订阅
   * @param {Function} fn
   * @Date: 2022-07-17 21:48:01
   * @Author: mulingyuer
   */
  public unWatch(fn: Function) {
    const findIndex = this.noticeList.findIndex((item) => item === fn);
    if (findIndex !== -1) {
      this.noticeList.splice(findIndex, 1);
    }
  }

  /**
   * @description: 通知订阅者
   * @Date: 2022-07-17 21:48:49
   * @Author: mulingyuer
   */
  private updateNoticeList() {
    this.noticeList.forEach((fn) => {
      try {
        fn(this.getHistory());
      } catch (error) {
        console.log(`运行该订阅函数发生错误，`, error);
      }
    });
  }

  /**
   * @description: 获取本地搜索记录
   * @Date: 2022-07-17 19:47:45
   * @Author: mulingyuer
   */
  private getLocalHistory(): Array<string> {
    try {
      const history = localStorage.getItem(this.storageKey);
      if (history) {
        return JSON.parse(history);
      } else {
        return [];
      }
    } catch (error) {
      console.log(`读取本地搜索记录发生错误，`, error);
      return [];
    }
  }

  /**
   * @description: 设置本地搜索记录
   * @Date: 2022-07-17 19:48:50
   * @Author: mulingyuer
   */
  private saveLocalHistory(data: Array<string>) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.log(`保存本地搜索记录发生错误，`, error);
      localStorage.setItem(this.storageKey, JSON.stringify([]));
    }
  }
}

export default SearchStorage;
