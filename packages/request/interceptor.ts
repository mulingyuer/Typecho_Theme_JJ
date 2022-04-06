/*
 * @Author: mulingyuer
 * @Date: 2022-04-06 22:21:23
 * @LastEditTime: 2022-04-06 23:37:33
 * @LastEditors: mulingyuer
 * @Description: 拦截器
 * @FilePath: \Typecho_Theme_JJ\packages\request\interceptor.ts
 * 怎么可能会有bug！！！
 */
import { showLoading, hideLoading } from "@packages/loading";
import { ApiConfig, ApiResponse } from "./types";
import axios from "axios";

// 全局loading拦截器
export const loadingInterceptor = {
  //请求前
  requestInterceptor: (config: ApiConfig) => {
    if (config.loading) showLoading();
    return config;
  },
  //请求前失败
  requestInterceptorError: () => {},
  //请求成功后
  responseInterceptor: (res: ApiResponse) => {
    if (res.config.loading) hideLoading();
    return res;
  },
  // 请求失败后
  responseInterceptorError: (error: any) => {
    //访问失败一定会有error.config
    //取消请求只有一个axiosError，数据需要从message中自定义，它还只能是一个string
    if (axios.isCancel(error)) {
      let msg = "";

      try {
        const { message, loading } = JSON.parse(error.message);
        if (loading) hideLoading();
        msg = message;
      } catch (e) {
        //普通的取消
        throw error;
      }

      throw new Error(msg);
    } else {
      const { config } = error;
      if (config && config.loading) hideLoading();
    }

    return Promise.reject(error);
  },
};
