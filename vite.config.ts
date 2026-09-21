/*
 * @Author: mulingyuer
 * @Description: Vite 8 构建配置（替代 webpack 流水线）
 * 怎么可能会有bug！！！
 */
import { defineConfig } from "vite";
import type { PluginOption } from "vite";
import { resolve } from "node:path";
import { globSync } from "glob";
import phpHead from "./vite/plugin/php-head";

//入口文件路径
const pagesDir = resolve(__dirname, "src/pages");

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
		phpHead({
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
			modulePreload: {
				polyfill: false
			},
			rolldownOptions: {
				input: entry,
				output: {
					entryFileNames: "scripts/[name].[hash:8].js",
					chunkFileNames: "scripts/[name].[hash:8].js",
					assetFileNames: (assetInfo) => {
						const name = assetInfo.names?.[0] ?? "";
						if (/\.css$/i.test(name)) return "styles/[name].[hash:8][extname]";
						if (/\.(woff2?|eot|ttf|otf)$/i.test(name)) return "fonts/[name].[hash:8][extname]";
						return "images/[name].[hash:8][extname]";
					},
					codeSplitting: {
						groups: [
							{
								name: "vendors",
								test: /[\\/]node_modules[\\/]/,
								priority: 10
							},
							{
								name: "common",
								test: /[\\/]src[\\/]/,
								minShareCount: 2,
								priority: 5
							}
						]
					}
				}
			}
		},
		publicDir: false
	};
});
