/*
 * @Author: mulingyuer
 * @Date: 2023-03-20 23:02:32
 * @LastEditTime: 2023-03-20 23:52:01
 * @LastEditors: mulingyuer
 * @Description: toast弹窗
 * @FilePath: \Typecho_Theme_JJ\src\utils\toast.ts
 * 怎么可能会有bug！！！
 */
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import "@/styles/toast.scss"; //覆盖样式
import { Options } from "toastify-js";

/** 默认配置 */
const defaultOptions: Options = { className: "jj-toast" };
/** info配置 */
const infoOptions: Options = { className: "jj-toast info" };
/** success配置 */
const successOptions: Options = { className: "jj-toast success" };
/** warning配置 */
const warningOptions: Options = { className: "jj-toast warning" };
/** error配置 */
const errorOptions: Options = { className: "jj-toast error" };

/** 自定义toast通知 */
export class Toast {
  /** 配置 */
  private options: Options = defaultOptions;

  constructor(options?: Options) {
    if (options) {
      this.options = this.mergeOptions(this.options, options);
    }
  }

  /** 默认通知 */
  public default(options: Options) {
    const op = this.mergeOptions(this.options, options);
    Toastify(op).showToast();
  }

  /** 成功通知 */
  public success(options: Options) {
    const op = this.mergeOptions(this.options, successOptions, options);
    Toastify(op).showToast();
  }

  /** 警告通知 */
  public warning(options: Options) {
    const op = this.mergeOptions(this.options, warningOptions, options);
    Toastify(op).showToast();
  }

  /** 错误通知 */
  public error(options: Options) {
    const op = this.mergeOptions(this.options, errorOptions, options);
    Toastify(op).showToast();
  }

  /** 信息通知 */
  public info(options: Options) {
    const op = this.mergeOptions(this.options, infoOptions, options);
    Toastify(op).showToast();
  }

  /** 合并配置 */
  private mergeOptions(...args: Array<Options>) {
    const options = {};
    args.forEach((op) => {
      Object.assign(options, op);
    });
    return options;
  }
}

/** 实例 */
const toast = new Toast();
export default toast;
