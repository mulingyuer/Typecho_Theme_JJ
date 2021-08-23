/*
 * @Author: mulingyuer
 * @Date: 2021-08-14 18:44:02
 * @LastEditTime: 2021-08-14 22:53:42
 * @LastEditors: mulingyuer
 * @Description: 点赞
 * @FilePath: \JJ\src\scripts\like.js
 * 怎么可能会有bug！！！
 */
import api from "@/packages/request";
import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css";


export default class Like {
  constructor() {
    this.init();
  }

  init() {
    this.$el = document.querySelector("#like-badge");
    if (!this.$el) throw new Error("点赞按钮不存在");


    //添加事件
    this.onClick = this.onClick.bind(this);
    this.$el.addEventListener("click", this.onClick);

  }

  onClick(event) {
    const url = this.$el.dataset["likeHref"];
    api({
      url,
      method: "post",
      data: {
        likeup: this.$el.dataset.cid,
        do_action: "do",//反正挡不住，索性可以一直点赞
      }
    }).then(res => {
      const { count } = res;
      this.$el.setAttribute("badge", count);
      if (!this.$el.classList.contains("active")) {
        this.$el.classList.add("active");
      }

      //通知
      Toastify({
        text: "点赞成功",
        position: "center",
      }).showToast();

    }).catch(err => {
      console.log(err);
    })
  }
}