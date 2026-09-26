/*
 * @Author: mulingyuer
 * @Date: 2026-09-26 15:30:21
 * @LastEditTime: 2026-09-26 15:41:14
 * @LastEditors: mulingyuer
 * @Description:
 * @FilePath: \Typecho_Theme_JJ\vite\plugin\theme-assembler.ts
 * 怎么可能会有bug！！！
 */
/*
 * @Author: mulingyuer
 * @Description: 主题组装插件：将 src/ 下的页面PHP、模块PHP、functions、static 组装为完整 Typecho 主题
 * 怎么可能会有bug！！！
 */
import type { Plugin } from "vite";
import {
	existsSync,
	mkdirSync,
	readFileSync,
	writeFileSync,
	copyFileSync,
	readdirSync,
	statSync,
	rmSync
} from "node:fs";
import { dirname, join, resolve, relative, basename } from "node:path";
import { globSync } from "glob";

interface ManifestChunk {
	file: string;
	src?: string;
	isEntry?: boolean;
	css?: string[];
	imports?: string[];
}

type Manifest = Record<string, ManifestChunk>;

export interface ThemeAssemblerOptions {
	/** 源码根目录（绝对路径） */
	srcDir: string;
	/** manifest 文件路径（相对于 outDir） */
	manifestPath?: string;
	/** 入口名映射（manifest key -> 页面名） */
	entryNames: Record<string, string>;
}

/** 收集入口及其所有静态依赖 chunk 的 css，去重且保持顺序 */
function collectCss(manifest: Manifest, key: string, visited = new Set<string>()): string[] {
	if (visited.has(key)) return [];
	visited.add(key);
	const chunk = manifest[key];
	if (!chunk) return [];
	const css: string[] = [];
	for (const imp of chunk.imports ?? []) {
		css.push(...collectCss(manifest, imp, visited));
	}
	for (const file of chunk.css ?? []) {
		if (!css.includes(file)) css.push(file);
	}
	return css;
}

/** 收集入口的所有静态依赖 chunk（modulepreload 用） */
function collectImports(manifest: Manifest, key: string, visited = new Set<string>()): string[] {
	if (visited.has(key)) return [];
	visited.add(key);
	const chunk = manifest[key];
	if (!chunk) return [];
	const files: string[] = [];
	const addFile = (file: string) => {
		if (!files.includes(file)) files.push(file);
	};
	for (const imp of chunk.imports ?? []) {
		const imported = manifest[imp];
		if (imported) addFile(imported.file);
		for (const file of collectImports(manifest, imp, visited)) addFile(file);
	}
	return files;
}

/** 生成资源标签 HTML */
function generateTags(manifest: Manifest, manifestKey: string): string {
	const chunk = manifest[manifestKey];
	if (!chunk) return "";
	const base = "<?php echo $this->options->themeUrl; ?>";
	const tags: string[] = [];
	for (const css of collectCss(manifest, manifestKey)) {
		tags.push(`<link href="${base}/${css}" rel="stylesheet">`);
	}
	for (const file of collectImports(manifest, manifestKey)) {
		tags.push(`<link href="${base}/${file}" rel="modulepreload">`);
	}
	tags.push(`<script src="${base}/${chunk.file}" type="module"></script>`);
	return tags.join("\n");
}

/** 递归拷贝目录 */
function copyDir(src: string, dest: string) {
	mkdirSync(dest, { recursive: true });
	for (const entry of readdirSync(src)) {
		const srcPath = join(src, entry);
		const destPath = join(dest, entry);
		if (statSync(srcPath).isDirectory()) {
			copyDir(srcPath, destPath);
		} else {
			copyFileSync(srcPath, destPath);
		}
	}
}

