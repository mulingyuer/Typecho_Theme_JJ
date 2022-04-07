/*
 * @Author: mulingyuer
 * @Date: 2022-04-05 18:53:55
 * @LastEditTime: 2022-04-08 00:16:18
 * @LastEditors: mulingyuer
 * @Description: 封装axios
 * @FilePath: \Typecho_Theme_JJ\packages\request\axios.ts
 * 怎么可能会有bug！！！
 */
import axios from "axios";
import { AxiosInstance } from "axios";
import { ApiConfig, Interceptor, RequestConfig } from "./types";
import { convertInterceptor, loadingInterceptor } from "./interceptor";

//source
const source = axios.CancelToken.source();

class Api {
  protected config: ApiConfig; // 配置
  protected loading: boolean; //是否开启全局loading
  protected instance: AxiosInstance; //实例

  constructor(apiConfig: ApiConfig = {}) {
    this.config = apiConfig;
    this.loading = apiConfig.useLoading ?? true;
    //创建axios实例
    console.log(apiConfig);
    Object.assign(this.config, { cancelToken: source.token });
    this.instance = axios.create(this.config);

    //拦截器
    //数据转换
    this.useInterceptor(convertInterceptor);
    //全局loading
    if (this.loading) this.useInterceptor(loadingInterceptor);
    //用户拦截器
    const { interceptor } = apiConfig;
    if (interceptor) this.useInterceptor(interceptor);
  }

  /**
   * @description: 注册拦截器
   * @param {Interceptor} interceptor
   * @Date: 2022-04-07 23:32:23
   * @Author: mulingyuer
   */
  private useInterceptor(interceptor: Interceptor) {
    //请求前拦截器
    this.instance.interceptors.request.use(interceptor.requestInterceptor, interceptor.requestInterceptorError);
    //请求后拦截器
    this.instance.interceptors.response.use(interceptor.responseInterceptor, interceptor.responseInterceptorError);
  }

  //创建请求
  public request(config: RequestConfig): Promise<any> {
    const a = this.instance.request(config);
    // setTimeout(() => {
    //   source.cancel();
    // });
    return a;
  }
}

export default Api;
