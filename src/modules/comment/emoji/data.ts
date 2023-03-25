/*
 * @Author: mulingyuer
 * @Date: 2023-03-26 02:47:15
 * @LastEditTime: 2023-03-26 04:33:42
 * @LastEditors: mulingyuer
 * @Description: 表情数据
 * @FilePath: \Typecho_Theme_JJ\src\modules\comment\emoji\data.ts
 * 怎么可能会有bug！！！
 */
import yellowFace from "@/constant/emoji/yellowFace";
import hotWord from "@/constant/emoji/hotWord";
import bTv from "@/constant/emoji/bTv";
import yanWen from "@/constant/emoji/yanWen";

/** 表情数据 */
export const emojiData = [
  /** 小黄脸 */
  {
    name: "小黄脸",
    icon: "/yellow_face/fa6dda8b876ed38609de38aa604be5ad109b8591.png",
    data: yellowFace,
  },
  /** 热词 */
  {
    name: "热词",
    icon: "/hot_word/8d962fcf0b18761d5f4315a49b7ae428da08cf4a.png",
    data: hotWord,
  },
  /** 小电视 */
  {
    name: "小电视",
    icon: "/b_tv/c1d59f439e379ee50eef488bcb5e5378e5044ea4.png",
    data: bTv,
  },
  /** 颜文字 */
  {
    name: "颜文字",
    text: "（⌒▽⌒）",
    data: yanWen,
  },
];

/** 表情地址前缀 */
let emojiPrefix = "";
const metaPath: HTMLElement | null = document.querySelector("meta[name=path]");
if (metaPath) {
  const str = metaPath.getAttribute("content");
  if (typeof str === "string" && str.trim() !== "") {
    emojiPrefix = str;
  }
}

/** 获取表情地址前缀 */
export function getEmojiPrefix() {
  return emojiPrefix;
}
