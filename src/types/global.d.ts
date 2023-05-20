/*
 * @Author: mulingyuer
 * @Date: 2023-05-20 13:28:46
 * @LastEditTime: 2023-05-20 16:02:41
 * @LastEditors: mulingyuer
 * @Description: 全局类型声明
 * @FilePath: \Typecho_Theme_JJ\src\types\global.d.ts
 * 怎么可能会有bug！！！
 */

/** 全局错误 */
interface GlobalError {
  /** 错误记录数据数组 */
  list: Array<ErrorEvent>;
  /** 错误记录处理回调 */
  callback: (event: ErrorEvent) => void | null;
}

declare interface Window {
  $globalError?: GlobalError;
}
