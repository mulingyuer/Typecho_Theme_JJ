/*
 * @Author: mulingyuer
 * @Date: 2023-03-26 08:13:45
 * @LastEditTime: 2023-03-26 09:11:01
 * @LastEditors: mulingyuer
 * @Description: 通知列表
 * @FilePath: \Typecho_Theme_JJ\src\modules\notification\list\index.ts
 * 怎么可能会有bug！！！
 */
import "./style.scss";
import FaceReplace from "@/modules/comment/emoji/faceReplace";

class NotificationList {
  /** 评论列表容器 */
  private list: HTMLElement | null = document.querySelector(".notification-list-content");

  constructor(callback: () => void) {
    if (this.list) {
      new FaceReplace(this.list).start();
    }
    callback();
  }
}

export default NotificationList;
