/*
 * @Author: mulingyuer
 * @Date: 2023-03-18 23:18:51
 * @LastEditTime: 2023-03-18 23:24:18
 * @LastEditors: mulingyuer
 * @Description: 事件总线（发布订阅）
 * @FilePath: \Typecho_Theme_JJ\src\utils\eventMitt.ts
 * 怎么可能会有bug！！！
 */
import mitt from "mitt";

/** mitt事件类型 */
export type EventMitt = {
  /** header是否显示 */
  HEADER_SHOW: boolean;
};

/** 实例 */
const emitter = mitt<EventMitt>();

export default emitter;
