/*
 * @Author: mulingyuer
 * @Date: 2022-03-26 22:57:04
 * @LastEditTime: 2022-03-27 01:10:24
 * @LastEditors: mulingyuer
 * @Description: 主题类型声明
 * @FilePath: \Typecho_Theme_JJ\packages\theme\types.ts
 * 怎么可能会有bug！！！
 */
import Cookie from "@packages/storage/cookie";

//主题列表
export type Links = Array<HTMLLinkElement>;
//link集合
export type Themes = Array<string>;
//存储方式
export type StorageType = "localStorage" | "sessionStorage" | "cookie";
export type CacheStorage = Storage | Cookie;

//主题初始化数据
export interface InitData {
  themes: Themes;
  links: Links;
  activeIndex: number;
  activeTheme: string;
}
//构造函数配置
export interface ThemeOptions {
  defaultTheme?: string;
  update?: Function;
  storageType?: StorageType;
  storageKey?: string;
}
