/*
 * @Author: mulingyuer
 * @Date: 2026-10-04 17:01:19
 * @LastEditTime: 2026-10-07 22:33:27
 * @LastEditors: mulingyuer
 * @Description: 通知页相关api
 * @FilePath: \Typecho_Theme_JJ\src\api\notification.ts
 * 怎么可能会有bug！！！
 */
import { request, exponentialDelay } from "@/request";

/**
 * @description: 获取下一页通知（评论）列表
 * @param {string} url 下一页地址
 * @Date: 2026-10-04
 * @Author: mulingyuer
 */
export function getNotificationList(url: string) {
	return request<string>({
		url,
		// 幂等 GET，开启重试（retryCondition 默认就是 isNetworkOrIdempotentRequestError）
		"axios-retry": {
			retries: 2,
			retryDelay: exponentialDelay
		}
	});
}
