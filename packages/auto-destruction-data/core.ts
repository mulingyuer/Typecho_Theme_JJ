/*
 * @Author: mulingyuer
 * @Date: 2022-04-14 22:14:15
 * @LastEditTime: 2022-04-15 01:42:51
 * @LastEditors: mulingyuer
 * @Description: 自动销毁核心
 * @FilePath: \Typecho_Theme_JJ\packages\auto-destruction-data\core.ts
 * 怎么可能会有bug！！！
 */
import { AutoDestructionOptions } from "./types";

//自动销毁类
class AutoDestruction {
  private _expiryTime: number; //默认过期时间
  private _map = new Map(); //存储的数据对象

  constructor(options: AutoDestructionOptions) {
    const { expiryTime } = options;

    this._expiryTime = expiryTime;
  }

  /**
   * @description: get方法
   * @param {any} key
   * @Date: 2022-04-15 00:47:52
   * @Author: mulingyuer
   */
  public get(key: any): any {
    //自动删除过期数据
    this.autoDelete(key);
    //再拿结果
    const results = this._map.get(key);

    return results ? results.value : results;
  }

  /**
   * @description: set方法
   * @param {any} key
   * @param {any} val
   * @Date: 2022-04-15 00:48:03
   * @Author: mulingyuer
   */
  public set(key: any, val: any, time?: number): AutoDestruction {
    let expiryTime = this._expiryTime;
    if (typeof time === "number") {
      expiryTime = time;
    }
    //保存数据
    this._map.set(key, {
      saveTime: Date.now(), //存储时的时间
      expiryTime, //多久过期
      value: val, //存储的值
    });

    //抛出自己
    return this;
  }

  /**
   * @description: has方法
   * @param {any} key
   * @Date: 2022-04-15 00:51:48
   * @Author: mulingyuer
   */
  public has(key: any): boolean {
    //自动删除过期数据
    this.autoDelete(key);

    return this._map.has(key);
  }

  //size属性
  public get size(): number {
    //自动删除过期数据:计算size那只能先删一波
    this.autoDelete();

    return this._map.size;
  }

  /**
   * @description: delete方法
   * @param {any} key
   * @Date: 2022-04-15 00:53:43
   * @Author: mulingyuer
   */
  public delete(key: any): boolean {
    return this._map.delete(key);
  }

  /**
   * @description: 自动删除
   * @param {any} key
   * @Date: 2022-04-15 00:12:17
   * @Author: mulingyuer
   */
  private autoDelete(key?: any): void {
    if (typeof key === "string") {
      const value = this._map.get(key);
      if (!value) return;
      const { saveTime, expiryTime } = value;
      if (this.isExpiry(saveTime, expiryTime)) {
        this._map.delete(key);
      }
    } else {
      const expiryKeys: Array<any> = []; //过期key
      this._map.forEach((val, key) => {
        const { saveTime, expiryTime } = val;
        //超过有效期记录
        if (this.isExpiry(saveTime, expiryTime)) expiryKeys.push(key);
      });
      expiryKeys.forEach((key) => this._map.delete(key));
    }
  }

  /**
   * @description: 是否已过期
   * @param {number} expiryTime
   * @Date: 2022-04-15 00:21:43
   * @Author: mulingyuer
   */
  private isExpiry(saveTime: number, expiryTime: number): boolean {
    return Date.now() > saveTime + expiryTime;
  }
}

export default AutoDestruction;
