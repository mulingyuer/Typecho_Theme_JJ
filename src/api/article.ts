/*
 * @Author: mulingyuer
 * @Date: 2023-03-21 00:05:20
 * @LastEditTime: 2023-03-25 03:18:00
 * @LastEditors: mulingyuer
 * @Description: 文章相关api
 * @FilePath: \Typecho_Theme_JJ\src\api\article.ts
 * 怎么可能会有bug！！！
 */
import { apiGet, apiPost } from "@/request";

/**
 * @description: 获取下一页文章列表
 * @param {string} url 下一页地址
 * @Date: 2023-03-21 00:06:34
 * @Author: mulingyuer
 */
export function getArticleList(url: string) {
	return apiGet<string>({
		url,
		method: "get"
	});
}

/** 点赞返回的结果 */
interface LikeResult {
	msg: string;
	status: number;
	result: string;
}

/**
 * @description: 点赞
 * @param {string} url
 * @Date: 2023-03-25 03:07:54
 * @Author: mulingyuer
 */
export function postLike(url: string) {
	return apiPost<LikeResult>({
		url: `${url}?themeAction=promo`,
		method: "post",
		params: {
			operate: "inc", //操作类型 inc 增加 dec 减少
			field: "likes" //操作字段
		}
	});
}
