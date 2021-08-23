/*
 * @Author: mulingyuer
 * @Date: 2021-08-01 16:28:58
 * @LastEditTime: 2021-08-01 19:03:36
 * @LastEditors: mulingyuer
 * @Description:登录弹窗
 * @FilePath: \JJ\src\scripts\login-dialog.js
 * 怎么可能会有bug！！！
 */
export default class LoginDialog {
  options = {
    el: "#login-dialog",
    content: "#login-dialog .auth-form",
    tagger: ["#header .login", "#header .login-btn", "#login-dialog .close"],
    maskClose: true, //点击遮罩层关闭
    allowWrapNone: true, //允许容器不存在
  }

  constructor(options = {}) {
    this.init(options)
  }

  //初始化
  init(options) {
    Object.assign(this.options, options);  //合并配置
    this.show = false;
    this.status = false;  //进行中-防止重复触发

    this.$wrap = document.querySelector(this.options.el);
    if (this.options.allowWrapNone && !this.$wrap) return;
    if (!this.$wrap) throw new Error("登录弹窗容器不存在");

    this.$content = document.querySelector(this.options.content);
    if (!this.$content) throw new Error("登录弹窗内容容器不存在");

    this.$tagger = this.options.tagger.slice().map(selector => document.querySelector(selector)).filter(item => item);
    if (!this.$tagger || this.$tagger.length <= 0) throw new Error("登录弹窗触发器不存在");

    //添加show事件
    this.addEvent();
  }

  //添加事件
  addEvent() {
    this.$tagger.forEach(item => {
      item.addEventListener("click", this.onTagger);
    });

    //遮罩层关闭事件
    if (this.options.maskClose) {
      this.$wrap.addEventListener("click", (event) => {
        if (!this.$content.contains(event.target)) {
          this.onTagger();
        }
      })
    }
  }

  //tagger事件
  onTagger = async () => {
    if (!this.status) {
      this.status = true; //进行中

      if (this.show) {
        this.contentHide();
        await this.wrapHide();

        this.show = false;
      } else {
        this.wrapShow();
        await this.contentShow();

        this.show = true;
      }

      this.status = false;
    }
  }

  //wrap显示
  wrapShow() {
    return new Promise((resolve, reject) => {
      this.$wrap.style.opacity = 0;
      this.$wrap.style.display = "block";

      this.$wrap.offsetWidth;

      this.$wrap.style.opacity = "";

      return resolve(true)
    })
  }

  //wrap 隐藏
  wrapHide() {
    return new Promise((resolve, reject) => {
      this.$wrap.style.opacity = 1;
      this.$wrap.style.display = "block";
      const callback = () => {
        this.$wrap.style.display = "";
        this.$wrap.removeEventListener("transitionend", callback);

        return resolve(true);
      };
      this.$wrap.addEventListener("transitionend", callback)

      this.$wrap.offsetWidth;

      this.$wrap.style.opacity = 0;
    })
  }

  //content 显示
  contentShow() {
    return new Promise((resolve, reject) => {
      this.$content.style.opacity = 0;
      this.$content.style.display = "block";
      this.$content.style.transform = "translateY(10%)";

      this.$content.offsetWidth;

      this.$content.style.opacity = "";
      this.$content.style.transform = "";

      return resolve(true)
    })
  }

  //content 隐藏
  contentHide() {
    return new Promise((resolve, reject) => {
      this.$content.style.opacity = "";
      this.$content.style.transform = "";
      this.$content.style.display = "block";
      const callback = () => {
        this.$content.style.display = "none";
        this.$content.removeEventListener("transitionend", callback);

        return resolve(true);
      }
      this.$content.addEventListener("transitionend", callback)


      this.$content.offsetWidth;

      this.$content.style.opacity = 0;
      this.$content.style.transform = "translateY(10%)";
    })

  }
}
