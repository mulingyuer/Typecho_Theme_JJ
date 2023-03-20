/*
 * @Author: mulingyuer
 * @Date: 2023-03-20 19:28:51
 * @LastEditTime: 2023-03-21 01:01:07
 * @LastEditors: mulingyuer
 * @Description: 请求封装
 * @FilePath: \Typecho_Theme_JJ\src\request\index.ts
 * 怎么可能会有bug！！！
 */
import axios from "axios";
import toast from "@/utils/toast";
import { AxiosRequestConfig } from "axios";

// 创建axios实例
const service = axios.create({
  baseURL: "",
  headers: {
    "X-Requested-With": "XMLHttpRequest", //这个标识给后端判断是否是ajax请求
    // "Content-Type": "application/x-www-form-urlencoded",
  },
  timeout: 5000, // 请求超时时间
});

//请求后拦截
service.interceptors.response.use(
  (response) => {
    if (response.status !== 200) {
      toast.error({ text: response.statusText });
      return Promise.reject(response.statusText);
    } else {
      return response.data;
    }
  },
  (error) => {
    //get请求文章列表的时候，如果没有下一页了，会返回404，这里不提示错误
    if (error.response.status === 404) {
      const response = error.response;
      //判断是否是文章列表的404
      if (response && typeof response.data === "string" && response.data.trim() !== "") {
        const data: string = response.data;
        if (data.includes("article-pagination-no-more")) {
          //确定是没有下一页了
          const error = new Error("没有下一页了");
          error.name = "noMore";
          return Promise.reject(error);
        }
      }
      return Promise.reject(error);
    } else {
      toast.error({ text: error.message });
      return Promise.reject(error);
    }
  }
);

/** get请求封装：用于类型推断 */
export function apiGet<T = any>(options: AxiosRequestConfig): Promise<T> {
  return new Promise((resolve, reject) => {
    service(options)
      .then((res: unknown) => {
        return resolve(res as T);
      })
      .catch((error) => {
        return reject(error);
      });
  });
}

export default service;
