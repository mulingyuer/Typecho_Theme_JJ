/*
 * @Author: mulingyuer
 * @Date: 2021-08-14 18:15:27
 * @LastEditTime: 2021-08-14 18:17:56
 * @LastEditors: mulingyuer
 * @Description: 二维码
 * @FilePath: \JJ\src\packages\qr-code.js
 * 怎么可能会有bug！！！
 */
import QRious from "qrious";

export default function (value) {
  if (typeof value !== "string") throw new Error("二维码内容不是字符串");


  const qrious = new QRious({
    background: "transparent",
    size: 200,
    value,
  });

  return qrious.toDataURL();
}
