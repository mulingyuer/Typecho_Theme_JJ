/*
 * @Author: mulingyuer
 * @Date: 2022-04-06 22:21:23
 * @LastEditTime: 2022-04-08 00:15:55
 * @LastEditors: mulingyuer
 * @Description: 拦截器
 * @FilePath: \Typecho_Theme_JJ\packages\request\interceptor.ts
 * 怎么可能会有bug！！！
 */
import { showLoading, hideLoading } from "@packages/loading";
import { ApiResponse, Interceptor, RequestConfig } from "./types";
import axios from "axios";

//最初的转换器：转换一些数据
export const convertInterceptor: Interceptor = {
  //请求前
  requestInterceptor: (config: RequestConfig) => {
    return config;
  },
  //请求前失败：找不到触发时机
  requestInterceptorError: (error: any) => Promise.reject(error),
  //请求成功后
  responseInterceptor: (res: ApiResponse) => {
    return res;
  },
  // 请求失败后
  responseInterceptorError: (error: any) => {
    //访问失败一定会有error.config
    //取消请求只有一个axiosError，数据需要从message中自定义，它还只能是一个string
    //超时取消请求也会有config，但不会被isCancel命中

    if (axios.isCancel(error)) {
      try {
        const config = JSON.parse(error.message);
        const cancelError = new Error(config.message || "请求被取消");
        //增加识别号和初始数据
        Object.assign(cancelError, { isCancel: true, config });

        return Promise.reject(cancelError);
      } catch (e) {
        //有可能自定义取消请求是没有对error.message做特殊操作
        //只能作为简单错误处理了
        //不做处理，走下面
      }
    }

    return Promise.reject(error);
  },
};

// 全局loading拦截器
export const loadingInterceptor: Interceptor = {
  //请求前
  requestInterceptor: (config: RequestConfig) => {
    if (config.loading) showLoading();
    return config;
  },
  //请求前失败：找不到触发时机
  requestInterceptorError: (error: any) => Promise.reject(error),
  //请求成功后
  responseInterceptor: (res: ApiResponse) => {
    console.log(res.config);
    if (res.config.loading) hideLoading();
    return res;
  },
  // 请求失败后
  responseInterceptorError: (error: any) => {
    let config: RequestConfig = error.config;

    if (config && config.loading) hideLoading();

    return Promise.reject(error);
  },
};

//全局取消请求拦截器
// export const cancelInterceptor: Interceptor = {};

// //全局取消请求拦截器
// export const cancelInterceptor: Interceptor = {};
