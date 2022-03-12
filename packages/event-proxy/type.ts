/*
 * @Author: mulingyuer
 * @Date: 2022-03-13 02:18:13
 * @LastEditTime: 2022-03-13 04:17:37
 * @LastEditors: mulingyuer
 * @Description: 事件代理类型声明
 * @FilePath: \Typecho_Theme_JJ\packages\event-proxy\type.ts
 * 怎么可能会有bug！！！
 */
//dom
export interface HTMLElementProxy extends HTMLElement {
  //事件代理
  _eventFunctionProxy: EventListener;
}
//事件列表
export type EventList = Set<EventListener>;
//事件map
export type EventTypeMap = Map<string, EventList>;
//dom map
export type DomMap = Map<HTMLElement, EventTypeMap>;
