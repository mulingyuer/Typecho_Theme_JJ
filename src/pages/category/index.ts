/*
 * @Author: mulingyuer
 * @Date: 2023-03-19 14:31:58
 * @LastEditTime: 2023-03-22 03:19:23
 * @LastEditors: mulingyuer
 * @Description: category鍒嗙被椤? * @FilePath: \Typecho_Theme_JJ\src\pages\category\index.ts
 * 鎬庝箞鍙兘浼氭湁bug锛侊紒锛? */
import "@/main";
import "./style.scss";
import "@/modules/nav";
import "@/modules/secondary-nav";
import "@/modules/article-card";
import "@/modules/pagination";
import { initArticlePagination } from "@/modules/article-card/articlePagination";
import { SkeletonController } from "@/modules/skeleton";
import "@/modules/article-empty";
import "@/modules/home/recent-comments";
import "@/modules/home/theme-tool";
import "@/modules/footer";
import "@/modules/category/tips";

new SkeletonController({
	selector: ".article-skeleton",
	contentSelectors: [".article-card-wrap", ".jj-pagination", ".jj-pagination-button", ".jj-pagination-button-no-more"]
});

initArticlePagination();
