/*
 * @Author: mulingyuer
 * @Date: 2022-04-11 22:50:05
 * @LastEditTime: 2022-04-11 22:58:26
 * @LastEditors: mulingyuer
 * @Description: md5 核心
 * @FilePath: \Typecho_Theme_JJ\packages\md5\core.ts
 * 怎么可能会有bug！！！
 */
import MD5 from "spark-md5";

/**
 * @description: 普通md5加密
 * @param {string} str 加密的字符串
 * @param {boolean} raw 是否转为二进制字符串，默认16进制
 * @Date: 2022-04-11 22:52:27
 * @Author: mulingyuer
 */
export function md5(str: string, raw?: boolean): string {
  return MD5.hash(str, raw);
}

export class IncrementalMD5 {
  private _instance: MD5; //实例
  constructor() {
    this._instance = new MD5();
  }

  /**
   * @description:  增量插入内容
   * @param {string} str //加密的字符串
   * @Date: 2022-04-11 22:58:01
   * @Author: mulingyuer
   */
  public append(str: string): IncrementalMD5 {
    this._instance.append(str);
    return this;
  }

  /**
   * @description: 增量结束
   * @param {boolean} raw 是否转二进制字符串，默认16进制
   * @Date: 2022-04-11 22:57:44
   * @Author: mulingyuer
   */
  public end(raw?: boolean) {
    return this._instance.end(raw);
  }
}
