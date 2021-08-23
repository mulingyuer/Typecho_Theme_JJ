/*
 * @Author: mulingyuer
 * @Date: 2021-08-23 14:10:05
 * @LastEditTime: 2021-08-23 14:38:17
 * @LastEditors: mulingyuer
 * @Description: 遮罩
 * @FilePath: \JJ\src\packages\mask.js
 * 怎么可能会有bug！！！
 */

export default class Mask {
  $mask = null; //遮罩层dom
  options = {
    maskClose: true, //点击遮罩层关闭
    zIndex: 4, //层级
  }

  constructor(options = {}) {
    Object.assign(this.options, options);
  }

  //创建mask元素并插入body
  create() {
    const mask = document.createElement("div");
    mask.classList.add("mask");
    mask.style.cssText = `position:fixed;top:0;left:0;width:100%;height:100%;background-color: rgba(0, 0, 0, 0.3);z-index:${this.options.zIndex};transition:opacity 0.25s;display:none;`;
    document.body.append(mask);
    this.$mask = mask;
  }

  //显示遮罩
  show() {
    if (!this.$mask) this.create();

    this.$mask.style.opacity = 0;
    this.$mask.style.display = "block";

    this.$mask.offsetWidth;

    this.$mask.style.opacity = 1;
  }

  //隐藏遮罩
  hide() {
    if (!this.$mask) return;

    const callback = () => {
      this.$mask.style.display = "none";
      this.$mask.removeEventListener("transitionend", callback);
      this.$mask.remove();
      this.$mask = null;
    }
    this.$mask.addEventListener("transitionend", callback);

    this.$mask.style.opacity = 1;
    this.$mask.style.display = "block";

    this.$mask.offsetWidth;

    this.$mask.style.opacity = 0;
  }
}
