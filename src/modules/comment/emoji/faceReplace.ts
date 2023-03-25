/*
 * @Author: mulingyuer
 * @Date: 2023-03-26 04:06:58
 * @LastEditTime: 2023-03-26 05:03:44
 * @LastEditors: mulingyuer
 * @Description: 文本替换成表情
 * @FilePath: \Typecho_Theme_JJ\src\modules\comment\emoji\faceReplace.ts
 * 怎么可能会有bug！！！
 */
import { emojiData, getEmojiPrefix } from "./data";

/** 文本替换成表情 */
class FaceReplace {
  /** 需要替换的dom元素 */
  private domList: Array<HTMLElement> = [];

  constructor(dom: HTMLElement | Array<HTMLElement>) {
    if (Array.isArray(dom)) {
      this.domList = dom;
    } else {
      this.domList.push(dom);
    }
  }

  /** 开始替换 */
  public start() {
    this.domList.forEach((dom) => {
      this.replace(dom);
    });
  }

  /** 将文本中的表情替换成图片元素 */
  private replace(dom: HTMLElement) {
    let html = dom.innerHTML;
    const reg = /\[(.*?)\]/g;
    const emojiPrefix = getEmojiPrefix();

    html = html.replace(reg, (match, param) => {
      const data = this.getEmojiData(param);
      if (data.src) {
        return `<img class="${data.isHotWord ? "hot-word-emoji-img" : ""}" src="${emojiPrefix}${data.src}">`;
      }
      return match;
    });

    //更新
    dom.innerHTML = html;
  }

  /** 获取表情对应的数据 */
  private getEmojiData(emoji: string) {
    let src = "";
    let isHotWord = false;
    for (let i = 0, len = emojiData.length; i < len; i++) {
      const { id, data } = emojiData[i];
      if (id === "hotWord") isHotWord = true;
      const val = data[emoji as keyof typeof data];
      if (typeof val === "string") {
        src = val;
        break;
      }
    }

    return {
      src,
      isHotWord,
    };
  }
}

export default FaceReplace;
