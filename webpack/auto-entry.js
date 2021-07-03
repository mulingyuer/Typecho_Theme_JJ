/*
 * @Author: mulingyuer
 * @Date: 2021-07-04 03:11:32
 * @LastEditTime: 2021-07-04 04:00:20
 * @LastEditors: mulingyuer
 * @Description:入口文件
 * @FilePath: \JJ\webpack\auto-entry.js
 * 怎么可能会有bug！！！
 */
const path = require('path');
const resolve = function (myPath) {
  return path.resolve(__dirname, myPath);
};
const glob = require("glob");
const fs = require("fs");

const entryPath = "../src/pages/";
let fileObj = {};
// function readFile() {
//   try {
//     const globArr = glob.sync("**/index.js", { cwd: resolve(entryPath) });
//     if (globArr.length) fileArr = globArr;
//   } catch (error) {
//     throw error;
//   }
// };
// readFile();

fileDisplay(resolve(entryPath))
function fileDisplay(filePath) {
  let files1 = fs.readdirSync(filePath)
  files1.forEach(fileName1 => {
    let filedir = path.join(filePath, fileName1);
    let files2 = fs.readdirSync(filedir);
    //全局文件跳过
    if (fileName1 == 'global') {
      return false
    }
    files2.forEach(fileName2 => {
      if (fileName2.endsWith(".js")) {
        let name = fileName2.split('.')[0]
        fileObj[fileName1] = resolve(`${entryPath}${fileName1}/${fileName2}`);
      }
    });
    console.log(files2)
  })
}


module.exports = {
  //入口文件
  entry() {
    let obj = {};
    // fileArr.forEach(item => {
    //   const arr = item.split("/");
    //   obj[arr[0]] = resolve(`${entryPath}${item}`)
    // });
    return fileObj;
  },
  //chunks
  chunks() {
    return Object.keys(fileObj);
    // return fileArr.map(item => item.split("/")[0]);
  }
}


