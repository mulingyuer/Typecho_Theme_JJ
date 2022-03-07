/*
 * @Author: mulingyuer
 * @Date: 2022-03-07 01:45:56
 * @LastEditTime: 2022-03-08 01:17:40
 * @LastEditors: mulingyuer
 * @Description: 自动加载入口文件
 * @FilePath: \Typecho_Theme_JJ\webpack\auto-load\entry.ts
 * 怎么可能会有bug！！！
 */
import glob from "glob";
import { resolve } from "path";

//入口文件路径
const entryPath = "../../src/pages";

//获取入口
function getEntry() {
  let entry: { [key: string]: string } = {};

  //获取入口文件数组
  const entryArr = glob.sync("**/index.ts", {
    cwd: resolve(__dirname, entryPath),
  });
  //遍历得到对象
  entryArr.forEach((filePath: string) => {
    const fileName = filePath.split("/")[0];
    entry[fileName] = resolve(__dirname, entryPath, filePath);
  });

  return entry;
}

export default getEntry();
