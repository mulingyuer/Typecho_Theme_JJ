/*
 * @Author: mulingyuer
 * @Date: 2022-12-18 23:34:05
 * @LastEditTime: 2024-09-16 15:44:12
 * @LastEditors: mulingyuer
 * @Description: post
 * @FilePath: /Typecho_Theme_JJ/src/pages/post/index.ts
 * 鎬庝箞鍙兘浼氭湁bug锛侊紒锛? */
import "@/main";
import "./style.scss";
import "@/modules/article-content";
import "@/modules/article-relevant-info";
import "@/modules/copyright";
import "@/modules/article-author";
import "@/modules/post/latest-posts";
import "@/modules/post/directory-tree";
import "@/modules/comment";
import "@/modules/post/articles-related";
import "@/modules/article-tool";
import "@/modules/post/next-article";
import "@/modules/post/mobile-directory-tree";
import emitter from "@/utils/mittEvent";
import "@/modules/post/article-detail-recommended";

class PostRightSticky {
  /** 瀹瑰櫒 */
  private wrap = document.querySelector(".post-right-sticky");

  constructor() {
    emitter.on("HEADER_SHOW", this.listenHeaderShow);
  }

  /** 鐩戝惉header鐨勬樉绀洪殣钘?*/
  private listenHeaderShow = (status: boolean) => {
    if (status) {
      this.wrap?.classList.add("heighten");
    } else {
      this.wrap?.classList.remove("heighten");
    }
  };
}

new PostRightSticky();
