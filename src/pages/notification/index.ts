/*
 * @Author: mulingyuer
 * @Date: 2026-08-02 11:20:27
 * @LastEditTime: 2026-10-11 00:09:00
 * @LastEditors: mulingyuer
 * @Description: 通知页入口文件
 * @FilePath: \Typecho_Theme_JJ\src\pages\notification\index.ts
 * 怎么可能会有bug！！！
 */
import "@/main";
import { SkeletonController } from "@/modules/skeleton";
import "./styles/index.scss";
import { singletonFaceReplace } from "@/modules/comment/emoji/faceReplace";
import PaginationLoader from "@/modules/pagination";
import { sleep } from "@/utils/tool";

/** 初始化无限滚动分页 */
function initNotificationPagination(listContainer: HTMLElement | null) {
  if (!listContainer) return;

  const pagination = document.querySelector<HTMLElement>(
    ".notification-pagination-wrap .jj-pagination--infinite",
  );
  if (!pagination) return;

  return new PaginationLoader({
    pagination,
    listContainer,
    itemSelector: ".notification-list-item",
    afterAppend(items) {
      // 分页新增的节点需要补一次表情替换
      singletonFaceReplace.start(items);
    },
  });
}

async function initNotificationPage() {
  // 评论列表容器
  const listContainer = document.querySelector<HTMLElement>(
    ".notification-list-content",
  );

  // 骨架屏
  const listSkeleton = new SkeletonController({
    selector: ".list-skeleton",
    contentSelectors: [".notification-list-content"],
    waitForCloseSignal: true,
  });

  if (listContainer) {
    // 初始化表情替换
    singletonFaceReplace.start(listContainer);
  }

  // 关闭骨架屏
  listSkeleton.receiveClose();

  await sleep(1500);

  // 初始化无限滚动分页
  initNotificationPagination(listContainer);
}

initNotificationPage();
