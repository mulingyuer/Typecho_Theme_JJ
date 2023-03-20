/*
 * @Author: mulingyuer
 * @Date: 2023-03-20 17:27:49
 * @LastEditTime: 2023-03-21 01:27:46
 * @LastEditors: mulingyuer
 * @Description: 监听元素是否进入视口
 * @FilePath: \Typecho_Theme_JJ\src\utils\observer.ts
 * 怎么可能会有bug！！！
 */

/** 监听dom参数 */
export type ObserverTarget = Element | Array<Element>;
/** 监听dom的回调 */
export type ObserverCallback = (entries: IntersectionObserverEntry) => void;
/** 事件存储对象 */
export type EventMapValue = {
  /** 回调数组 */
  callback: ObserverCallback;
  /** this指向 */
  that?: any;
};
export type EventMap = Map<ObserverTarget, Array<EventMapValue>>;

export class Observer {
  /** bom提供的监听Api实例 */
  private observer: IntersectionObserver;
  /** 事件存储对象 */
  private eventMap: EventMap = new Map();

  constructor(options?: IntersectionObserverInit) {
    this.observer = new IntersectionObserver(this.watchCallback.bind(this), options);
  }

  /** 监听回调函数 */
  private watchCallback = (entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      const { target } = entry;
      const events = this.eventMap.get(target);
      if (!events) return;
      events.forEach((item) => {
        const { callback, that } = item;
        callback.call(that, entry);
      });
    });
  };

  /**
   * @description: 监听传入的dom元素
   * @param {ObserverTarget} target 监听的dom元素
   * @param {ObserverCallback} callback 回调函数
   * @param {any} that 回调函数的this指向
   * @Date: 2023-03-20 19:09:20
   * @Author: mulingyuer
   */
  public observe(target: ObserverTarget, callback: ObserverCallback, that?: any) {
    if (Array.isArray(target)) {
      target.forEach((item) => {
        this.subscribe(item, callback, that);
        this.observer.observe(item);
      });
    } else {
      this.subscribe(target, callback, that);
      this.observer.observe(target);
    }
  }

  /**
   * @description: 取消监听
   * @param {ObserverTarget} target 监听的dom元素
   * @param {ObserverCallback} callback 回调函数
   * @param {any} that 回调函数的this指向
   * @Date: 2023-03-20 19:09:34
   * @Author: mulingyuer
   */
  public unobserve(target: ObserverTarget, callback: ObserverCallback, that?: any) {
    if (Array.isArray(target)) {
      target.forEach((item) => {
        this.unsubscribe(item, callback, that);
        this.observer.unobserve(item);
      });
    } else {
      this.unsubscribe(target, callback, that);
      this.observer.unobserve(target);
    }
  }

  /**
   * @description: 清空所有监听
   * @Date: 2023-03-20 19:09:48
   * @Author: mulingyuer
   */
  public disconnect() {
    this.observer.disconnect();
    this.eventMap.clear();
  }

  /**
   * @description: 事件订阅
   * @param {ObserverTarget} target 监听的dom元素
   * @param {ObserverCallback} callback 回调函数
   * @param {any} that 回调函数的this指向
   * @Date: 2023-03-20 19:09:57
   * @Author: mulingyuer
   */
  private subscribe(target: ObserverTarget, callback: ObserverCallback, that?: any) {
    let events = this.eventMap.get(target);
    if (!events) {
      events = [];
      this.eventMap.set(target, events);
    }
    //判断是否重复订阅
    const findIndex = this.findSubscribeIndex(target, callback, that);
    if (findIndex !== -1) return console.warn("重复订阅");
    //引用类型，不需要map重新赋值
    events.push({ callback, that });
  }

  /**
   * @description: 事件取消订阅
   * @param {ObserverTarget} target 监听的dom元素
   * @param {ObserverCallback} callback 回调函数
   * @param {any} that 回调函数的this指向
   * @Date: 2023-03-20 19:10:19
   * @Author: mulingyuer
   */
  private unsubscribe(target: ObserverTarget, callback: ObserverCallback, that?: any) {
    let events = this.eventMap.get(target);
    if (!events) return;
    const findIndex = this.findSubscribeIndex(target, callback, that);
    if (findIndex === -1) return;
    events.splice(findIndex, 1);
    if (events.length <= 0) this.eventMap.delete(target);
  }

  /**
   * @description: 查询是否已经存在订阅，返回存在的下标
   * @param {ObserverTarget} target 监听的dom元素
   * @param {ObserverCallback} callback 回调函数
   * @param {any} that 回调函数的this指向
   * @Date: 2023-03-20 19:10:32
   * @Author: mulingyuer
   */
  private findSubscribeIndex(target: ObserverTarget, callback: ObserverCallback, that?: any): number {
    let events = this.eventMap.get(target);
    if (!events) return -1;
    const findIndex = events.findIndex((item) => {
      const { callback: itemCallback, that: itemThat } = item;
      let flag = false;
      const isCallback = callback === itemCallback;
      if (that) {
        flag = isCallback && that === itemThat;
      } else {
        flag = isCallback && !itemThat;
      }
      return flag;
    });
    return findIndex;
  }
}

export const observer = new Observer();
export default observer;
