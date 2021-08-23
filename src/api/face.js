/*
 * @Author: mulingyuer
 * @Date: 2021-08-08 03:06:07
 * @LastEditTime: 2021-08-08 03:07:14
 * @LastEditors: mulingyuer
 * @Description: 表情请求
 * @FilePath: \JJ\src\api\face.js
 * 怎么可能会有bug！！！
 */
import api from "@/packages/request";


export const faceData = data => {
  return api({
    url: `${window.$theme_path}/static/face/config.json`,
    method: "get",
    data
  })
}
