/*
 * @Author: mulingyuer
 * @Date: 2022-03-26 22:26:38
 * @LastEditTime: 2022-03-27 01:59:11
 * @LastEditors: mulingyuer
 * @Description: 主题切换
 * @FilePath: \Typecho_Theme_JJ\packages\theme\index.ts
 * 怎么可能会有bug！！！
 */
// html需要静态引入这样的样式
// <link rel="stylesheet" href="./dist/css/theme/light.css" type="text/css" title="light" theme />
// <link rel="alternate stylesheet" href="./dist/css/theme/dark.css" type="text/css" title="dark" theme/>
import { Links, Themes, InitData, ThemeOptions, StorageType, CacheStorage } from "./types";
import Cookie from "@packages/storage/cookie";

class Theme {
  protected static instance: Theme;
  protected links: Links; //link集合
  protected themes: Themes; //主题列表
  protected activeTheme: string; //默认主题
  protected activeIndex: number; //切换的主题下标
  protected update: Function; //每次切换触发的钩子
  protected storageType: StorageType; //缓存的方式
  protected storage: CacheStorage; //缓存存储对象
  protected storageKey: string; //缓存存储的key

  private constructor(options?: ThemeOptions) {
    //缓存
    this.storageType = "localStorage";
    this.storageKey = "theme";
    this.storage = this.getStorageInstance(this.storageType);
    //默认设置
    const { themes, links, activeIndex, activeTheme } = this.getInitData();
    this.themes = themes;
    this.activeIndex = activeIndex;
    this.activeTheme = activeTheme;
    this.links = links;
    this.update = () => {};
    //用户配置
    if (options) {
      const { update, storageType, storageKey } = options;
      storageType && (this.storageType = storageType);
      storageKey && (this.storageKey = storageKey);
      if (update && typeof update === "function") this.update = update;
    }

    //首次主题设置
    const cacheTheme = this.storage.getItem(this.storageKey);
    const isCacheTheme = cacheTheme && cacheTheme.trim() !== "";
    let initActiveTheme = this.activeTheme;
    if (isCacheTheme) {
      //缓存
      initActiveTheme = cacheTheme;
    } else if (options && options.defaultTheme && options.defaultTheme.trim() !== "") {
      //用户指定
      const { defaultTheme } = options;
      if (!this.isTheme(defaultTheme)) {
        throw new Error(`初始化的默认主题${defaultTheme}不存在与link中`);
      }
      initActiveTheme = defaultTheme;
    }
    //切换主题：为空也不怕，内部做了判空处理
    this.specifySwitchTheme(initActiveTheme);
  }

  //获取实例
  public static create(options?: ThemeOptions): Theme {
    if (!Theme.instance) {
      Theme.instance = new Theme(options);
    }

    return Theme.instance;
  }

  /**
   * @description: 循环切换主题
   * @Date: 2022-03-26 22:35:53
   * @Author: mulingyuer
   */
  public switchTheme(): void {
    const index = ++this.activeIndex % this.themes.length;
    const theme = this.themes[index];
    this.specifySwitchTheme(theme);
  }

  /**
   * @description: 指定主题切换
   * @param {string} theme
   * @Date: 2022-03-26 22:36:47
   * @Author: mulingyuer
   */
  public specifySwitchTheme(theme: string): void {
    if (theme.trim() === "") return;
    const index = this.getThemeIndex(theme);
    this.activeIndex = index;
    this.activeTheme = theme;

    //dom操作
    this.links.forEach((link) => {
      const title = link.getAttribute("title");

      //link元素需要先disabled=true,首次的时候，不然不会生效
      link.disabled = true;
      if (title === theme) {
        link.disabled = false;
        //谷歌首次切换有几率不触发效果，需要删除alternate
        if (link.getAttribute("rel")?.includes("alternate")) {
          link.setAttribute("rel", "stylesheet");
        }
      }
    });

    //缓存保存
    this.storage.setItem(this.storageKey, theme);
    //触发update钩子
    this.update(this.activeTheme, this.activeIndex);
  }

  /**
   * @description: 获取主题初始化数据
   * @Date: 2022-03-26 22:39:23
   * @Author: mulingyuer
   */
  protected getInitData(): InitData {
    const themes: Themes = [];
    let activeTheme = "";
    let activeIndex: number = 0;
    let links: Links = [...(document.querySelectorAll("link[theme]") as NodeListOf<HTMLLinkElement>)];

    //防止重复主题，重复也只处理第一个满足条件的
    links = links.filter((link, index) => {
      const name = link.getAttribute("title");
      if (name && typeof name === "string" && !themes.includes(name)) {
        themes.push(name);
        //根据html属性获得默认配置
        if (!link.getAttribute("rel")?.includes("alternate")) {
          activeTheme = name;
          activeIndex = index;
        }
        return true;
      }
      return false;
    });

    return { themes, links, activeIndex, activeTheme };
  }

  /**
   * @description: 获取指定主题的index下标
   * @param {string} theme
   * @Date: 2022-03-26 23:15:27
   * @Author: mulingyuer
   */
  protected getThemeIndex(theme: string): number {
    return this.themes.findIndex((item) => item === theme);
  }

  /**
   * @description: 指定的主题是否合法存在
   * @param {string} theme
   * @Date: 2022-03-26 23:28:41
   * @Author: mulingyuer
   */
  public isTheme(theme: string): boolean {
    return this.themes.includes(theme);
  }

  /**
   * @description: 获取缓存用的实例对象
   * @param {string} type
   * @Date: 2022-03-27 01:15:12
   * @Author: mulingyuer
   */
  protected getStorageInstance(type: string): CacheStorage {
    let storage;

    switch (type) {
      case "localStorage":
        storage = localStorage;
        break;
      case "sessionStorage":
        storage = sessionStorage;
        break;
      case "cookie":
        storage = Cookie.create();
        break;
      default:
        storage = localStorage;
    }

    return storage;
  }

  /**
   * @description: 获取主题列表
   * @Date: 2022-03-27 01:56:22
   * @Author: mulingyuer
   */
  public getThemes() {
    return this.themes;
  }
}

export default Theme;
