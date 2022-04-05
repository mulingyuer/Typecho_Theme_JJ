/*
 * @Author: mulingyuer
 * @Date: 2022-04-05 18:34:40
 * @LastEditTime: 2022-04-05 18:48:55
 * @LastEditors: mulingyuer
 * @Description:zIndexManager 层级管理器
 * @FilePath: \Typecho_Theme_JJ\packages\zIndexManager\index.ts
 * 怎么可能会有bug！！！
 */

/**
 * @description: 层级管理器
 * @param {*}
 * @Date: 2022-04-05 18:44:18
 * @Author: mulingyuer
 */
class ZIndexManager {
  private static instance: ZIndexManager;
  private _zindex = 0;

  private constructor(initialZIndex = 2000) {
    this._zindex = initialZIndex;
  }

  public static getInstance(initialZIndex = 2000) {
    if (!ZIndexManager.instance) {
      ZIndexManager.instance = new ZIndexManager(initialZIndex);
    }
    return ZIndexManager.instance;
  }

  /**
   * @description: 获取当前层级
   * @Date: 2022-04-05 18:44:55
   * @Author: mulingyuer
   */
  public getZIndex() {
    return this._zindex;
  }

  /**
   * @description: 返回下一个层级
   * @param {*}
   * @Date: 2022-04-05 18:45:28
   * @Author: mulingyuer
   */
  public nextZIndex() {
    return ++this._zindex;
  }
}

export default ZIndexManager;
