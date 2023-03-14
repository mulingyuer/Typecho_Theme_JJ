/*
 * @Author: mulingyuer
 * @Date: 2022-12-18 21:39:53
 * @LastEditTime: 2023-03-14 17:13:52
 * @LastEditors: mulingyuer
 * @Description: about
 * @FilePath: \webpack-multiple-entry\src\pages\page\index.ts
 * 怎么可能会有bug！！！
 */
import "./style.scss";

class Page {
  public name: string;

  constructor() {
    this.name = "page";
  }

  public run(): void {
    alert(`独立页面：${this.name}`);
  }
}
