/*
 * @Author: mulingyuer
 * @Date: 2026-09-27 19:48:31
 * @LastEditTime: 2026-09-27 19:50:17
 * @LastEditors: mulingyuer
 * @Description:  axios 类型补丁
 * @FilePath: \Typecho_Theme_JJ\src\types\axios.d.ts
 * 怎么可能会有bug！！！
 */

declare module "axios" {
  interface AxiosInstance {
    /** 拦截器已剥掉 AxiosResponse 外壳，返回类型即响应体 */
    <T = any>(config: AxiosRequestConfig): Promise<T>;
  }
}

export {};
