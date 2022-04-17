/*
 * @Author: mulingyuer
 * @Date: 2022-04-05 18:53:55
 * @LastEditTime: 2022-04-17 17:24:32
 * @LastEditors: mulingyuer
 * @Description: 封装axios
 * @FilePath: \Typecho_Theme_JJ\packages\request\axios.ts
 * 怎么可能会有bug！！！
 */
import axios from "axios";
import { AxiosInstance } from "axios";
import { ApiConfig, Interceptor, RequestConfig, RequestInterceptor, ResponseInterceptor } from "./types";
import { convertInterceptor, loadingInterceptor, cancelInterceptor } from "./interceptor";
import AutoDestruction from "@packages/auto-destruction-data";
import { createUniqueValue } from "./tool";
import { promiseRetry } from "@packages/promise-extensions";

class Api {
  protected config: ApiConfig; // 配置
  protected useLoading: boolean; //是否开启全局loading
  protected useCancel: boolean; //是否开启全局取消重复请求
  protected useMerger: boolean; //是否开启全局合并请求拦截器
  protected useMergerTime: number; //全局合并请求有效时间
  protected instance: AxiosInstance; //实例
  protected resultMemory?: AutoDestruction; //缓存器
  protected useRetry: boolean; //是否开启失败重试拦截器
  protected retryTimes: number; //失败重试次数
  protected requestInterceptor: Array<RequestInterceptor> = [];
  protected responseInterceptor: Array<ResponseInterceptor> = [];

  constructor(apiConfig: ApiConfig = {}) {
    this.config = apiConfig;
    this.useLoading = apiConfig.useLoading ?? true;
    this.useCancel = apiConfig.useCancel ?? false;
    this.useMerger = apiConfig.useMerger ?? false;
    this.useMergerTime = apiConfig.useMergerTime ?? 1000;
    this.useRetry = apiConfig.useRetry ?? false;
    this.retryTimes = apiConfig.retryTimes ?? 3;
    //判断冲突配置
    if (this.useCancel && this.useMerger) {
      throw new Error(
        `创建axios实例失败：合并请求与取消重复请求冲突，请不要同时启动这两个功能，二选一或者重新生成一个新的实例`
      );
    }

    //创建请求结果存储器
    if (this.useMerger) {
      this.resultMemory = new AutoDestruction({ expiryTime: this.useMergerTime });
    }

    //创建axios实例
    Object.assign(this.config);
    this.instance = axios.create(this.config);

    //拦截器
    //数据转换
    this.addInterceptor(convertInterceptor(apiConfig));
    // 全局取消重复请求拦截器以及路由切换取消请求拦截器;
    if (this.useCancel) this.addInterceptor(cancelInterceptor);
    //全局loading拦截器
    if (this.useLoading) this.addInterceptor(loadingInterceptor);
    //用户拦截器
    const { interceptor } = apiConfig;
    if (interceptor) this.addInterceptor(interceptor);

    //注册拦截器
    this.useInterceptor();
  }

  /**
   * @description: 记录拦截器，为啥要记录？因为傻逼axios拦截器TMD执行顺序是不按顺序来的
   * @description: 请求前是倒序运行拦截器，请求后是顺序运行拦截器，草了
   * @param {Interceptor} interceptor
   * @Date: 2022-04-12 22:20:11
   * @Author: mulingyuer
   */
  protected addInterceptor(interceptor: Interceptor) {
    const { requestInterceptor, requestInterceptorError, responseInterceptor, responseInterceptorError } = interceptor;
    this.requestInterceptor.push({ requestInterceptor, requestInterceptorError });
    this.responseInterceptor.push({ responseInterceptor, responseInterceptorError });
  }

  /**
   * @description: 注册拦截器
   * @param {Interceptor} interceptor
   * @Date: 2022-04-07 23:32:23
   * @Author: mulingyuer
   */
  protected useInterceptor() {
    //请求前拦截器
    [...this.requestInterceptor].reverse().forEach((interceptor) => {
      this.instance.interceptors.request.use(interceptor.requestInterceptor, interceptor.requestInterceptorError);
    });

    //请求后拦截器
    [...this.responseInterceptor].forEach((interceptor) => {
      this.instance.interceptors.response.use(interceptor.responseInterceptor, interceptor.responseInterceptorError);
    });
  }

  //创建请求
  public request(config: RequestConfig): Promise<any> {
    let request: Promise<any>;

    //唯一值拿缓存
    const uniqueValue = createUniqueValue({ baseURL: this.config.baseURL, ...config });
    const result = this.resultMemory?.get(uniqueValue);

    if (result) {
      request = result;
    } else {
      //是否支持失败重试
      if (this.useRetry) {
        request = promiseRetry(() => this.instance.request(config), this.retryTimes);
      } else {
        request = this.instance.request(config);
      }
      //是否需要缓存
      if (this.useMerger) {
        this.resultMemory?.set(uniqueValue, request, config.mergerTime);
      }
    }

    return request;
  }
}

export default Api;
