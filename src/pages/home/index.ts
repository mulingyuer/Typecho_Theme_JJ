/*
 * @Author: mulingyuer
 * @Date: 2022-03-06 23:50:28
 * @LastEditTime: 2022-04-14 21:58:45
 * @LastEditors: mulingyuer
 * @Description: 首页入口
 * @FilePath: \Typecho_Theme_JJ\src\pages\home\index.ts
 * 怎么可能会有bug！！！
 */
import "./tests.scss";
import Api from "@packages/request";

const api = new Api({
  // useCancel: true,
  useLoading: true,
  useMerger: true,
});

api
  .request({
    url: "https://mockapi.eolink.com/7yUWfsWb158d7a9523a8d83823b9a9d6c6a6d3e59e48b2f/test",
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
    url: "https://mockapi.eolink.com/7yUWfsWb158d7a9523a8d83823b9a9d6c6a6d3e59e48b2f/test",
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
