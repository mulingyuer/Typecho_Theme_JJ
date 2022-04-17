/*
 * @Author: mulingyuer
 * @Date: 2022-04-17 16:06:44
 * @LastEditTime: 2022-04-17 17:05:33
 * @LastEditors: mulingyuer
 * @Description: 失败重试，支持指定重试次数
 * @FilePath: \Typecho_Theme_JJ\packages\promise-extensions\core\promiseRetrys.ts
 * 怎么可能会有bug！！！
 */

/**
 * @description: 失败重试
 * @param {fn} Function - 需要重试的函数
 * @param {number} times - 重试次数
 * @Date: 2022-04-17 16:08:28
 * @Author: mulingyuer
 */
function promiseRetry(fn: Function, times: number): Promise<any> {
  return new Promise(async (resolve, reject) => {
    while (times--) {
      try {
        let result;

        result = await fn();

        //成功
        return resolve(result);
      } catch (error) {
        //如果times大于0说明还有次数，那么就会走while循环，如果没有了我们return抛出error
        if (times <= 0) return reject(error);
      }
    }
  });
}

export default promiseRetry;
