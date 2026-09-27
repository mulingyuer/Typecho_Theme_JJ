/*
 * @Author: mulingyuer
 * @Date: 2023-03-20 19:28:51
 * @LastEditTime: 2026-09-27
 * @LastEditors: mulingyuer
 * @Description: 请求封装
 * @FilePath: \Typecho_Theme_JJ\src\request\index.ts
 * 怎么可能会有bug！！！
 */
import axios, { AxiosRequestConfig, AxiosError } from "axios";
import axiosRetry, { exponentialDelay } from "axios-retry";
import { ElMessage } from "element-plus";

/** "没有下一页"自定义错误，替代 err.name === "noMore" 的魔数约定 */
export class NoMoreError extends Error {
  name = "NoMoreError";
  constructor() {
    super("没有下一页了");
  }
}

// 创建 axios 实例
const service = axios.create({
  baseURL: "",
  headers: {
    "X-Requested-With": "XMLHttpRequest", // 标识给后端判断是否是 ajax 请求
  },
  timeout: 10000, // 请求超时时间（同域 SSR 片段，10s 足够兜底）
});

// 全局默认关闭重试，按调用方显式开启（写操作不能盲目重试）
axiosRetry(service, { retries: 0 });

// 响应拦截
service.interceptors.response.use(
  (response) => {
    if (response.status !== 200) {
      ElMessage.error({ message: response.statusText, plain: true });
      return Promise.reject(new Error(response.statusText));
    }
    return response.data;
  },
  (error: AxiosError) => {
    // 有响应：HTTP 层错误（4xx/5xx）
    if (error.response) {
      const { status, data } = error.response;

      // 文章列表分页到底时后端返回 404 + HTML 片段，识别为"没有下一页"
      if (
        status === 404 &&
        typeof data === "string" &&
        data.includes("article-pagination-no-more")
      ) {
        return Promise.reject(new NoMoreError());
      }

      ElMessage.error({
        message: `请求失败（${status}）`,
        plain: true,
      });
      return Promise.reject(error);
    }

    // 无响应：网络层错误（超时 / 断网）
    const message =
      error.code === "ECONNABORTED"
        ? "请求超时，请检查网络"
        : "网络异常，请检查连接";
    ElMessage.error({ message, plain: true });
    return Promise.reject(error);
  },
);

/** 统一请求入口，泛型 T 即响应体类型（拦截器已剥壳） */
export function request<T = any>(config: AxiosRequestConfig): Promise<T> {
  return service(config);
}

// 重试工具导出，供 api 层按需开启（仅幂等 GET 使用）
export { exponentialDelay };
