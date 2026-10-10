/*
 * @Author: mulingyuer
 * @Date: 2026-10-07 23:38:24
 * @LastEditTime: 2026-10-10 23:34:37
 * @LastEditors: mulingyuer
 * @Description: 通用骨架屏模块入口（引入基础样式并导出显隐控制器）
 * @FilePath: \Typecho_Theme_JJ\src\modules\skeleton\index.ts
 * 怎么可能会有bug！！！
 */
import "./style.scss";

export { default as SkeletonController } from "./controller";
export type { SkeletonControllerOptions } from "./controller";
