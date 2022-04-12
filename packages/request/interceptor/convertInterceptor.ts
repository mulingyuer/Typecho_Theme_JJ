/*
 * @Author: mulingyuer
 * @Date: 2022-04-11 21:59:34
 * @LastEditTime: 2022-04-12 23:42:31
 * @LastEditors: mulingyuer
 * @Description:转换器
 * @FilePath: \Typecho_Theme_JJ\packages\request\interceptor\convertInterceptor.ts
 * 怎么可能会有bug！！！
 */
import { ApiResponse, Interceptor, RequestConfig, ApiConfig } from "../types";
import axios from "axios";
import { createUniqueValue } from "../tool";

//最初的转换器：转换一些数据
export function convertInterceptor(instanceConfig: ApiConfig): Interceptor {
  return {
    //请求前
    requestInterceptor: (config: RequestConfig) => {
      //处理默认配置
      Object.assign(config, {
        cancel: config.cancel ?? instanceConfig.useCancel ?? false,
        changeRouteCancel: config.changeRouteCancel ?? instanceConfig.changeRouteCancel ?? false,
        loading: config.loading ?? instanceConfig.useLoading ?? false,
        uniqueValue: createUniqueValue(config) ?? "", //唯一值：相当重要
        merger: config.merger ?? instanceConfig.useMerger ?? false,
        mergerTime: config.mergerTime ?? instanceConfig.useMergerTime ?? 1000,
      });

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
          const { message, config } = JSON.parse(error.message);
          const cancelError = new Error(message || "请求被取消");
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
}

export default convertInterceptor;
