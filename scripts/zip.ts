/*
 * @Author: mulingyuer
 * @Date: 2023-09-03 20:19:43
 * @LastEditTime: 2023-09-03 21:06:19
 * @LastEditors: mulingyuer
 * @Description: 将主题打包成zip文件
 * @FilePath: /Typecho_Theme_JJ/scripts/zip.ts
 * 怎么可能会有bug！！！
 */
import { statSync, createWriteStream } from "fs";
import archiver from "archiver";
import { resolve, join } from "path";

/** 根目录 */
const rootPath = resolve(__dirname, "../");
/** 产物目录（完整 Typecho 主题） */
const distPath = join(rootPath, "dist");

/** init */
(function init() {
  if (!statSync(distPath).isDirectory()) {
    console.error("❌：dist/ 目录不存在，请先运行 pnpm build");
    process.exit(1);
  }

  //zip
  const output = createWriteStream(join(rootPath, "Typecho_Theme_JJ.zip"));
  const archive = archiver("zip", {
    zlib: { level: 9 },
  });

  //监听完成事件
  output.on("close", () => {
    let size = archive.pointer() / (1024 * 1024);
    size = Math.floor(size * 100) / 100;
    console.log(`🔯：打包zip完成，zip大小为：${size} MB`);
  });

  // 使用管道方式导出到文件
  archive.pipe(output);

  // 将 dist/ 内容统一打包到 Typecho_Theme_JJ 目录中，保证解压后目录结构一致
  archive.directory(`${distPath}/`, "Typecho_Theme_JJ");

  // 将归档内容最终化
  archive.finalize();
})();
