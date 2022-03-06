/*
 * @Author: mulingyuer
 * @Date: 2022-03-06 21:46:49
 * @LastEditTime: 2022-03-07 00:17:25
 * @LastEditors: mulingyuer
 * @Description: 开发模式配置
 * @FilePath: \Typecho_Theme_JJ\webpack\webpack.dev.ts
 * 怎么可能会有bug！！！
 */

export default {
  watch: true, //监听任何已解析文件的更改
  watchOptions: {
    aggregateTimeout: 600, //600ms内可以重复保存
    poll: 1000, // 每秒检查一次变动
    ignored: ["**/node_modules"], //忽略模块文件夹
  },
};
