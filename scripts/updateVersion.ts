/*
 * @Author: mulingyuer
 * @Date: 2023-10-22 01:13:21
 * @LastEditTime: 2026-09-26 17:15:11
 * @LastEditors: mulingyuer
 * @Description: 更新版本号
 * @FilePath: \Typecho_Theme_JJ\scripts\updateVersion.ts
 * 怎么可能会有bug！！！
 */
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

/** package.json type */
interface PackageData {
	name: string;
	version: string;
}

/** package.json文件路径 */
const packagePath = resolve(__dirname, "../package.json");
/** 主题首页模板文件路径（源码） */
const themeEntryPath = resolve(__dirname, "../src/pages/home/home.php");

/** 获取package.json文件中的version字段 */
function getVersion() {
	try {
		const fileStr = readFileSync(packagePath, "utf-8");
		const data: PackageData = JSON.parse(fileStr);
		return data.version ?? "";
	} catch (error) {
		console.error("获取package.json中的version失败：", error);
		return "";
	}
}

/** 替换主题index.php中的版本号 */
function replaceThemeVersion(version: string) {
	try {
		let fileStr = readFileSync(themeEntryPath, "utf-8");
		const reg = /@version\s.*/;
		fileStr = fileStr.replace(reg, `@version ${version}`);
		// 更新文件
		writeFileSync(themeEntryPath, fileStr, "utf-8");
		console.log(`✅ 更新主题版本号成功，新版本为：${version}`);
	} catch (error) {
		console.error("替换主题index.php中的版本号失败：", error);
		return "";
	}
}

(function init() {
	const newVersion = getVersion();
	replaceThemeVersion(newVersion);
})();
