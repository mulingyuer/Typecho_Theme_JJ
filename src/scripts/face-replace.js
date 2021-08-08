/*
 * @Author: mulingyuer
 * @Date: 2021-08-08 15:19:15
 * @LastEditTime: 2021-08-08 15:41:57
 * @LastEditors: mulingyuer
 * @Description:表情替换
 * @FilePath: \JJ\src\scripts\face-replace.js
 * 怎么可能会有bug！！！
 */
import { getFaceData, getType } from "@/utils/tool";

export default class FaceReplace {
  options = {
    el: ["#my-custom-comment"]
  }

  constructor(options = {}) {
    this.init(options);
  }


  //初始化
  init(options) {
    Object.assign(this.options, options);   //合并配置

    //获取替换的dom
    if (getType(this.options.el) !== "array") {
      throw new Error("表情替换选择器必须是一个数组参数");
    }
    this.$el = this.options.el.map(item => document.querySelector(item));

    //初始化表情数据
    this.initFaceData();
  }

  //表情数据初始化
  async initFaceData() {
    try {
      //拿到所有图片表情键值对
      const arr = await getFaceData();
      this.faceData = {};
      arr.filter(item => item.type !== "text").forEach(item => {
        Object.assign(this.faceData, item.children);
      })

      //表情替换
      this.faceReplace();
    } catch (error) {
      throw error;
    }
  }


  //表情替换
  faceReplace() {
    //遍历dom进行正则匹配替换
    const reg = /\[(.*?)\]/g;
    const themePath = window.$theme_path;  //主题目录

    this.$el.forEach(item => {
      let html = item.innerHTML;

      const newHtml = html.replace(reg, (match, param) => {
        const face = this.faceData[param];
        if (face) {
          return `<img src="${themePath}/static${face}">`
        }
        return match;
      });

      //更新
      item.innerHTML = newHtml;
    })
  }

}
