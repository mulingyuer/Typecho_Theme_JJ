/*
 * @Author: mulingyuer
 * @Date: 2022-04-12 22:56:47
 * @LastEditTime: 2022-04-12 23:47:54
 * @LastEditors: mulingyuer
 * @Description: 合并相同请求：固定时间内同一个请求共用同一个结果
 * @FilePath: \Typecho_Theme_JJ\packages\request\interceptor\MergerInterceptor.ts
 * 怎么可能会有bug！！！
 */
import { ApiResponse, Interceptor, RequestConfig } from "../types";
import mem from "mem";

// 全局合并请求拦截器
const mergerInterceptor: Interceptor = {
  //请求前
  requestInterceptor: (config: RequestConfig) => {
    const { merger, mergerTime, uniqueValue } = config;
    if (merger) {
      // mem(()=>{
      //   return new Promise((resolve, reject) => {
      //   })
      // },{maxAge:mergerTime});
    }

    return config;
  },
  //请求前失败：找不到触发时机
  requestInterceptorError: (error: any) => Promise.reject(error),
  //请求成功后
  responseInterceptor: (res: ApiResponse) => {
    console.log(res);
    return res;
  },
  // 请求失败后
  responseInterceptorError: (error: any) => {
    return Promise.reject(error);
  },
};

export default mergerInterceptor;
