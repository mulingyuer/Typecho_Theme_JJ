/*
 * @Author: mulingyuer
 * @Date: 2023-03-15 16:06:10
 * @LastEditTime: 2023-03-15 16:36:25
 * @LastEditors: mulingyuer
 * @Description: 本地存储类
 * @FilePath: \Typecho_Theme_JJ\src\utils\storage.ts
 * 怎么可能会有bug！！！
 */
/** 存储类型 */
export type StorageType = "local" | "session";
/** 存储类配置参数 */
export type StorageOptions = {
  type?: StorageType;
  prefix?: string;
};

class JJStorage {
  private storage: Storage;
  private prefix: string = "";

  constructor(options: StorageOptions) {
    const { type, prefix } = options;

    switch (type) {
      case "local":
        this.storage = window.localStorage;
        break;
      case "session":
        this.storage = window.sessionStorage;
        break;
      default:
        this.storage = window.localStorage;
    }

    if (prefix) {
      this.prefix = prefix;
    }
  }

  /** 存储数据 */
  public setItem(key: string, value: any) {
    key = this.prefix + key;
    if (typeof value === "string") {
      this.storage.setItem(key, value);
      return;
    }

    try {
      this.storage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("存储数据失败：", error);
    }
  }

  /** 获取数据 */
  public getItem<T>(key: string, isJson: boolean = true) {
    key = this.prefix + key;
    const value = this.storage.getItem(key);
    if (!value) return null;

    if (!isJson) return value as T;
    try {
      return JSON.parse(value) as T;
    } catch (error) {
      return value as T;
    }
  }

  /** 删除数据 */
  public removeItem(key: string) {
    key = this.prefix + key;
    this.storage.removeItem(key);
  }

  /** 清空数据 */
  public clear() {
    this.storage.clear();
  }
}

/** 实例化 */
const jjLocal = new JJStorage({ type: "local", prefix: "jj_" });

export { JJStorage, jjLocal };
