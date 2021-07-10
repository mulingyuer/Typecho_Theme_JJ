/*
 * @Author: mulingyuer
 * @Date: 2021-07-10 00:47:25
 * @LastEditTime: 2021-07-10 20:54:13
 * @LastEditors: mulingyuer
 * @Description: 监听
 * @FilePath: \JJ\src\scripts\watch.js
 * 怎么可能会有bug！！！
 */
import { watch } from 'melanke-watchjs';


const data = {
  scrollTop: 0, //滚动位置
}

//记录器
const dep = {};

//监听方法
const myWatch = function (key, callback, handler = false) {
  // args: [key, method, newVal, oldVal]
  //判断是否已经监听
  if (!dep[key]) {
    watch(data, key, (...args) => {
      const { 2: newVal, 3: oldVal } = args;
      if (dep[key]) {
        dep[key].forEach(fn => {
          fn(newVal, oldVal);
        });
      }
    });
    //记录回调
    if (typeof callback === 'function') {
      dep[key] = [callback];
      if (handler) callback(data[key], data[key]);
    }
  } else {
    //记录回调
    if (typeof callback === 'function') {
      dep[key].push(callback);
      if (handler) callback(data[key], data[key]);
    }
  }
}

//预设监听滚动
myWatch('scrollTop');
data.scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
window.addEventListener('scroll', () => {
  data.scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
});


export default {
  data,
  watch: myWatch
}

