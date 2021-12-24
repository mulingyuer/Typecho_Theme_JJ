/*
 * @Author: mulingyuer
 * @Date: 2021-07-24 23:32:45
 * @LastEditTime: 2021-07-25 01:07:12
 * @LastEditors: mulingyuer
 * @Description: 无限加载
 * @FilePath: \JJ\src\packages\illimited-load.js
 * 怎么可能会有bug！！！
 */
import obServer from "@/scripts/watch";

export default class IllimitedLoad {
  options = {
    space: 50, //间隙
    runStatus: false, //是否运行了回调
    callback: () => { },
  }

  constructor(options = {}) {
    Object.assign(this.options, options);

    this.init();
  }

  //初始化
  init() {
    //监听
    this.watch(this.isRunCallback)
  }

  //判断是否运行回调
  isRunCallback = (scrollTop) => {
    const offsetHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight); // 内容高度
    //视窗高度
    const clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 0;
    //距离底部的距离
    const disparity = offsetHeight - clientHeight - scrollTop - this.options.space;
    if (disparity <= 0 && !this.options.runStatus) {
      this.options.runStatus = true;
      this.options.callback(this.resetWatch);
    }
  }

  //监听
  watch(fn) {
    obServer.watch("scrollTop", fn, true)
  }

  //恢复监听
  resetWatch = () => {
    this.options.runStatus = false;
  }
}
