/*
 * @Author: mulingyuer
 * @Date: 2023-03-21 02:59:36
 * @LastEditTime: 2023-03-21 03:04:01
 * @LastEditors: mulingyuer
 * @Description: 性能监听
 * @FilePath: \Typecho_Theme_JJ\src\utils\browserPerformance.ts
 * 怎么可能会有bug！！！
 */

/** 监听的回调函数 */
type PerfCallback = (entry: PerformanceEntry) => void;

class BrowserPerformance {
  /** 性能监听 */
  private perfObserver: PerformanceObserver;
  /** 监听的回调 */
  private perfCallbackArr: Set<PerfCallback> = new Set();

  constructor() {
    //监听性能
    this.perfObserver = new PerformanceObserver((list) => {
      const entry = list.getEntriesByType("navigation")[0];
      this.perfCallbackArr.forEach((callback) => {
        try {
          callback(entry);
        } catch (error) {
          console.error("运行性能监听回调出现问题", error);
        }
      });
    });
    this.perfObserver.observe({ entryTypes: ["navigation"] });
  }

  /** 添加监听回调 */
  public addCallback(callback: PerfCallback) {
    this.perfCallbackArr.add(callback);
  }

  /** 移除监听回调 */
  public removeCallback(callback: PerfCallback) {
    this.perfCallbackArr.delete(callback);
  }

  /** 关闭监听 */
  public close() {
    this.perfObserver.disconnect();
  }
}

const browserPerformance = new BrowserPerformance();
export default browserPerformance;
