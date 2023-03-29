/*
 * @Author: mulingyuer
 * @Date: 2023-03-22 19:56:36
 * @LastEditTime: 2023-03-30 00:24:32
 * @LastEditors: mulingyuer
 * @Description: 文章内容模块
 * @FilePath: \Typecho_Theme_JJ\src\modules\article_content\index.ts
 * 怎么可能会有bug！！！
 */
import "./style.scss";
import hljs from "./hljs";
import LightBox from "./lightBox";
import copy from "@/utils/copy";
import toast from "@/utils/toast";

/** 代码高亮处理 */
class CodeHighlight {
  /** 文章dom */
  private article = document.querySelector(".markdown-body");

  constructor() {
    if (!this.article) return;
    //获取pre下的code
    const codeArr: Array<HTMLElement> = Array.from(this.article.querySelectorAll("pre code"));
    codeArr.forEach((code) => {
      this.highlight(code);
      this.addLanguageAttr(code);
      this.copyCode(code);
    });
    // hljs.highlightAll();
  }

  /** 添加语言属性 */
  private addLanguageAttr(codeDom: HTMLElement) {
    let findClassName = "";
    for (const value of codeDom.classList.values()) {
      //hljs高亮之后会添加一个language-开头的class声明是什么语言
      if (value.includes("language-")) {
        findClassName = value;
        //跳出循环
        break;
      }
    }
    if (typeof findClassName === "string") {
      const lang = findClassName.split("-")[1];
      codeDom.setAttribute("lang", lang);
    }
  }

  /** 代码高亮 */
  private highlight(codeDom: HTMLElement) {
    hljs.highlightElement(codeDom);
  }

  /** 复制代码 */
  private copyCode(codeDom: HTMLElement) {
    const copyBtn = this.createCopyBtn();
    codeDom.classList.add("copyable");
    //添加复制按钮，与codeDom同级
    codeDom.parentNode?.appendChild(copyBtn);
  }

  /** 创建复制按钮 */
  private createCopyBtn() {
    const copyBtn = document.createElement("span");
    copyBtn.classList.add("copy-code-btn");
    copyBtn.innerText = "复制代码";
    copyBtn.addEventListener("click", this.copyBtnClick);
    return copyBtn;
  }

  /** 复制按钮点击事件 */
  private copyBtnClick(event: Event) {
    const target = event.currentTarget as HTMLElement;
    const codeDom = target.previousElementSibling as HTMLElement;
    if (codeDom && codeDom.tagName.toLocaleLowerCase() === "code") {
      copy(codeDom)
        .then(() => {
          toast.success({ text: "复制成功" });
        })
        .catch(() => {
          toast.error({ text: "复制失败，请手动复制" });
        });
    }
  }
}
new CodeHighlight();

/** 灯箱处理 */
const markdownBody = document.querySelector(".markdown-body");
if (markdownBody) new LightBox(markdownBody as HTMLElement);
