/*
 * @Author: mulingyuer
 * @Date: 2021-07-04 18:58:24
 * @LastEditTime: 2021-07-09 23:00:02
 * @LastEditors: mulingyuer
 * @Description: header脚本
 * @FilePath: \JJ\src\scripts\header.js
 * 怎么可能会有bug！！！
 */
import $ from "jquery";
import Dropdown from "@/packages/dropdown";
import SearchRecord from "@/utils/search-record";


//导航菜单
export class MainNav extends Dropdown {
  options = {
    wrap: '#header',
    menu: '.mobile-show-menu',
    list: '.mobile-hide',
  }
  constructor(config = {}) {
    super();
    this.init(config);
  }

  //初始化
  init(config) {
    Object.assign(this.options, config); //合并参数
    super.init(this.options);
  }
}

// 搜索框
export class Search {
  options = {
    elForm: "#header .search-form", //form选择器
    elInput: ".search-form .search-input", //input选择器
    subBtn: ".search-form .search-btn",  //搜索按钮
    recordWrap: ".search-form .typehead",  //历史记录容器
    clearBtn: ".search-form .clear", //清理按钮
    recordList: ".search-form .typehead .list", //搜索列表
  };

  constructor(options = {}) {
    this.init(options);  //初始化
    this.addEvent();  //添加事件
  }

  //初始化
  init(options) {
    Object.assign(this.options, options);  //合并配置

    this.$form = $(this.options.elForm);   //form
    this.$input = $(this.options.elInput);   //input
    this.$submit = $(this.options.subBtn);   //submit
    this.$recordWrap = $(this.options.recordWrap);   //submit
    this.$clearBtn = $(this.options.clearBtn);   //clear
    this.$recordList = $(this.options.recordList);   //recordList

    this.data = new SearchRecord();  //搜索数据
  }

  //添加事件
  addEvent() {
    //阻止回车按下时提交表单
    this.$form.on("keydown", (event) => {
      if (event.key.toLocaleLowerCase() === "enter") {
        event.preventDefault();
      }
    });

    //回车回位时触发搜索
    this.$form.on("keyup", (event) => {
      if (event.key.toLocaleLowerCase() === "enter") {
        this.submit();
      }
    });

    //搜索按钮点击事件
    this.$submit.on("click", this.submit.bind(this));

    //input的focus事件
    this.$input.on("focus", this.showRecord.bind(this));

    //清空按钮事件
    this.$clearBtn.on("click", () => {
      this.data.clear();
      this.showRecord();
    });

    //历史记录点击事件
    this.$recordList.on("click", (event) => {
      const value = $(event.target).text();
      this.$input.val(value);  //input赋值

      this.submit();
      this.hideRecord();
    });


  }

  //记录数据并显示
  submit() {
    const value = this.$input.val();
    if (value !== "") {
      this.data.push(value); //记录
      this.$form[0].submit();  //手动提交
    }
  }

  //显示历史记录
  showRecord() {
    if (this.data.size > 0) {
      const innerHtml = this.data.getSearchData().map((value) => {
        return `<div>${value}</div>`;
      }).join("");
      this.$recordList.html(innerHtml);  //更新内容

      if (!this.$recordWrap.hasClass("show")) {
        this.$recordWrap.addClass("show");
      }

      //添加其他区域事件
      this.addOtherEvent();
    } else {
      this.hideRecord();
    }
  }

  //隐藏历史记录
  hideRecord() {
    if (this.$recordWrap.hasClass("show")) {
      this.$recordWrap.removeClass("show");
      this.removeOtherEvent();  //移除其他区域事件
    }
  }

  //添加其他区域事件-用于关闭历史记录
  addOtherEvent() {
    this.removeOtherEvent();
    document.addEventListener("click", this.otherAreasHideRecord.bind(this))
  }

  //删除其他区域事件
  removeOtherEvent() {
    document.removeEventListener("click", this.otherAreasHideRecord);
  }

  //点击非search区域关闭历史记录
  otherAreasHideRecord(event) {
    if (!this.$form[0].contains(event.target)) {
      this.hideRecord();
    }
  }
}

//博客按钮
export class BlogMenu extends Dropdown {
  options = {
    wrap: '#header',
    menu: '.blog-menu',
    list: '.blog-menu-list',
  }
  constructor(config = {}) {
    super();
    this.init(config);
  }

  //初始化
  init(config) {
    Object.assign(this.options, config); //合并参数
    super.init(this.options);
  }
}