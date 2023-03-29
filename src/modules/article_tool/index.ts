/*
 * @Author: mulingyuer
 * @Date: 2023-03-24 17:37:54
 * @LastEditTime: 2023-03-29 21:02:13
 * @LastEditors: mulingyuer
 * @Description: 文章工具栏
 * @FilePath: \Typecho_Theme_JJ\src\modules\article_tool\index.ts
 * 怎么可能会有bug！！！
 */
import "./style.scss";
import { postLike } from "@/api/article";
import toast from "@/utils/toast";
import QRCode from "qrcode";

/** 点赞resultObj */
interface LikeResultObj {
  cid: number;
  operate: "inc" | "dec";
  /** 点赞数 */
  likes: number;
}

class ArticleTool {
  /** 点赞按钮 */
  private likeBtn: HTMLElement | null = document.querySelector(".article-like-btn");
  /** 微信分享二维码图片 */
  private wxImg: HTMLImageElement | null = document.querySelector(".article-tool-wx-qrcode-img");
  /** 沉浸按钮 */
  private immersionBtn: HTMLElement | null = document.querySelector(".immersion-mode-btn");
  /** 是否开启沉浸模式 */
  private isImmersion: boolean = false;
  /** 沉浸模式需要隐藏的元素className */
  private immersionHideClassName: string = ".immersion-hide";
  /** 沉浸模式需要隐藏的元素数组 */
  private immersionHideElements: HTMLElement[] = [];

  constructor() {
    /** 点赞 */
    this.likeBtn?.addEventListener("click", this.onLikeClick);
    /** 微信分享 */
    if (this.wxImg) {
      this.createWxQrcode();
    }
    /** 沉浸模式 */
    if (this.immersionBtn) {
      this.immersionHideElements = Array.from(document.querySelectorAll(this.immersionHideClassName));
      this.immersionBtn.addEventListener("click", this.onImmersionClick);
    }
  }

  /** 点赞事件 */
  private onLikeClick = () => {
    const url = location.href.split("?")[0];
    postLike(url)
      .then((res) => {
        const { status, result } = res;
        if (status !== 1) {
          toast.error({ text: `点赞失败：请勿重复点击`, position: "center" });
          return;
        }
        const resultObj: LikeResultObj = JSON.parse(result);
        //更新点赞数量
        this.likeBtn?.setAttribute("badge", resultObj.likes.toString());
        this.likeBtn?.classList.add("active");
        toast.success({ text: "点赞成功", position: "center" });
      })
      .catch((error) => {
        console.log(error);
        toast.error({ text: `点赞失败：${error.message}`, position: "center" });
      });
  };

  /** 生成微信二维码 */
  private createWxQrcode() {
    const href = location.href;
    QRCode.toDataURL(href, { margin: 0 })
      .then((url) => {
        this.wxImg?.setAttribute("src", url);
      })
      .catch((error) => {
        console.error("微信分享二维码生成失败", error);
      });
  }

  /** 沉浸按钮点击事件 */
  private onImmersionClick = () => {
    if (!this.isImmersion) {
      //开启沉浸模式
      this.isImmersion = true;
      this.immersionBtn?.classList.add("active");
      this.immersionHideElements.forEach((item) => {
        item.style.display = "none";
      });
    } else {
      //关闭沉浸模式
      this.isImmersion = false;
      this.immersionBtn?.classList.remove("active");
      this.immersionHideElements.forEach((item) => {
        item.style.display = "";
      });
    }
  };
}
new ArticleTool();
