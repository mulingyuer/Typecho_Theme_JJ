/*
 * @Author: mulingyuer
 * @Date: 2022-03-13 01:53:20
 * @LastEditTime: 2022-03-26 22:56:53
 * @LastEditors: mulingyuer
 * @Description: 事件代理
 * @FilePath: \Typecho_Theme_JJ\packages\event-proxy\index.ts
 * 怎么可能会有bug！！！
 */
import { DomMap, EventList, HTMLElementProxy } from "./types";

class EventProxy {
  //dom列表
  domMap: DomMap;

  constructor() {
    this.domMap = new Map();
  }

  //添加事件
  public addEventListener(
    eventTarget: HTMLElement,
    type: string,
    listener: EventListener,
    options?: EventListenerOptions
  ) {
    //添加dom：自动判空
    this.addDom(eventTarget);
    //添加事件：自动判空
    this.addDomEvent(eventTarget, type, listener, options);
  }

  //移除事件
  public removeEventListener(eventTarget: HTMLElement, type: string, listener: EventListener) {
    //判断是否存在dom
    if (!this.hasDom(eventTarget)) {
      return console.warn(`移除事件时没有找到dom，dom为${eventTarget}`);
    }
    //判断是否存在事件代理
    if (!this.hasDomEventProxy(eventTarget, type)) {
      return console.warn(`移除事件时没有找到事件代理，dom为${eventTarget}，事件类型为${type}`);
    }
    //移除事件
    this.removeDomEvent(eventTarget, type, listener);
  }

  //添加一次性事件
  public addOnceEventListener(eventTarget: HTMLElement, type: string, listener: EventListener) {
    eventTarget.addEventListener(type, listener, { once: true });
  }

  //是否存在dom
  protected hasDom(dom: HTMLElement): boolean {
    return this.domMap.has(dom);
  }

  //添加dom
  protected addDom(dom: HTMLElement) {
    if (!this.domMap.has(dom)) {
      this.domMap.set(dom, new Map());
    }
    return this.domMap.get(dom);
  }

  //移除dom
  protected removeDom(dom: HTMLElement) {
    this.domMap.delete(dom);
  }

  //dom是否已经事件代理
  protected hasDomEventProxy(dom: HTMLElement, type: string): boolean {
    const eventMap = this.domMap.get(dom);
    if (!eventMap) {
      throw new Error(`该dom还未初始化，无法判断是否存在事件代理，dom为${dom}`);
    }
    return eventMap.has(type);
  }

  //dom添加事件列表
  protected addDomEvent(dom: HTMLElement, type: string, listener: EventListener, options?: EventListenerOptions) {
    const eventMap = this.domMap.get(dom);
    if (!eventMap) {
      throw new Error(`该dom还未初始化，无法添加事件代理，dom为${dom}`);
    }
    //初始化事件数组
    if (!eventMap.get(type)) {
      eventMap.set(type, new Set());
      //dom绑定事件
      const domProxy: HTMLElementProxy = Object.assign(dom, {
        _eventFunctionProxy: this.eventFunctionProxy(), //记住事件代理
      });
      dom.addEventListener(type, domProxy._eventFunctionProxy, options);
    }
    //添加事件到队列
    const arr = eventMap.get(type);
    arr!.add(listener);
  }

  //dom获取事件列表
  protected getDomEvent(dom: HTMLElement, type: string): EventList {
    //dom没有就返空数组
    const eventMap = this.domMap.get(dom);
    if (!eventMap) {
      console.warn(`触发事件时没有获取到dom对应的事件列表，${dom}`);
      return new Set();
    }
    //事件类型没有就返空数组
    const listSet = eventMap.get(type);
    if (!listSet) {
      console.warn(`触发事件时没有获取到事件类型对应的事件列表，${dom}，${type}`);
      return new Set();
    }
    return listSet;
  }

  //dom移除事件
  protected removeDomEvent(dom: HTMLElement, type: string, listener: EventListener) {
    //获取到evnetMap
    const eventMap = this.domMap.get(dom);
    if (!eventMap) {
      throw new Error(`该dom还未初始化，无法移除事件代理，dom为${dom}`);
    }

    //获取到事件列表
    const listSet = eventMap.get(type);
    if (!listSet) {
      return console.warn(`事件列表为空，无需移除事件`);
    }

    //移除事件
    const filterArr = [...listSet].filter((item) => item !== listener);
    //判断是否为空
    if (filterArr.length > 0) {
      eventMap.set(type, new Set(filterArr));
      return;
    }
    //事件列表为空就删除dom索引
    this.removeDom(dom);
    //移除事件监听
    dom.removeEventListener(type, (dom as HTMLElementProxy)._eventFunctionProxy);
  }

  //事件函数代理
  protected eventFunctionProxy(): EventListener {
    const that: EventProxy = this;
    return function (evnet: Event) {
      const type = evnet.type; //获取事件类型
      //获取事件列表
      const domEventList = that.getDomEvent(this, type);
      //遍历事件列表
      domEventList.forEach((listener) => {
        listener.call(this, evnet);
      });
    };
  }
}

export default new EventProxy();
