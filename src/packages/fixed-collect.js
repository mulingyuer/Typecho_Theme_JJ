/*
 * @Author: mulingyuer
 * @Date: 2021-07-10 21:02:25
 * @LastEditTime: 2021-07-10 21:08:42
 * @LastEditors: mulingyuer
 * @Description: 悬浮收起
 * @FilePath: \JJ\src\packages\fixed-collect.js
 * 怎么可能会有bug！！！
 */
import $ from "jquery";
import obServer from "@/scripts/watch";

export default class FixedCollect {
  options = {
    wrap: '',
    top: 500,
    className: "",
  };
  constructor() {
  }

  //初始化
  init(options = {}) {
    Object.assign(this.options, options); //合并配置
    if (this.options.wrap === "") throw new Error("未填写悬浮收缩的容器选择器");
    if (this.options.className === "") throw new Error("未填写悬浮收缩时容器使用的类名");


    this.$wrap = $(this.options.wrap);
    if (this.$wrap.length) {
      this.watch(this.handleHeader)
    }
  }

  //监听事件
  watch(fn) {
    obServer.watch("scrollTop", fn, true)
  }

  //处理逻辑
  handleHeader = (newVal, oldVal) => {
    if (newVal > oldVal) {
      //往下
      if (newVal >= this.options.top) {
        this.$wrap.hasClass(this.options.className) && this.$wrap.removeClass(this.options.className);
      }

    } else if (newVal < oldVal && oldVal !== 0) {
      //往上
      !this.$wrap.hasClass(this.options.className) && this.$wrap.addClass(this.options.className);

    } else {
      //首次
      if (newVal >= this.options.top) {
        this.$wrap.hasClass(this.options.className) && this.$wrap.removeClass(this.options.className);
      }

    }
  }
}