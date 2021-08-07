/*
 * @Author: mulingyuer
 * @Date: 2021-08-08 02:00:41
 * @LastEditTime: 2021-08-08 04:23:56
 * @LastEditors: mulingyuer
 * @Description: 表情
 * @FilePath: \JJ\src\scripts\face.js
 * 怎么可能会有bug！！！
 */
import { createPopper } from '@popperjs/core';
import { getFaceData } from "@/utils/tool";
import ImgLazyload from "@/packages/img-lazyload";



export default class Face {
  options = {
    btn: "#face-btn",
    tooltip: "#face-tooltip",
    popperStatus: false, //初始化状态
    config: {
      placement: 'bottom',
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [0, 8],
          },
        },
      ]
    }

  }

  constructor(options = {}) {
    this.init(options);
  }

  //初始化
  init(options) {
    Object.assign(this.options, options);  //合并配置

    const { btn, tooltip, placement } = this.options;
    this.$btn = this.query(btn);
    if (!this.$btn) throw new Error("表情菜单触发按钮不存在");

    this.$tooltip = this.query(tooltip);
    if (!this.$tooltip) throw new Error("表情菜单不存在");
    // document.body.appendChild(this.$tooltip);

    this.$btn.addEventListener("click", this.btnClick); //添加按钮事件

    //表情数据初始化
    this.initFaceData();
  }

  //按钮事件
  btnClick = (event) => {
    if (!this.isClass(this.$tooltip, "show")) {  //显示
      this.showTooltip();

    } else {
      this.hideTooltip();
    }
  }

  //显示表情菜单
  showTooltip() {
    this.$tooltip.classList.add("show");

    if (!this.options.popperStatus) {
      //首次初始化
      this.$popper = createPopper(this.$btn, this.$tooltip, this.options.config);
    } else {
      //开启事件监听
      this.$popper.setOptions({
        modifiers: [{ name: 'eventListeners', enabled: true }],
      });
      this.$popper.update();
    }

    //点击其他区域关闭
    document.addEventListener("click", this.outhHide);
  }

  //隐藏表情菜单
  hideTooltip() {
    this.$tooltip.classList.remove("show");
    //关闭事件监听
    this.$popper.setOptions({
      modifiers: [{ name: 'eventListeners', enabled: false }],
    });

    //移除点击其他区域关闭
    document.removeEventListener("click", this.outhHide);
  }

  //点击其他区域关闭表情菜单
  outhHide = (event) => {
    const isContains = this.$tooltip.contains(event.target);  //是否点击是表情菜单
    const isBtn = this.$btn.contains(event.target);  //是否点击是表情触发按钮
    const isShow = this.isClass(this.$tooltip, "show");  //表情菜单是否显示

    if (!isContains && !isBtn && isShow) {
      this.hideTooltip();
    }
  }

  //表情数据初始化
  async initFaceData() {
    try {
      //获取表情数据
      this.faceData = await getFaceData();

      //生成元素文本
      const themePath = window.$theme_path;  //主题目录
      let faceHeadHtml = "";
      let facebodyHtml = "";
      this.faceData.forEach((item, index) => {

        if (item.type === "text") {
          faceHeadHtml += `<label for="${item.id}" class="${index === 0 ? "active" : ""}">${item.name}</label>`;
          facebodyHtml += `<input type="radio" name="face" id="${item.id}" ${index === 0 ? "checked" : ""}>`;

          let faceText = "";
          item.children.forEach(child => {
            faceText += `<span data-id="${child}" data-type="text">${child}</span>`;
          });
          facebodyHtml += `<div class="face-tooltip-wrap">${faceText}</div>`

        } else if (item.type === "image") {
          faceHeadHtml += `<label for="${item.id}"  class="${index === 0 ? "active" : ""}">
            <img src="${themePath}/static${item.src}"/>
          </label>`;
          facebodyHtml += `<input type="radio" name="face" id="${item.id}" ${index === 0 ? "checked" : ""}>`;

          let faceImage = "";
          Object.keys(item.children).forEach(key => {
            faceImage += `<span data-id="${key}" data-type="image"><img data-src="${themePath}/static${item.children[key]}" src="${themePath}/static/images/emote/loading.gif"></span>`;
          })
          facebodyHtml += `<div class="face-tooltip-wrap">${faceImage}</div>`
        }

      })

      //插入dom
      this.$tooltip.querySelector(".face-tooltip-head").innerHTML = faceHeadHtml;
      this.$tooltip.querySelector(".face-tooltip-scroll").innerHTML = facebodyHtml;

      //表情懒加载
      const images = this.$tooltip.querySelectorAll("img[data-src]");
      this.$lazyload = new ImgLazyload({
        specify: true, //指定
        imgDoms: images,
      });

      //获取label
      this.$label = this.$tooltip.querySelectorAll(".face-tooltip-head label");
      this.$label.forEach(item => item.addEventListener("click", this.labelClick));  //click

    } catch (error) {
      throw error;
    }
  }

  //label点击事件
  labelClick = (event) => {
    const target = event.currentTarget;

    //删除class
    this.labelRemoveClass();

    target.classList.add("active");  //添加
  }

  //label清理class
  labelRemoveClass(className = "active") {
    this.$label.forEach(item => item.classList.remove(className));
  }

  //获取元素
  query(selector) {
    return document.querySelector(selector);
  }

  //是否存在class
  isClass(dom, className) {
    return dom.classList.contains(className);
  }

}