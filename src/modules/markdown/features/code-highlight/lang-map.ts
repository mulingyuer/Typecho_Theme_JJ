import type { BundledLanguageInfo } from "shiki";
import { bundledLanguages, bundledLanguagesInfo } from "shiki/langs";

/** language-xxx / lang-xxx 前缀（Typecho/Markdown 渲染器两种都有），命中第一个即返回 */
const LANG_CLASS_PREFIX = ["language-", "lang-"];
/** 预归位的别名表：键为 class 上的原始写法，值为 shiki 期望的主 id */
const LANG_ALIAS: Record<string, string> = {
	"c++": "cpp",
	cplusplus: "cpp",
	htm: "html",
	svg: "xml",
	sh: "bash",
	zsh: "bash",
	ksh: "bash",
	console: "bash",
	py: "python",
	rb: "ruby",
	yml: "yaml",
	golang: "go",
	rs: "rust",
	kt: "kotlin",
	md: "markdown",
	objc: "objective-c"
};
/** 友好显示名：补全 / 纠正 shiki 侧 name 不直观的少数 id */
const DISPLAY_NAME: Record<string, string> = {
	cpp: "C++",
	csharp: "C#",
	dockerfile: "Dockerfile",
	nginx: "Nginx",
	powershell: "PowerShell",
	text: "Text"
};

/** 官方语言信息索引：主 id + aliases 一并建键，避免漏掉短写别名 */
const languageIndex = new Map<string, BundledLanguageInfo>();
for (const info of bundledLanguagesInfo) {
	languageIndex.set(info.id, info);
	for (const alias of info.aliases ?? []) languageIndex.set(alias, info);
}

/** 取出 classList 上第一个 language-/lang- 标记的原始语言名并小写化 */
export function readRawLanguage(classList: DOMTokenList): string {
	for (const value of classList) {
		for (const prefix of LANG_CLASS_PREFIX) {
			if (!value.startsWith(prefix)) continue;
			return value.slice(prefix.length).trim().toLowerCase();
		}
	}
	return "";
}

/**
 * @description: 把原始语言名解析成 shiki 主 id；未登记（不存在 / 写错）时返回空串，交由上层降级为 text
 * @param {string} raw language-xxx（或 lang-xxx）之后的原始文本
 */
export function resolveLanguageId(raw: string): string {
	if (!raw) return "";
	const info = languageIndex.get(raw) ?? languageIndex.get(LANG_ALIAS[raw] ?? "");
	return info?.id ?? "";
}

/**
 * @description: 取语言标签的友好显示名，取不到时回退为原始小写名
 * @param {string} id shiki 语言主 id
 * @param {string} raw 原始 language 标记文本
 */
export function resolveLanguageLabel(id: string, raw: string): string {
	const info = id ? languageIndex.get(id) : undefined;
	return DISPLAY_NAME[id] || info?.name || raw;
}

/**
 * @description: 判断语言 id 是否在登记表里
 * @param {string} id shiki 主 id
 */
export function hasLanguage(id: string): boolean {
	return typeof id === "string" && Object.prototype.hasOwnProperty.call(bundledLanguages, id);
}