/** 组装所有 PHP 产物 */
function assemble(
	srcDir: string,
	outDir: string,
	manifest: Manifest | null,
	entryNames: Record<string, string>,
	logger: {
		info: (msg: string) => void;
		warn: (msg: string) => void;
		error: (msg: string) => void;
	}
) {
	const pagesDir = resolve(srcDir, "pages");
	const modulesDir = resolve(srcDir, "modules");
	const functionsDir = resolve(srcDir, "functions");

	// 1. 页面 PHP：注入资源标签 → dist/*.php
	const pageFiles = globSync("*/*.php", { cwd: pagesDir });
	for (const relPath of pageFiles) {
		const pageName = relPath.split(/[\/\\]/)[0];
		const srcFile = resolve(pagesDir, relPath);
		const outFileName = pageName === "home" ? "index.php" : `${pageName}.php`;
		const outFile = join(outDir, outFileName);

		let content = readFileSync(srcFile, "utf-8");

		// 替换资源占位符
		if (content.includes("<!--VITE_HEAD_TAGS-->")) {
			if (manifest) {
				const manifestKey = Object.entries(entryNames).find(([, name]) => name === pageName)?.[0];
				if (manifestKey && manifest[manifestKey]) {
					content = content.replace("<!--VITE_HEAD_TAGS-->", generateTags(manifest, manifestKey));
				} else {
					logger.warn(`[theme-assembler] manifest 中未找到页面入口: ${pageName}，占位符保留`);
				}
			}
			// 无 manifest 时保留占位符（dev watch 首次运行前）
		}

		mkdirSync(dirname(outFile), { recursive: true });
		writeFileSync(outFile, content, "utf-8");
		logger.info(`[theme-assembler] 页面: ${outFileName}`);
	}

	// 检查占位符残留
	if (manifest) {
		for (const relPath of pageFiles) {
			const pageName = relPath.split(/[\/\\]/)[0];
			const outFileName = pageName === "home" ? "index.php" : `${pageName}.php`;
			const outFile = join(outDir, outFileName);
			if (existsSync(outFile)) {
				const content = readFileSync(outFile, "utf-8");
				if (content.includes("VITE_HEAD_TAGS")) {
					logger.error(`[theme-assembler] 产物 ${outFileName} 中存在未替换的 VITE_HEAD_TAGS 占位符！`);
				}
			}
		}
	}

	// 2. 模块 PHP：src/modules/**/*.php → dist/php_modules/
	const moduleFiles = globSync("**/*.php", { cwd: modulesDir });
	const phpModulesDir = join(outDir, "php_modules");
	for (const relPath of moduleFiles) {
		const srcFile = resolve(modulesDir, relPath);
		const outFile = join(phpModulesDir, relPath);
		mkdirSync(dirname(outFile), { recursive: true });
		copyFileSync(srcFile, outFile);
	}
	logger.info(`[theme-assembler] 模块: ${moduleFiles.length} 个 PHP → php_modules/`);

	// 3. functions：src/functions/*.php → dist/functions.php（index.php 即入口）
	const functionsIndexSrc = resolve(functionsDir, "index.php");
	if (existsSync(functionsIndexSrc)) {
		// 直接拷贝所有 functions 文件到 dist/functions/ 目录
		const distFunctionsDir = join(outDir, "functions");
		copyDir(functionsDir, distFunctionsDir);
		// 生成 dist/functions.php 作为 Typecho 入口
		const functionsPhpContent = `<?php
if (!defined('__TYPECHO_ROOT_DIR__')) {
    exit;
}

require_once __DIR__ . '/functions/index.php';
`;
		writeFileSync(join(outDir, "functions.php"), functionsPhpContent, "utf-8");
		logger.info("[theme-assembler] functions: 已组装");
	}
}

export default function themeAssembler(options: ThemeAssemblerOptions): Plugin {
	const { srcDir, manifestPath = ".vite/manifest.json", entryNames } = options;
	let outDir = "";
	let isWatch = false;

	const doAssemble = (
		manifest: Manifest | null,
		logger: {
			info: (msg: string) => void;
			warn: (msg: string) => void;
			error: (msg: string) => void;
		}
	) => {
		assemble(srcDir, outDir, manifest, entryNames, logger);
	};

	return {
		name: "vite-plugin-theme-assembler",
		apply: "build",
		enforce: "post",
		configResolved(config) {
			outDir = resolve(config.root, config.build.outDir);
			isWatch = !!config.build.watch;
		},
		// 构建完成后（含 watch 每次重建）
		writeBundle() {
			const manifestFile = join(outDir, manifestPath);
			let manifest: Manifest | null = null;
			if (existsSync(manifestFile)) {
				manifest = JSON.parse(readFileSync(manifestFile, "utf-8"));
			} else {
				this.warn(`[theme-assembler] 未找到 manifest: ${manifestFile}`);
			}
			doAssemble(manifest, {
				info: (msg) => this.info(msg),
				warn: (msg) => this.warn(msg),
				error: (msg) => this.error(msg)
			});
		},
		// watch 模式下监听 PHP 文件变更
		configureServer() {
			// 不用 dev server，无需处理
		},
		buildStart() {
			if (!isWatch) return;
			// 将 PHP 文件加入 watch
			const phpFiles = globSync("**/*.php", { cwd: srcDir, absolute: true });
			for (const file of phpFiles) {
				this.addWatchFile(file);
			}
		},
		watchChange(id) {
			if (!id.endsWith(".php")) return;
			// PHP 变更时重新组装（用已有的 manifest）
			const manifestFile = join(outDir, manifestPath);
			let manifest: Manifest | null = null;
			if (existsSync(manifestFile)) {
				manifest = JSON.parse(readFileSync(manifestFile, "utf-8"));
			}
			this.info(`[theme-assembler] PHP 变更: ${basename(id)}，重新组装...`);
			doAssemble(manifest, {
				info: (msg) => this.info(msg),
				warn: (msg) => this.warn(msg),
				error: (msg) => this.error(msg)
			});
		}
	};
}
