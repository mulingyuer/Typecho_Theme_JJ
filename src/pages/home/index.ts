/*
 * @Author: mulingyuer
 * @Date: 2022-03-06 23:50:28
 * @LastEditTime: 2022-04-06 23:19:56
 * @LastEditors: mulingyuer
 * @Description: 首页入口
 * @FilePath: \Typecho_Theme_JJ\src\pages\home\index.ts
 * 怎么可能会有bug！！！
 */
import "./tests.scss";
import Api from "@packages/request";

const api = new Api();

api
  .request({
    url: "https://jsonplaceholer.typicode.com/asda",
    loading: true,
  })
  .then((res) => {
    console.log(res);
  })
  .catch((error) => {
    console.log(error);
  });
