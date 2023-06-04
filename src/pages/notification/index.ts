/*
 * @Author: mulingyuer
 * @Date: 2023-03-26 08:08:16
 * @LastEditTime: 2023-03-26 23:40:52
 * @LastEditors: mulingyuer
 * @Description: 通知页面
 * @FilePath: \Typecho_Theme_JJ\src\pages\notification\index.ts
 * 怎么可能会有bug！！！
 */
import "./style.scss";
import NotificationList from "@/modules/notification/list";
import listSkeleton from "@/modules/notification/list_skeleton";

new NotificationList(() => {
	listSkeleton.receiveClose();
});
