/*
 * @Author: mulingyuer
 * @Date: 2022-04-05 18:53:55
 * @LastEditTime: 2022-04-06 23:45:51
 * @LastEditors: mulingyuer
 * @Description: 封装axios
 * @FilePath: \Typecho_Theme_JJ\packages\request\axios.ts
 * 怎么可能会有bug！！！
 */
import axios from "axios";
import { AxiosInstance } from "axios";
import { ApiConfig } from "./types";
import { loadingInterceptor } from "./interceptor";

//source
const source = axios.CancelToken.source();

class Api {
  protected config: ApiConfig; // 配置
  protected loading: boolean; //是否开启全局loading
  protected instance: AxiosInstance; //实例

  constructor(apiConfig: ApiConfig = {}) {
    this.config = apiConfig;
    this.loading = apiConfig.loading ?? true;
    //创建axios实例
    this.instance = axios.create({ ...this.config, cancelToken: source.token });

    //拦截器
    const { interceptor } = apiConfig;
    if (interceptor) {
      //请求前拦截器
      this.instance.interceptors.request.use(interceptor.requestInterceptor, interceptor.requestInterceptorError);
      //请求后拦截器
      this.instance.interceptors.response.use(interceptor.responseInterceptor, interceptor.responseInterceptorError);
    }

    //取消请求

    //全局loading
    if (this.loading) {
      //请求前拦截器
      this.instance.interceptors.request.use(loadingInterceptor.requestInterceptor);
      //请求后拦截
      this.instance.interceptors.response.use(
        loadingInterceptor.responseInterceptor,
        loadingInterceptor.responseInterceptorError
      );
    }
  }

  //创建请求
  public request(config: ApiConfig): Promise<any> {
    const a = this.instance.request(new Error("21w31") as any);
    setTimeout(() => {
      source.cancel(JSON.stringify({ ...config, message: "取消请求" }));
    });
    return a;
  }
}

export default Api;
