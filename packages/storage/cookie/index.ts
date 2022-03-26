/*
 * @Author: mulingyuer
 * @Date: 2022-03-27 00:29:53
 * @LastEditTime: 2022-03-27 01:03:14
 * @LastEditors: mulingyuer
 * @Description: cookie封装
 * @FilePath: \Typecho_Theme_JJ\packages\storage\cookie\index.ts
 * 怎么可能会有bug！！！
 */
import { CookieOptions } from "./types";

class Cookie {
  private static instance: Cookie;
  protected expires: number; //过期时间ms
  private constructor(options?: CookieOptions) {
    if (options) {
      const { expires } = options;
      this.expires = expires;
    } else {
      this.expires = 100 * 365 * 24 * 60 * 60 * 1000; //100年
    }
  }

  //获取实例
  public static create(options?: CookieOptions) {
    if (!Cookie.instance) {
      Cookie.instance = new Cookie(options);
    }

    return Cookie.instance;
  }

  /**
   * @description: 获取key对应的值
   * @param {string} keyname
   * @Date: 2022-03-27 00:46:52
   * @Author: mulingyuer
   */
  public getItem(keyname: string): string {
    const cookieStr = document.cookie;
    const cookieArr = cookieStr.split(";");
    let val = "";

    const findStr = cookieArr.find((item) => item.includes(keyname));
    if (findStr) {
      val = findStr.split("=")[1];
    }

    return val;
  }

  /**
   * @description: 设置key对应的值
   * @param {string} keyname
   * @param {string} value
   * @Date: 2022-03-27 00:46:59
   * @Author: mulingyuer
   */
  public setItem(keyname: string, value: string, time?: number): void {
    let expiresTime: string;
    if (typeof time !== "number") {
      expiresTime = new Date(Date.now() + this.expires).toUTCString();
    } else {
      expiresTime = new Date(time).toUTCString();
    }

    document.cookie = `${keyname}=${value};expires=${expiresTime};`;
  }

  /**
   * @description: 移除键
   * @param {string} keyname
   * @Date: 2022-03-27 00:47:38
   * @Author: mulingyuer
   */
  public removeItem(keyname: string): void {
    const expiresTime = Date.now() - 10000;
    this.setItem(keyname, "removed", expiresTime);
  }
}

export default Cookie;
