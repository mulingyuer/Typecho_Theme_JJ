/*
 * @Author: mulingyuer
 * @Date: 2021-07-09 22:10:05
 * @LastEditTime: 2021-07-09 23:18:18
 * @LastEditors: mulingyuer
 * @Description: popper类
 * @FilePath: \JJ\src\packages\popper.js
 * 怎么可能会有bug！！！
 */
import { createPopper } from '@popperjs/core';



export default class Popper {
  options = {
    placement: 'bottom',  //弹出方向
  };

  constructor(button = null, tooltip = null, options = {}) {
    this.init(button, tooltip, options);
  }

  //初始化
  init(button, tooltip, options) {
    if (!button || !tooltip) throw new Error("dom元素不存在，初始化失败！");
    Object.assign(this.options, options); //合并配置

    //初始化
    this.$popper = createPopper(button, tooltip, this.options.placement);
  }

}