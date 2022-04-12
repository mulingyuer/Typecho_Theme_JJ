/*
 * @Author: mulingyuer
 * @Date: 2022-04-12 20:44:45
 * @LastEditTime: 2022-04-12 20:54:55
 * @LastEditors: mulingyuer
 * @Description: 请求工具函数
 * @FilePath: \Typecho_Theme_JJ\packages\request\tool.ts
 * 怎么可能会有bug！！！
 */
import { AxiosRequestHeaders } from "axios";
import { RequestConfig } from "./types";
import { sortByObject } from "@packages/utils/tool";
import md5 from "@packages/md5";

/**
 * @description: 筛选头信息
 * @param {HeadersInterface} headers
 * @Date: 2022-04-12 00:02:16
 * @Author: mulingyuer
 */
export function filterHeaders(headers: AxiosRequestHeaders) {
  const filterArr = ["common", "delete", "get", "head", "patch", "post", "put"];
  const newHeaders = {};
  Object.keys(headers).forEach((key) => {
    if (filterArr.includes(key)) return;
    Reflect.set(newHeaders, key, headers[key]);
  });

  return newHeaders;
}

/**
 * @description: 生成唯一值
 * @param {RequestConfig} config
 * @Date: 2022-04-12 20:47:42
 * @Author: mulingyuer
 */
export function createUniqueValue(config: RequestConfig) {
  const { baseURL, url, method, params, data, headers } = config;
  const newBaseURL = baseURL ?? "";
  const newUrl = url ?? "";
  const newMethod = method ?? "";
  const newHeaders = JSON.stringify(sortByObject(filterHeaders(headers ?? {})));
  const newData = JSON.stringify(sortByObject(data ?? {}));
  const newParams = JSON.stringify(sortByObject(params ?? {}));

  //MD5
  const md5Str = `${newBaseURL}${newUrl}${newMethod}${newHeaders}${newData}${newParams}`;

  return md5(md5Str);
}
