/*
 * @Author: mulingyuer
 * @Date: 2022-12-18 19:07:38
 * @LastEditTime: 2023-12-21 21:01:36
 * @LastEditors: mulingyuer
 * @Description: index鍏ュ彛鏂囦欢
 * @FilePath: /Typecho_Theme_JJ/src/pages/home/index.ts
 * 鎬庝箞鍙兘浼氭湁bug锛侊紒锛? */
import "@/main";
import "./style.scss";
import "@/modules/nav";
import "@/modules/home/article-nav";
import "@/modules/article-card";
import "@/modules/pagination";
import { initArticlePagination } from "@/modules/article-card/articlePagination";
import { SkeletonController } from "@/modules/skeleton";
import "@/modules/article-empty";
import "@/modules/home/recent-comments";
import "@/modules/home/recommended-article";
import "@/modules/home/theme-tool";
import "@/modules/footer";

new SkeletonController({
	selector: ".article-skeleton",
	contentSelectors: [".article-card-wrap", ".jj-pagination", ".jj-pagination-button", ".jj-pagination-button-no-more"]
});

initArticlePagination();
