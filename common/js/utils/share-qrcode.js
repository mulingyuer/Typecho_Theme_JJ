/*
 * @Author: mulingyuer
 * @Date: 2021-05-16 18:20:16
 * @LastEditTime: 2021-05-16 20:23:27
 * @LastEditors: mulingyuer
 * @Description: 分享二维码
 * @FilePath: \JJ\common\js\utils\share-qrcode.js
 * 怎么可能会有bug！！！
 */

class ShareQRCdoe {
  constructor(options = {}) {
    this.initConfig(options);
    this.addElementClick();
    document.removeEventListener("click", this.docmentOff.bind(this));
    document.addEventListener("click", this.docmentOff.bind(this), false);
  }

  //初始化参数
  initConfig(options) {
    //全局存储对象 - 防止重复
    if (!window.$ShareQRCdoe) {
      window.$ShareQRCdoe = new Map();
    }
    this.shareMap = window.$ShareQRCdoe;

    const keys = Object.keys(options);
    if (!keys.length) throw new Error("ShareQRCdoe的参数不正确或者为空，需要配置参数！");
    if (typeof options.elements !== "object" || typeof options.elements[Symbol.iterator] !== "function") {
      throw new Error('elements配置项必须为数组或类数组参数，如：jq $("xxx")对象，array对象');
    } else {
      options.elements = [...options.elements]; //转成数组
    }
    if (typeof options.appendClass !== "string" && options.appendClass !== "") {
      throw new Error("appendClass配置项不能为空，请填写正确的二维码图片插入位置class名称");
    };
    this.options = Object.assign({
      stop: false, //是否阻止冒泡
      qrConfig: {
        size: 200,
        background: "transparent"
      }
    }, options);
  }

  //添加click事件
  addElementClick() {
    this.options.elements.forEach(el => {
      if (window.$ShareQRCdoe.has(el)) return;
      window.$ShareQRCdoe.set(el, { show: false, qrcode: "" });
      el.addEventListener("click", (event) => {
        if (this.options.stop) event.stopPropagation();   //阻止冒泡

        const that = event.currentTarget;
        const mapData = window.$ShareQRCdoe.get(that);
        //显示&隐藏
        if (!mapData.show) {
          this.options.hideClass && that.classList.remove(this.options.hideClass);
          this.options.showClass && that.classList.add(this.options.showClass);
          mapData.show = true;
          //生成二维码
          if (!mapData.qrcode) {
            this.createQRCode(that, that.dataset.link).then(qrcode => {
              mapData.qrcode = qrcode;
            });
          }
        } else {
          this.options.showClass && that.classList.remove(this.options.showClass);
          this.options.hideClass && that.classList.add(this.options.hideClass);
          mapData.show = false;
        }

      }, false);
    });
  }

  //生成二维码
  createQRCode(el, link) {
    return new Promise((resolve, reject) => {
      if (!link) {
        console.log(el, "该元素缺少data-link属性！");
        return reject(false);
      };
      const appendBody = el.getElementsByClassName(this.options.appendClass);
      if (!appendBody.length) {
        console.log(el, `该元素appendClass:${this.options.appendClass}不存在！`);
        return reject(false);
      };
      if (!this.qrious) {
        if (!window.$ShareQrious) {
          const qrious = new QRious();
          qrious.background = this.options.qrConfig.background;
          qrious.size = this.options.qrConfig.size;
          window.$ShareQrious = qrious;
        }
        this.qrious = window.$ShareQrious;
      }
      this.qrious.value = link;
      const qrcodeUrl = this.qrious.toDataURL();
      appendBody[0].innerHTML = `<img src="${qrcodeUrl}" alt="二维码">`;
      return resolve(qrcodeUrl);
    });
  }


  //全局关闭事件
  docmentOff(event) {
    let flag = true;
    for (let [key] of this.shareMap) {
      if (key.contains(event.target)) {
        flag = false;
        break;
      }
    };
    //如果点击的还是share则不进行关闭
    if (flag) {
      this.shareMap.forEach((val, key) => {
        if (val.show) {
          this.options.showClass && key.classList.remove(this.options.showClass);
          this.options.hideClass && key.classList.add(this.options.hideClass);
          val.show = false;
        }
      });
    }
  }

}
