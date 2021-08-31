/*
 * @Author: mulingyuer
 * @Date: 2021-08-23 11:51:21
 * @LastEditTime: 2021-08-31 21:57:31
 * @LastEditors: mulingyuer
 * @Description: 抽屉搜索
 * @FilePath: \JJ\src\scripts\drawer-search.js
 * 怎么可能会有bug！！！
 */
import { Search } from "./header";
import Mask from "@/packages/mask";

export default class DrawerSearch {
  options = {
    wrap: "#drawer-search",
    content: "#drawer-search .drawer-search-content",
    taggerBnt: "#header .search-icon",
    form: {
      elForm: "#drawer-search .search-form", //form选择器
      elInput: "#drawer-search .search-form .search-input", //input选择器
      subBtn: "#drawer-search .search-form .search-btn",  //搜索按钮
      recordWrap: "#drawer-search .search-form .typehead",  //历史记录容器
      clearBtn: "#drawer-search .search-form .clear", //清理按钮
      recordList: "#drawer-search .search-form .typehead .list", //搜索列表
    },
    maskClose: true, //点击遮罩层关闭
    allowWrapNone: true, //允许容器不存在
  }

  constructor(options = {}) {
    Object.assign(this.options, options);

    this.initSearch();  //初始化搜索
    this.$mask = new Mask();  //初始化遮罩
    this.addClickEvent();  //添加点击事件
  }

  //初始化搜索
  initSearch() {
    this.$search = new Search(this.options.form);
  }

  //增加点击事件
  addClickEvent() {
    this.$wrap = document.querySelector(this.options.wrap);
    this.$content = document.querySelector(this.options.content);
    this.$btn = document.querySelector(this.options.taggerBnt);
    if (this.options.allowWrapNone && !this.$wrap && !this.$btn) return;

    if (!this.$wrap) throw new Error("抽屉容器不存在");
    if (!this.$content) throw new Error("抽屉主体容器不存在");
    if (!this.$btn) throw new Error("抽屉触发容器不存在");

    this.showDrawer = this.showDrawer.bind(this);  //改变this指向
    this.$btn.addEventListener("click", this.showDrawer)

  }

  //显示抽屉
  showDrawer() {
    this.$mask.show();
    this.addMaskOneClick();

    this.$wrap.style.display = "block";
    this.$content.style.opacity = 0;
    this.$content.style.transform = "translateY(-100%)";

    this.$wrap.offsetWidth;

    this.$content.style.opacity = 1;
    this.$content.style.transform = "translateY(0)";
  }

  //隐藏抽屉
  hideDrawer() {
    this.$mask.hide();

    const callback = () => {
      this.$wrap.style.display = "none";
      this.$wrap.removeEventListener("transitionend", callback);
    }
    this.$wrap.addEventListener("transitionend", callback);

    this.$wrap.style.display = "block";
    this.$content.style.opacity = 1;

    this.$wrap.offsetWidth;

    this.$content.style.opacity = 0;
    this.$content.style.transform = "translateY(-100%)";
  }


  //添加单次点击事件
  addMaskOneClick() {
    const onece = () => {
      this.hideDrawer();
      this.$mask.$mask.removeEventListener("click", onece);
    }

    this.$mask.$mask.addEventListener("click", onece);
  }

}
