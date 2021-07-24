/*
 * @Author: mulingyuer
 * @Date: 2021-07-24 23:54:58
 * @LastEditTime: 2021-07-25 00:13:38
 * @LastEditors: mulingyuer
 * @Description: 请求
 * @FilePath: \JJ\src\packages\request.js
 * 怎么可能会有bug！！！
 */
import axios from "axios";
import qs from 'qs';



const api = axios.create({
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  timeout: 15000
});



//请求前
api.interceptors.request.use(config => {
  config.data = qs.stringify(config.data);   //模拟jq的参数类型
  return config;
}, error => {
  //错误提示处理
  console.log(error);
  // EMsg.error(error);
  Promise.reject(error);
});



//请求后
api.interceptors.response.use(response => {
  return response.data;
}, error => {
  console.log(error);
  return Promise.reject(error);
})


export default api;