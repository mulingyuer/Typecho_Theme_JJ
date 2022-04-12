/*
 * @Author: mulingyuer
 * @Date: 2022-04-11 21:54:53
 * @LastEditTime: 2022-04-12 22:54:47
 * @LastEditors: mulingyuer
 * @Description: 全局loading
 * @FilePath: \Typecho_Theme_JJ\packages\request\interceptor\loadingInterceptor.ts
 * 怎么可能会有bug！！！
 */
import { showLoading, hideLoading } from "@packages/loading";
import { ApiResponse, Interceptor, RequestConfig } from "../types";

//计数器
let loadingCount = 0;

// 全局loading拦截器
const loadingInterceptor: Interceptor = {
  //请求前
  requestInterceptor: (config: RequestConfig) => {
    if (config.loading) {
      if (loadingCount <= 0) {
        loadingCount = 1;
        showLoading();
      } else {
        loadingCount++;
      }
    }

    return config;
  },
  //请求前失败：找不到触发时机
  requestInterceptorError: (error: any) => Promise.reject(error),
  //请求成功后
  responseInterceptor: (res: ApiResponse) => {
    if (res.config.loading) {
      loadingCount--;
      loadingCount <= 0 && hideLoading();
    }

    return res;
  },
  // 请求失败后
  responseInterceptorError: (error: any) => {
    let config: RequestConfig = error.config;
    if (config && config.loading) {
      loadingCount--;
      loadingCount <= 0 && hideLoading();
    }

    return Promise.reject(error);
  },
};

export default loadingInterceptor;
