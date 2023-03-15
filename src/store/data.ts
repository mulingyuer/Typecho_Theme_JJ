/*
 * @Author: mulingyuer
 * @Date: 2023-03-15 16:56:16
 * @LastEditTime: 2023-03-15 17:03:11
 * @LastEditors: mulingyuer
 * @Description: 数据仓库
 * @FilePath: \Typecho_Theme_JJ\src\store\data.ts
 * 怎么可能会有bug！！！
 */
import { defineStore } from "pinia";

export const useDataStore = defineStore("data", {
  state() {
    return {
      scrollY: 0, // Y滚动条位置
    };
  },
  getters: {
    getScrollY(state) {
      return state.scrollY;
    },
  },
  actions: {
    setScrollY(y: number) {
      this.scrollY = y;
    },
  },
});
