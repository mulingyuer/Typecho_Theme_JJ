/*
 * @Author: mulingyuer
 * @Date: 2023-03-26 08:08:16
 * @LastEditTime: 2023-03-26 23:40:52
 * @LastEditors: mulingyuer
 * @Description: 閫氱煡椤甸潰
 * @FilePath: \Typecho_Theme_JJ\src\pages\notification\index.ts
 * 鎬庝箞鍙兘浼氭湁bug锛侊紒锛? */
import "@/main";
import "./style.scss";
import NotificationList from "@/modules/notification/list";
import listSkeleton from "@/modules/notification/list-skeleton";

new NotificationList(() => {
	listSkeleton.receiveClose();
});
