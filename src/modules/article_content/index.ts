/*
 * @Author: mulingyuer
 * @Date: 2023-03-22 19:56:36
 * @LastEditTime: 2023-03-23 02:54:21
 * @LastEditors: mulingyuer
 * @Description: 文章内容模块
 * @FilePath: \Typecho_Theme_JJ\src\modules\article_content\index.ts
 * 怎么可能会有bug！！！
 */
import "./style.scss";
import hljs from "./hljs";
import LightBox from "./lightBox";

/** 代码高亮处理 */
class CodeHighlight {
  /** 文章dom */
  private article = document.querySelector(".markdown-body");

  constructor() {
    if (this.article) {
      hljs.highlightAll();
    }
  }
}
new CodeHighlight();

/** 灯箱处理 */
const markdownBody = document.querySelector(".markdown-body");
if (markdownBody) new LightBox(markdownBody as HTMLElement);
