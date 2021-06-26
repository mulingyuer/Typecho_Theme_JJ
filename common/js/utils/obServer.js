/*
 * @Author: mulingyuer
 * @Date: 2021-04-08 10:28:52
 * @LastEditTime: 2021-04-18 23:22:02
 * @LastEditors: mulingyuer
 * @Description: 监听对象方法
 * @FilePath: \typecho-theme-juejing\common\js\utils\obServer.js
 * 怎么可能会有bug！！！
 */

//将一个对象转为可监听对象
function obServer(value) {
  if (getType(value) !== "object") throw new Error("参数必须为object对象");
  return defineReactive(value);
};

// 给对象添加一个新属性并监听变化，可深度监听
// function obServerSet(obj, key, value) {
//   // obj[key] = value;
//   if (getType(value) === "object") {
//     obj[key] = defineReactive(value);
//   } else {
//     obj[key] = value;
//   }
// }

// 使一个对象转化成可观测对象
function defineReactive(value) {
  const dep = new Dep();  //为每个属性添加一个依赖收集器
  const proxyValue = new Proxy(value, {
    get(target, key) {
      dep.depend();  //收集依赖
      return target[key];
    },
    set(target, key, value) {
      if (target[key] === value) return true; //相同值不触发
      if (getType(value[key]) === "object") {
        target[key] = defineReactive(value[key]);
      } else {
        target[key] = value;
      }
      //依赖通知更新
      dep.notify();
      return true;
    }
  });
  //判断子属性有没有object
  Object.keys(value).forEach(key => {
    if (getType(value[key]) === "object") {
      proxyValue[key] = defineReactive(value[key]);
    }
  });

  return proxyValue;
}


//依赖收集器
function Dep() {
  this.subs = [];
}
//添加
Dep.prototype.addSub = function (sub) {
  this.subs.push(sub);
};
//删除
Dep.prototype.removeSub = function (sub) {
  if (this.subs.length) {
    const index = this.subs.indexOf(sub);
    if (index > -1) this.subs.splice(index, 1);
  }
};
//添加一个依赖
Dep.prototype.depend = function () {
  if (window.target) this.addSub(window.target);
};
//通知所有依赖更新
Dep.prototype.notify = function () {
  const subs = this.subs.slice();
  subs.forEach(item => item.update());
};


//监听更新的类
const unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;
const bailRE = new RegExp(`[^${unicodeRegExp.source}.$_\\d]`);
function Watch(vuex, key, callback, handler = false) {
  if (bailRE.test(key)) throw new Error("将要监听的key值不正确！");
  this.vm = vuex;
  this.key = key;
  this.callback = callback;
  // 增加依赖
  window.target = this;
  this.val = this.get();
  window.target = undefined;
  if (handler) this.callback(this.val);
};
Watch.prototype.get = function () {
  const keyArr = this.key.split(".");
  let obj = this.vm;
  keyArr.forEach(k => {
    obj = obj[k];
  });
  return obj;
};
Watch.prototype.update = function () {
  const oldValue = this.val;
  this.val = this.get();
  this.callback(this.val, oldValue);
};



//全局可监听对象
window.$obServer = obServer({
  scrollTop: 0,  //滚动体距离顶部的距离
});
