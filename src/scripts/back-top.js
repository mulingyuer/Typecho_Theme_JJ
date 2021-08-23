/*
 * @Author: mulingyuer
 * @Date: 2021-08-01 19:17:39
 * @LastEditTime: 2021-08-01 19:32:22
 * @LastEditors: mulingyuer
 * @Description:返回顶部
 * @FilePath: \JJ\src\scripts\back-top.js
 * 怎么可能会有bug！！！
 */
import obServer from "@/scripts/watch";

export default class BackTop {
  options = {
    el: "#fixed-tool .top",
    top: 300,
    className: "show"
  };

  constructor(options = {}) {
    this.init(options)
  }

  //初始化
  init(options) {
    Object.assign(this.options, options);   //合并配置

    this.$el = document.querySelector(this.options.el);
    if (!this.$el) throw new Error("返回顶部元素不存在")

    //添加事件
    this.addEvent();
    //监听
    this.watch(this.handleBackTop)
  }

  addEvent() {
    this.$el.addEventListener("click", this.backTop)
  }

  //返回顶部
  backTop = () => {
    const beginTime = Date.now();
    const beginValue = document.documentElement.scrollTop;
    const rAF =
      window.requestAnimationFrame || ((func) => setTimeout(func, 16));
    const frameFunc = () => {
      const progress = (Date.now() - beginTime) / 500;
      if (progress < 1) {
        document.documentElement.scrollTop = beginValue * (1 - this.easeInOutCubic(progress));
        rAF(frameFunc);
      } else {
        document.documentElement.scrollTop = 0;
      }
    };
    rAF(frameFunc);
  }

  cubic(value) {
    return Math.pow(value, 3);
  }

  easeInOutCubic(value) {
    return value < 0.5 ? this.cubic(value * 2) / 2 : 1 - this.cubic((1 - value) * 2) / 2;
  }


  //监听事件
  watch(fn) {
    obServer.watch("scrollTop", fn, true)
  }

  //处理逻辑
  handleBackTop = (newVal, oldVal) => {
    const hasClass = this.$el.classList.contains(this.options.className);

    if (newVal > oldVal) {
      //往下
      if (newVal >= this.options.top) {
        !hasClass && this.$el.classList.add(this.options.className);
      }

    } else if (newVal < oldVal && oldVal !== 0) {
      //往上
      hasClass && this.$el.classList.remove(this.options.className);

    } else {
      //首次
      if (newVal >= this.options.top) {
        !hasClass && this.$el.classList.add(this.options.className);
      }

    }
  }
}
