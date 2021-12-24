/*
 * @Author: mulingyuer
 * @Date: 2021-07-24 19:52:20
 * @LastEditTime: 2021-08-08 04:11:52
 * @LastEditors: mulingyuer
 * @Description: 图片懒加载
 * @FilePath: \JJ\src\packages\img-lazyload.js
 * 怎么可能会有bug！！！
 */

export default class ImgLazyload {
  options = {
    dataName: "src",  //data默认名
    specify: false, //是否指定某些dom，需要传入参数imgDoms
    imgDoms: [], //dom类数组
  };

  constructor(options = {}) {
    this.options = Object.assign(this.options, options);

    //校验参数
    this.validateOptions(this.options);

    //初始化
    this.init();
  }

  //初始化
  init() {
    //获取到图片dom
    if (!this.options.specify) {
      this.imgSet = new Set(this.getImgDom());
    } else {
      this.imgSet = new Set(this.options.imgDoms);
    }


    //监听
    this.watch(this.imgSet);
  }

  //获取图片
  getImgDom() {
    let imgList = document.querySelectorAll(this.options.el);
    imgList = Array.prototype.filter.call(imgList, img => img.dataset[this.options.dataName]); //筛选
    return imgList;
  }

  //监听
  watch(set = new Set()) {
    //监听的回调
    this._lazyImageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(item => {
        //可见状态
        if (item.isIntersecting) {
          const target = item.target;
          target.src = target.dataset[this.options.dataName];
          target.removeAttribute(`data-${this.options.dataName}`);  //移除data

          //取消监听，源数据内删除
          this._lazyImageObserver.unobserve(target);
          this.imgSet.delete(target);
        }
      })
    });


    //对img进行监听
    for (let img of set.keys()) {
      this._lazyImageObserver.observe(img);
    }
  }


  //添加新元素
  add(imgNodeList) {
    let imgList = Array.prototype.filter.call(imgNodeList, img => img.dataset[this.options.dataName]); //筛选
    imgList = Array.prototype.filter.call(imgList, img => !this.imgSet.has(img));  //去重

    //获取到图片dom
    const addImgSet = new Set(imgList);
    this.imgSet = new Set([...this.imgSet, ...addImgSet]);

    //监听
    this.watch(addImgSet);
  }



  //校验参数
  validateOptions(options) {
    const { el, dataName } = options;

    if (!this.options.specify) {
      //是否存在选择器
      if (typeof el !== 'string' || el.length === 0) {
        throw new Error("图片懒加载：请配置正确的元素选择器！");
      }
    }

    //dataNmae是否正确
    if (dataName && typeof dataName !== "string" && el.length === 0) {
      throw new Error("图片懒加载：请配置正确的元素dataName！");
    }

  }
}