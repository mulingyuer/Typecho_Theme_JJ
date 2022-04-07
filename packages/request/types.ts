/*
 * @Author: mulingyuer
 * @Date: 2022-04-06 21:46:33
 * @LastEditTime: 2022-04-08 00:14:27
 * @LastEditors: mulingyuer
 * @Description:封装axios类型声明
 * @FilePath: \Typecho_Theme_JJ\packages\request\types.ts
 * 怎么可能会有bug！！！
 */
import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

//拦截器
export interface Interceptor {
  requestInterceptor?: (val: AxiosRequestConfig) => AxiosRequestConfig; //请求前
  requestInterceptorError?: (error: any) => Promise<any>; //请求前发生错误,
  responseInterceptor?: (res: ApiResponse) => ApiResponse; //请求成功后
  responseInterceptorError?: (error: any) => Promise<any>; //请求前后发生错误
}

// api类的配置
export interface ApiConfig extends AxiosRequestConfig {
  useCancel?: boolean; //是否开启取消请求拦截器
  useLoading?: boolean; //是否开启全局loading拦截器
  useMerger?: boolean; //是否开启全局合并请求拦截器
  useMergerTime?: number; //合并请求的有效时间
  interceptor?: Interceptor;
}

//用户请求config配置
export interface RequestConfig extends AxiosRequestConfig {
  loading?: boolean; //是否开启loading
  cancel?: boolean; //是否开启取消请求
  merger?: boolean; //是否开启合并请求
  mergerTime?: number; //合并请求的有效时间
}

//api成功后响应对象类型
export interface ApiResponse extends AxiosResponse {
  config: RequestConfig;
}
