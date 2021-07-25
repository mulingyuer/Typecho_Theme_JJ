/*
 * @Author: mulingyuer
 * @Date: 2021-07-25 21:21:44
 * @LastEditTime: 2021-07-25 21:55:52
 * @LastEditors: mulingyuer
 * @Description: 折叠
 * @FilePath: \JJ\src\scripts\category-collapse.js
 * 怎么可能会有bug！！！
 */

export default class CategoryCollapse {
  options = {
    status: false,  //折叠状态
  };
  constructor(options = {}) {
    Object.assign(this.options, options);

    this.init();
  }

  //初始化
  init() {
    //容器
    this.$wrap = document.querySelector(this.options.wrap);
    if (!this.$wrap) throw new Error("CategoryCollapse：容器元素不存在！")

    //内容
    this.$content = document.querySelector(this.options.content);
    if (!this.$content) throw new Error("CategoryCollapse：内容元素不存在！")
    //触发器
    this.$trigger = document.querySelector(this.options.trigger);
    if (!this.$trigger) throw new Error("CategoryCollapse：触发元素不存在！")
    //展开按钮
    this.$open = this.$wrap.querySelector(".open");
    if (!this.$open) throw new Error("CategoryCollapse：展开按钮不存在！")
    //关闭按钮
    this.$close = this.$wrap.querySelector(".close");
    if (!this.$close) throw new Error("CategoryCollapse：关闭按钮不存在！")

    //添加事件
    this.$trigger.addEventListener("click", this.onToggle.bind(this));
  }


  //切换事件
  onToggle() {
    if (!this.options.status) {  //展开
      this.options.status = true; //更新状态

      this.hideCollapse();

      this.$wrap.addEventListener("transitionend", this.removeTranstionClass); //动画完成移除class

      this.$wrap.classList.add("mu-category-collapse");
      this.$wrap.style.height = this.$content.offsetHeight + "px";

    } else {  //收缩
      this.options.status = false; //更新状态

      this.showCollapse();

      //动画完成移除class
      this.$wrap.addEventListener("transitionend", this.removeTranstionClass);
      this.$wrap.classList.add("mu-category-collapse");
      this.$wrap.style.height = "";

    }
  }

  //移除动画class
  removeTranstionClass = () => {
    this.$wrap.classList.remove("mu-category-collapse");
    this.$wrap.removeEventListener("transitionend", this.removeTranstionClass);
  }

  //显示展开
  showCollapse() {
    if (this.$close.classList.contains("show")) this.$close.classList.remove("show");
    if (!this.$open.classList.contains("show")) this.$open.classList.add("show");
  }

  //关闭展开
  hideCollapse() {
    if (this.$open.classList.contains("show")) this.$open.classList.remove("show");
    if (!this.$close.classList.contains("show")) this.$close.classList.add("show");
  }

}