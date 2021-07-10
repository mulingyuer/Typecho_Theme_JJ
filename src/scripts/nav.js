/*
 * @Author: mulingyuer
 * @Date: 2021-07-09 22:54:14
 * @LastEditTime: 2021-07-10 21:12:14
 * @LastEditors: mulingyuer
 * @Description: 导航nav
 * @FilePath: \JJ\src\scripts\nav.js
 * 怎么可能会有bug！！！
 */
import $ from "jquery";
import { createPopper } from '@popperjs/core';
import BetterScroll from "@better-scroll/core";
import FixedCollect from "@/packages/fixed-collect";


export class Nav {
  options = {
    wrap: '#fixed-top-nav', //容器
    scrollWrap: "#fixed-top-nav-scroll-wrap", //滚动容器
    scrollWrapContent: ".scroll-wrap-content", //滚动的内容容器
    button: '.tooltip ', //按钮
    tooltip: '.tooltip-children', //tooltip菜单
    popperOptions: {
      placement: 'bottom-start', //弹出方向
    },
  };

  constructor(options = {}) {
    this.init(options);
  }

  //初始化
  init(options) {
    this.popperWeakMap = new WeakMap();; //已初始化的Popper
    Object.assign(this.options, options); //合并配置
    //获取dom
    this.$wrap = $(this.options.wrap);
    this.$buttons = this.$wrap.find(this.options.button);


    this.addButtonEvent();  //添加popper
    this.initRollingHorizontally(); //初始化横向滚动
  }

  //butoon的事件
  addButtonEvent() {
    this.$buttons.each((index, button) => {
      const tooltip = button.querySelector(this.options.tooltip);
      if (!tooltip) return;

      //添加mouseenter
      button.addEventListener("mouseenter", this.onShowTooltip)

      //添加mouseenter
      button.addEventListener("mouseleave", this.onHideTooltip)

      //添加click
      button.addEventListener("click", this.onClickTarget);
    })
  }

  //显示tooltip
  onShowTooltip = (event) => {
    const target = event.currentTarget;
    //不存在就初始化
    if (!this.popperWeakMap.has(target)) {
      const tooltip = target.querySelector(this.options.tooltip);
      const popper = createPopper(target, tooltip, this.options.popperOptions);
      //存储
      this.popperWeakMap.set(target, { tooltip, popper, time: null });
    }

    //显示逻辑
    const weakMap = this.popperWeakMap.get(target);
    if (weakMap) {
      //优化-popper启用事件监听
      weakMap.popper.setOptions({
        modifiers: [{ name: 'eventListeners', enabled: true }],
      });
      weakMap.popper.update();

      //显示逻辑
      const tooltip = weakMap.tooltip;
      if (!tooltip.classList.contains("show")) {
        tooltip.style.display = "block";

        if (weakMap.time) clearTimeout(weakMap.time);  //清除之前定时器
        weakMap.time = setTimeout(() => {
          tooltip.classList.add("show");
        }, 20)
      }
    }
  }


  //隐藏tooltip
  onHideTooltip = (event) => {
    const target = event.currentTarget;
    const weakMap = this.popperWeakMap.get(target);
    if (weakMap) {
      const tooltip = weakMap.tooltip;
      //删除类名
      if (tooltip.classList.contains("show")) {
        tooltip.classList.remove("show");

        if (weakMap.time) clearTimeout(weakMap.time);  //清除之前定时器
        weakMap.time = setTimeout(() => {
          tooltip.style.display = "none";
          //优化-禁用popper的事件监听
          weakMap.popper.setOptions({
            modifiers: [{ name: 'eventListeners', enabled: false }],
          });
        }, 300)
      }
    }
  }

  //添加点击跳转事件
  onClickTarget(event) {
    const target = event.currentTarget;
    const href = target.dataset.link;
    location.href = href;
  }

  //初始化横向滚动
  initRollingHorizontally() {
    const { scrollWrap, scrollWrapContent } = this.options;
    //设置容器实际宽度
    this.$scrollWrapContent = document.querySelector(`${scrollWrap}>${scrollWrapContent}`);
    this.$scrollWrapContent.style.width = this.$scrollWrapContent.scrollWidth + "px";
    //初始化
    this.$scrollWrap = new BetterScroll(scrollWrap, {
      scrollX: true,//x轴滚动
      click: true, //允许点击
    })
  }
}

//收起header
export class CollectNav extends FixedCollect {
  options = {
    wrap: '#fixed-top-nav',
    top: 500,
    className: "visible",
  }

  constructor(options = {}) {
    super();

    this.init(options);
  }

  init(options) {
    Object.assign(this.options, options);

    super.init(this.options);
  }

}
