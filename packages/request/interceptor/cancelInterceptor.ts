/*
 * @Author: mulingyuer
 * @Date: 2022-04-11 22:00:54
 * @LastEditTime: 2022-04-12 22:54:22
 * @LastEditors: mulingyuer
 * @Description: 全局取消重复请求拦截器以及路由切换取消请求拦截器
 * @FilePath: \Typecho_Theme_JJ\packages\request\interceptor\cancelInterceptor.ts
 * 怎么可能会有bug！！！
 */
import { ApiResponse, Interceptor, RequestConfig } from "../types";

import axios from "axios";

export const requestMap = new Map();
const CancelToken = axios.CancelToken;

// 全局取消重复请求拦截器
const cancelInterceptor: Interceptor = {
  //请求前
  requestInterceptor: (config: RequestConfig) => {
    //唯一值
    const { uniqueValue } = config;
    //判断是否存在该请求
    const cancelData = requestMap.get(uniqueValue);
    if (cancelData) {
      cancelData.cancel(JSON.stringify({ message: "重复请求，已取消上一个旧请求", config }));
      requestMap.delete(uniqueValue);
    }

    if (config.cancel) {
      //取消的source
      const source = CancelToken.source();
      config.cancelToken = source.token;
      //存储本次请求
      requestMap.set(uniqueValue, {
        uniqueValue,
        config,
        cancel: source.cancel,
        changeRouteCancel: config.changeRouteCancel,
      });
      Object.assign(config, { uniqueValue });
    }

    return config;
  },
  //请求前失败：找不到触发时机
  requestInterceptorError: (error: any) => Promise.reject(error),
  //请求成功后
  responseInterceptor: (res: ApiResponse) => {
    const { cancel, uniqueValue } = res.config;
    if (cancel) {
      requestMap.delete(uniqueValue);
    }

    return res;
  },
  // 请求失败后
  responseInterceptorError: (error: any) => {
    //如果是取消的请求
    if (error.isCancel) {
      const { config } = error;
      if (config.cancel) {
        requestMap.delete(config.uniqueValue);
      }
    }

    return Promise.reject(error);
  },
};

export default cancelInterceptor;
