/*
 * @Author: mulingyuer
 * @Date: 2023-03-21 00:05:20
 * @LastEditTime: 2023-03-21 00:16:34
 * @LastEditors: mulingyuer
 * @Description: 文章相关api
 * @FilePath: \Typecho_Theme_JJ\src\api\article.ts
 * 怎么可能会有bug！！！
 */
import { apiGet } from "@/request";

/**
 * @description: 获取下一页文章列表
 * @param {string} url 下一页地址
 * @Date: 2023-03-21 00:06:34
 * @Author: mulingyuer
 */
export function getArticleList(url: string) {
  return apiGet<string>({
    url,
    method: "get",
  });
}
