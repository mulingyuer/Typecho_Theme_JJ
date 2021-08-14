/*
 * @Author: mulingyuer
 * @Date: 2021-08-14 23:05:22
 * @LastEditTime: 2021-08-14 23:11:43
 * @LastEditors: mulingyuer
 * @Description: 灯箱
 * @FilePath: \JJ\src\packages\light-box\index.js
 * 怎么可能会有bug！！！
 */
import "./style.scss";

export default class LightBox {
  options = {
    selector: "",
    mode: "img", //img || wrap
    space: 20, //间隙
    isClose: false, //是否关闭
  };

  constructor(options = {}) {
    this.init(options);
  }

  //初始化
  init(options) {
    Object.assign(this.options, options);
    if (typeof this.options.selector !== "string") {
      throw new Error("selector请输入string类型的元素选择器");
    }

    switch (this.options.mode) {
      case "img":
        this.$imgs = document.querySelectorAll(this.options.selector);
        this.addImgEvent();
        break;
      case "wrap":
        this.$wrap = document.querySelector(this.options.selector);
        this.addWrapEvent();
        break;
      default:
        throw new Error(`${this.options.mode}该模式暂不支持`)
    }
  }

  //添加图片模式事件
  addImgEvent() {
    this.$imgs.forEach(img => {
      img.addEventListener("click", this.onImgClick.bind(this));
    })
  }

  //添加容器模式事件
  addWrapEvent() {
    this.$wrap.addEventListener("click", (event) => {
      const name = event.target.tagName.toLowerCase();
      if (name === "img") this.onImgClick(event);
    })
  }

  //图片点击事件
  onImgClick(event) {
    const name = event.target.tagName.toLowerCase();
    if (name !== "img") return;
    if (this.isClose) return; //关闭中不触发

    this.$img = event.target;
    const rectData = this.$img.getBoundingClientRect(); //初始坐标

    this.hiddenOriginalImg();
    this.pushMask(); //遮罩
    this.addWindowEvent(); //window事件

    //处理尺寸
    const scale = this.calcRatio(rectData);  //获取比例
    const displacement = this.calcDisplacement(rectData, scale); //获取偏移量
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const { width, height, top, left } = rectData;  //页面中的大小和位置

    //克隆
    this.$cloneImg = this.$img.cloneNode(true);
    this.$cloneImg.style.cssText = `position:absolute;top:${scrollTop + top}px;left:${left}px;width:${width}px;height:${height}px;z-index:4;cursor: zoom-out;`;
    //添加关闭事件
    this.$cloneImg.addEventListener("click", this.beforeRemoveAnimation);
    document.body.appendChild(this.$cloneImg);

    setTimeout(() => {
      this.$cloneImg.style.transform = `translate3d(${displacement.x}px,${displacement.y}px,0) scale(${scale})`;
    }, 100)
  }

  //计算比例
  calcRatio(rectData) {
    const { width, height } = rectData;  //页面中的大小
    this.$viewW = document.body.clientWidth; //可视宽度
    this.$viewH = window.innerHeight; //可视高度
    const viewW = this.$viewW - this.options.space * 2;  //减去间隙的可视宽
    const viewH = this.$viewH - this.options.space * 2;  //间隙间隙的可视高

    const snapData = {};  //图片完整显示的大小数据
    if (width > height) {
      snapData.sacle = viewW / width;
      snapData.width = viewW;
      snapData.height = height * snapData.sacle;
    } else {
      snapData.sacle = viewH / height;
      snapData.height = viewH;
      snapData.width = width * snapData.sacle;
    }

    //再次判断是否有超出
    if (snapData.width > viewW) {
      snapData.sacle = viewW / width;
      snapData.width = viewW;
      snapData.height = height * snapData.sacle;
    } else if (snapData.height > viewH) {
      snapData.sacle = viewH / height;
      snapData.height = viewH;
      snapData.width = width * snapData.sacle;
    }

    return snapData.sacle;
  }

  //计算位移
  calcDisplacement(rectData, sacle) {
    const { width, height, top, left } = rectData;  //页面中的大小和位置

    //图片中心点
    const imgCenter = {
      x: left + (width / 2),
      y: top + (height / 2)
    }

    //视口中心点
    const viewCenter = {
      x: this.$viewW / 2,
      y: this.$viewH / 2
    }

    return {
      x: viewCenter.x - imgCenter.x,
      y: viewCenter.y - imgCenter.y
    }
  }

  //插入遮罩
  pushMask() {
    if (!this.$mask) {
      this.$mask = document.createElement("div");
      this.$mask.classList.add("light-box-mask");
    }
    //添加关闭事件
    this.$mask.addEventListener("click", this.beforeRemoveAnimation);
    //插入
    document.body.appendChild(this.$mask);
    setTimeout(() => {
      this.$mask.classList.add("show");
    }, 100)
  }

  //移除遮罩
  removeMask() {
    this.$mask.remove();
    // this.$mask = null;
  }

  //移除图片
  removeCloneImg() {
    this.$cloneImg.remove();
    this.$cloneImg = null;
  }

  //移除前的动画
  beforeRemoveAnimation = (event) => {
    event.stopPropagation();  //阻止冒泡
    this.isClose = true; //关闭中
    // 移除事件
    this.$mask.removeEventListener("click", this.beforeRemoveAnimation);
    this.$cloneImg.removeEventListener("click", this.beforeRemoveAnimation);
    this.removeWindowEvent();
    //动画
    this.$mask.classList.remove("show");
    this.$cloneImg.style.transform = `translate3d(0px,0px,0) scale(1)`;
    setTimeout(() => {
      this.removeCloneImg();
      this.removeMask();
      this.showOriginalImg();
      this.isClose = false; //关闭中
    }, 320)
  }

  //添加滚动和窗口事件
  addWindowEvent() {
    window.addEventListener("resize", this.beforeRemoveAnimation);
    window.addEventListener("scroll", this.beforeRemoveAnimation);
  }

  //移除滚动和窗口事件
  removeWindowEvent() {
    window.removeEventListener("resize", this.beforeRemoveAnimation);
    window.removeEventListener("scroll", this.beforeRemoveAnimation);
  }

  //隐藏原图
  hiddenOriginalImg() {
    this.$img.style.visibility = "hidden";
  }

  //显示原图
  showOriginalImg() {
    this.$img.style.visibility = "visible";
    this.$img = null;
  }
}