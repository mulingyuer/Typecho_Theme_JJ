/*
 * @Author: mulingyuer
 * @Date: 2021-07-04 21:52:00
 * @LastEditTime: 2021-07-09 21:59:40
 * @LastEditors: mulingyuer
 * @Description: 下拉菜单类
 * @FilePath: \JJ\src\utils\dropdown.js
 * 怎么可能会有bug！！！
 */
import $ from "jquery";

export default class Dropdown {
  options = {
    wrap: '',
    menu: '',
    list: '',
  }
  constructor() {
    // this.init(options);
  }

  //初始化
  init(conifg = {}) {
    Object.assign(this.options, conifg);  //合并配置
    const { wrap, menu, list } = this.options;

    this.$menu = $(`${wrap} ${menu}`);
    this.$list = $(`${wrap} ${list}`);

    if (this.$menu.length && this.$list.length) {
      //按钮事件
      this.$menu.on("click", (event) => {
        event.stopPropagation();  //阻止冒泡
        if (this.$list.hasClass("show")) {
          this.hideList();
        } else {
          this.showList();
        }
      });

      //菜单事件
      this.$list.on("click", (event) => {
        event.stopPropagation();  //阻止冒泡
        if (this.$list.hasClass("show")) {
          this.hideList();
        }
      });
    } else {
      // throw new Error("下拉菜单初始化失败，没有找到dom元素");
    }
  }

  //显示菜单
  showList() {
    this.$list.addClass("show");
    this.addOuthHide();
  }

  //隐藏菜单
  hideList() {
    this.$list.removeClass("show");
    this.offOuthHide();
  }

  //点击其他区域关闭
  addOuthHide() {
    document.addEventListener("click", this.outhHide);
  }

  //点击其他区域关闭方法
  outhHide = (event) => {
    if (!this.$menu[0].contains(event.target) && this.$list.hasClass("show")) {
      this.hideList();
    }
  }

  //关闭点击其他区域关闭
  offOuthHide() {
    document.removeEventListener("click", this.outhHide);
  }
}
