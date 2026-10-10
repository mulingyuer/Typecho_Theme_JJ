/*
 * @Author: mulingyuer
 * @Date: 2023-03-21 00:05:20
 * @LastEditTime: 2026-09-27 19:50:48
 * @LastEditors: mulingyuer
 * @Description: 文章相关api
 * @FilePath: \Typecho_Theme_JJ\src\api\article.ts
 * 怎么可能会有bug！！！
 */
import { request, exponentialDelay } from "@/request";
import type { LikeResult } from "./types";

/**
 * @description: 获取下一页文章列表
 * @param {string} url 下一页地址
 * @Date: 2023-03-21 00:06:34
 * @Author: mulingyuer
 */
export function getArticleList(url: string) {
	return request<string>({
		url,
		// 幂等 GET，开启重试（retryCondition 默认就是 isNetworkOrIdempotentRequestError）
		"axios-retry": {
			retries: 2,
			retryDelay: exponentialDelay
		}
	});
}

/**
 * @description: 点赞
 * @param {string} url
 * @Date: 2023-03-25 03:07:54
 * @Author: mulingyuer
 */
export function postLike(url: string) {
	// 写操作不开重试，避免重复提交导致计数错乱
	return request<LikeResult>({
		url: `${url}?themeAction=promo`,
		method: "POST",
		params: {
			operate: "inc", //操作类型 inc 增加 dec 减少
			field: "likes" //操作字段
		}
	});
}
