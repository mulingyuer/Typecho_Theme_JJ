/*
 * @Author: mulingyuer
 * @Date: 2023-03-26 04:06:58
 * @LastEditTime: 2023-03-26 04:25:43
 * @LastEditors: mulingyuer
 * @Description: 文本替换成表情
 * @FilePath: \Typecho_Theme_JJ\src\modules\comment\emoji\faceReplace.ts
 * 怎么可能会有bug！！！
 */
import { emojiData, getEmojiPrefix } from "./data";

/** 所有表情键值对对象 */
interface EmojiMap {
  [key: string]: string;
}

/** 文本替换成表情 */
class FaceReplace {
  /** 需要替换的dom元素 */
  private domList: Array<HTMLElement> = [];
  /** 所有表情键值对对象 */
  private static emojiMap: EmojiMap = {};
  /** 是否初始化了emojiMap */
  private static isInitEmojiMap: boolean = false;

  constructor(dom: HTMLElement | Array<HTMLElement>) {
    if (Array.isArray(dom)) {
      this.domList = dom;
    } else {
      this.domList.push(dom);
    }

    //初始化表情键值对对象
    if (!FaceReplace.isInitEmojiMap) {
      emojiData.forEach((item) => {
        const { data } = item;
        Object.keys(data).forEach((key) => {
          FaceReplace.emojiMap[key] = data[key as keyof typeof data];
        });
      });
      FaceReplace.isInitEmojiMap = true;
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
      const faceSrc = FaceReplace.emojiMap[param];
      if (faceSrc) {
        return `<img src="${emojiPrefix}${faceSrc}">`;
      }
      return match;
    });

    //更新
    dom.innerHTML = html;
  }
}

export default FaceReplace;
