/*
 * @Author: mulingyuer
 * @Date: 2023-03-29 20:17:39
 * @LastEditTime: 2023-03-29 20:49:54
 * @LastEditors: mulingyuer
 * @Description: 骨架屏父类
 * @FilePath: \Typecho_Theme_JJ\src\bin\skeleton.ts
 * 怎么可能会有bug！！！
 */
import { useDataStore } from "@/store/data";
import { watch } from "vue";

const dataStore = useDataStore();
//监听dom是否解析完毕
document.addEventListener("DOMContentLoaded", () => {
  dataStore.setIsDomContentLoaded(true);
});

abstract class Skeleton {
  /** 最大延迟 */
  protected maxDelay: number = 200;
  /** 关闭的标记 */
  protected isClose: boolean = false;

  constructor() {
    //监听dom是否解析完毕
    watch(() => dataStore.getIsDomContentLoaded, this.domContentLoadedCallback, { immediate: true });
  }

  /** 监听dom是否解析完毕 */
  protected domContentLoadedCallback = (val: boolean) => {
    if (!val && !this.isClose) return;
    this.isClose = true;
    setTimeout(() => {
      this.close();
    }, this.maxDelay);
  };

  /** 关闭骨架的方法 */
  abstract close(): void;
}

export default Skeleton;
