/*
 * @Author: mulingyuer
 * @Date: 2022-03-06 23:50:28
 * @LastEditTime: 2022-04-17 17:26:20
 * @LastEditors: mulingyuer
 * @Description: 首页入口
 * @FilePath: \Typecho_Theme_JJ\src\pages\home\index.ts
 * 怎么可能会有bug！！！
 */
import "./tests.scss";
import Api from "@packages/request";

const api = new Api({
  baseURL: "http://127.0.0.1:4523/mock",
  // useCancel: true,
  useLoading: true,
  useMerger: true,
  useRetry: true,
});

api
  .request({
    url: "/829654/test",
    loading: true,
    headers: {
      test: 1,
      // "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "get",
    params: {},
  })
  .then((res) => {
    console.log(res);
  })
  .catch((error) => {
    console.log(error);
  });

api
  .request({
    url: "/829654/test",
    loading: true,
    headers: {
      test: 1,
      // "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "get",
    params: {},
  })
  .then((res) => {
    console.log(res);
  })
  .catch((error) => {
    console.log(error);
  });
// const keys = Reflect.ownKeys();
