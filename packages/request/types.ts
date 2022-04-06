/*
 * @Author: mulingyuer
 * @Date: 2022-04-06 21:46:33
 * @LastEditTime: 2022-04-06 23:35:54
 * @LastEditors: mulingyuer
 * @Description:封装axios类型声明
 * @FilePath: \Typecho_Theme_JJ\packages\request\types.ts
 * 怎么可能会有bug！！！
 */
import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

/**
 * @description: api配置
 * @param {*}
 * @Date: 2022-04-06 23:22:38
 * @Author: mulingyuer
 */
export interface ApiConfig extends AxiosRequestConfig {
  cancel?: boolean; //是否开启取消请求
  loading?: boolean; //是否开启全局loading
  interceptor?: {
    requestInterceptor: () => ApiConfig; //请求前
    requestInterceptorError: () => AxiosResponse; //请求前发生错误
    responseInterceptor: () => AxiosResponse; //请求成功后
    responseInterceptorError: () => PromiseRejectedResult; //请求失败后
  };
}

//api成功后响应对象类型
export interface ApiResponse extends AxiosResponse {
  config: ApiConfig;
}
