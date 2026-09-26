/*
 * @Author: mulingyuer
 * @Date: 2026-09-21 20:40:58
 * @LastEditTime: 2026-09-26 16:56:47
 * @LastEditors: mulingyuer
 * @Description: Vite 8 构建配置
 * @FilePath: \Typecho_Theme_JJ\vite.config.ts
 * 怎么可能会有bug！！！
 */
import { defineConfig } from "vite";
import type { PluginOption } from "vite";
import { resolve } from "node:path";
import { globSync } from "glob";
import browserslist from "browserslist";
import { browserslistToTargets } from "lightningcss";
import themeAssembler from "./vite/plugin/theme-assembler";

/**
 * 从 .browserslistrc 派生 lightningcss targets。
 * 注意：是 browserslist() 不传参时会自动读取项目根目录的 .browserslistrc；
 * Vite 自身并不会读取该文件，必须显式传给 css.lightningcss.targets。
 */
const cssTargets = browserslistToTargets(browserslist());

//入口文件路径
const pagesDir = resolve(__dirname, "src/pages");
//源码目录
const srcDir = resolve(__dirname, "src");

/** 生成多入口对象：{ home: src/pages/home/index.ts, ... } */
function createEntry(): Record<string, string> {
	const entry: Record<string, string> = {};
	const files = globSync("*/index.ts", { cwd: pagesDir });
	for (const filePath of files) {
		const name = filePath.split(/(\/|\\)/i)[0];
		entry[name] = resolve(pagesDir, filePath);
	}
	return entry;
}

export default defineConfig(({ command }) => {
	const entry = createEntry();
	const plugins: PluginOption[] = [
		themeAssembler({
			srcDir,
			entryNames: Object.fromEntries(Object.keys(entry).map((name) => [`src/pages/${name}/index.ts`, name]))
		})
	];

	return {
		plugins,
		resolve: {
			alias: {
				"@": resolve(__dirname, "src")
			}
		},
		define: {
			__VUE_OPTIONS_API__: false,
			__VUE_PROD_DEVTOOLS__: command === "serve" ? true : false,
			__VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false
		},
		css: {
			transformer: "lightningcss",
			lightningcss: {
				targets: cssTargets
			},
			preprocessorOptions: {
				scss: {
					additionalData: `
						@use "@/styles/color.scss" as *;
						@use "@/styles/mixins.scss" as *;
						@use "@/styles/variable.scss" as *;
					`
				}
			}
		},
		build: {
			target: "es2015",
			outDir: "dist",
			emptyOutDir: true,
			manifest: true,
			/**
			 * 关闭 modulepreload polyfill 注入（默认 true 会注入约 1KB 的兼容代码）。
			 * 本项目由 theme-assembler 手动输出 <link rel="modulepreload"> 标签，
			 * 不支持的旧浏览器（如 Safari 11-14）会静默忽略并回退到 <script type="module">，
			 * 仅失去预加载优化，不影响功能。
			 */
			modulePreload: {
				polyfill: false
			},
			rolldownOptions: {
				input: entry
			}
		}
	};
});
