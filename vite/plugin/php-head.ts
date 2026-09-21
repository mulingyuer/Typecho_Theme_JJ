/*
 * @Author: mulingyuer
 * @Description: 生成 dist/head/<name>.php 模板片段（替代 html-webpack-plugin）
 * 怎么可能会有bug！！！
 */
import type { Plugin } from "vite";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

interface ManifestChunk {
	file: string;
	src?: string;
	isEntry?: boolean;
	isDynamicEntry?: boolean;
	css?: string[];
	imports?: string[];
	assets?: string[];
}

type Manifest = Record<string, ManifestChunk>;

export interface PhpHeadOptions {
	/** manifest 文件路径（相对于 outDir） */
	manifestPath?: string;
	/** 生成目录（相对于 outDir） */
	headDir?: string;
	/** 入口名映射（manifest key -> php 文件名，不含扩展名） */
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

export default function phpHead(options: PhpHeadOptions): Plugin {
	const { manifestPath = ".vite/manifest.json", headDir = "head", entryNames } = options;
	let outDir = "";

	return {
		name: "vite-plugin-php-head",
		apply: "build",
		enforce: "post",
		configResolved(config) {
			outDir = config.build.outDir;
		},
		writeBundle() {
			const manifestFile = join(outDir, manifestPath);
			if (!existsSync(manifestFile)) {
				this.error(`[php-head] 未找到 manifest 文件: ${manifestFile}，请确认 build.manifest 已开启`);
			}
			const manifest: Manifest = JSON.parse(readFileSync(manifestFile, "utf-8"));
			const base = "<?php echo $this->options->themeUrl; ?>/dist";

			for (const [manifestKey, name] of Object.entries(entryNames)) {
				const chunk = manifest[manifestKey];
				if (!chunk) {
					this.warn(`[php-head] manifest 中未找到入口: ${manifestKey}`);
					continue;
				}

				const tags: string[] = [];
				// css 在前，保证加载顺序
				for (const css of collectCss(manifest, manifestKey)) {
					tags.push(`<link href="${base}/${css}" rel="stylesheet">`);
				}
				// modulepreload 静态依赖 chunk
				for (const file of collectImports(manifest, manifestKey)) {
					tags.push(`<link href="${base}/${file}" rel="modulepreload">`);
				}
				// 入口脚本
				tags.push(`<script src="${base}/${chunk.file}" type="module"></script>`);

				const outFile = join(outDir, headDir, `${name}.php`);
				mkdirSync(dirname(outFile), { recursive: true });
				writeFileSync(outFile, tags.join("\n"), "utf-8");
				this.info(`[php-head] 已生成 dist/${headDir}/${name}.php`);
			}
		}
	};
}
