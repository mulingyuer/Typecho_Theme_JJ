/*
 * @Author: mulingyuer
 * @Date: 2021-04-16 11:32:30
 * @LastEditTime: 2021-05-03 01:01:57
 * @LastEditors: mulingyuer
 * @Description: 图片懒加载
 * @FilePath: \JJ\common\js\utils\img-lazyload.js
 * 怎么可能会有bug！！！
 */


class ImgLazyLoad {
  constructor(elements = [], callback = () => { }, options = {}) {
    this.imageElements = new Set([...elements]); //类数组转set
    this.callback = callback;
    //初始化
    this.init(options);
  }
  //初始化
  init(options) {
    if ("IntersectionObserver" in window) {
      this._lazyImageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            //处于可见状态
            const lazyImage = entry.target;
            lazyImage.src = lazyImage.dataset.src;
            lazyImage.removeAttribute("data-src");
            // 移除掉已经显示的          
            this.imageElements.delete(lazyImage);
            this._lazyImageObserver.unobserve(lazyImage);  //取消监听
            //运行回调
            this.callback(lazyImage);
          }
        });
      }, options);
      //监听图片元素
      this.imageElements.forEach(img => this._lazyImageObserver.observe(img));
    } else {
      this.inViewShow();
      this._debounce = this.debounce(this.inViewShow, 15);
      document.addEventListener('scroll', this._debounce.bind(this))
    }
  }
  //兼容方法
  inViewShow() {
    let keepImgArr = [];
    const viewHeight = document.documentElement.clientHeight || window.innerHeight;
    this.imageElements.forEach((img) => {
      const rect = img.getBoundingClientRect();  //获取边界对象
      if (rect.top < viewHeight) {
        img.src = img.dataset.src;
        img.removeAttribute("data-src");
        //运行回调
        this.callback(img);
      } else {
        keepImgArr.push(img);
      }
    });
    //更新需要懒加载的图片数组
    this.imageElements = new Set(keepImgArr);
    //如果已经为空了，就删除事件监听
    if (this.imageElements.size === 0) {
      document.removeEventListener('scroll', this._debounce);
      delete this._debounce;
    }
  }
  //防抖
  debounce(fn, delay) {
    let timer = null;
    return function () {
      let context = this;
      let args = arguments;

      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(context, args);
      }, delay);
    }
  }
  //添加
  add(elements = []) {
    const newImages = new Set([...elements]);
    //求差集（observe已监听的不需要再次监听）
    const gather = [...new Set([...newImages].filter(item => !this.imageElements.has(item)))];
    this.imageElements = new Set([...this.imageElements, ...newImages]); //for循环则需要遍历全部

    if ("IntersectionObserver" in window) {
      //监听
      gather.forEach(img => this._lazyImageObserver.observe(img));
    } else if (!this._debounce) {
      this.inViewShow();
      this._debounce = this.debounce(this.inViewShow, 15);
      document.removeEventListener('scroll', this._debounce); //删除之前添加的事件
      document.addEventListener('scroll', this._debounce.bind(this))
    }
  }
}