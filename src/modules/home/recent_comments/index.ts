/*
 * @Author: mulingyuer
 * @Date: 2023-03-21 17:40:33
 * @LastEditTime: 2023-03-26 23:56:55
 * @LastEditors: mulingyuer
 * @Description: 最近评论
 * @FilePath: \Typecho_Theme_JJ\src\modules\home\recent_comments\index.ts
 * 怎么可能会有bug！！！
 */
import "./style.scss";
import FaceReplace from "@/modules/comment/emoji/faceReplace";

class RecentComments {
  /** 评论列表 */
  private commentList: HTMLElement | null = document.querySelector(".recent-comments-list");

  constructor(callback?: () => void) {
    //表情替换
    if (this.commentList) {
      new FaceReplace(this.commentList).start();
    }

    callback && callback();
  }
}

export default RecentComments;
