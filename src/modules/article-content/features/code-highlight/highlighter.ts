import { createBundledHighlighter } from "shiki";
import type { HighlighterGeneric } from "shiki";
import { bundledLanguages } from "shiki/langs";
import { createOnigurumaEngine } from "shiki/engine/oniguruma";
// import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import { bundledThemeTable } from "./themes";

/**
 * @description: 正则引擎加载器（工厂层要求传"加载函数"，实例在创建时由 shiki 调用得到）
 * 默认用 Oniguruma WASM：兼容性最好，207 KB 载荷被 import() 懒加载，不占首屏。
 * 切到 JS 引擎只需同时改掉下面两行 import，并解开最后一行注释；JS 引擎无需 wasm，
 * 且必须带 { forgiving: true }，否则遇到无法转换的 Oniguruma 语法会直接抛错（默认 strict）。
 */
const loadEngine = () => createOnigurumaEngine(import("shiki/wasm"));
// const loadEngine = () => createJavaScriptRegexEngine({ forgiving: true });

// shiki 只关心语言/主题 id 字符串，用 any 占位避免与注册表泛型互相牵制
type AnyHighlighter = HighlighterGeneric<any, any>;

/** highlighter 实例缓存，语言与主题全部按需加载 */
let highlighterPromise: Promise<AnyHighlighter> | undefined;

/**
 * @description: 获取全局唯一的高亮器实例。
 * createBundledHighlighter 返回的是"创建函数"而非实例，查找表里的语言/主题只是登记、不会预加载；
 * 因此创建时显式传空数组，再在每次高亮时按需 loadLanguage / loadTheme（两者幂等）。
 */
function getHighlighter(): Promise<AnyHighlighter> {
	return (highlighterPromise ??= createBundledHighlighter({
		// 全量 360 门语言，仅登记不加载；如需精选清单把这一行换成显式映射即可（体积立刻回落）
		langs: bundledLanguages,
		themes: bundledThemeTable,
		engine: loadEngine
	})({ langs: [], themes: [] }));
}

/**
 * @description: 唤醒 Oniguruma WASM 载荷下载（首个代码块进入视口时才真正需要它）。
 * 失败静默忽略，正常触发流程不受影响。
 */
export function preloadWasm() {
	const run = () => {
		import("shiki/wasm").catch((error) => console.warn("[code-highlight] WASM 预热失败：", error));
	};
	if (typeof requestIdleCallback === "function") {
		requestIdleCallback(run);
	} else {
		window.setTimeout(run, 2000);
	}
}

/**
 * @description: 高亮单块代码，返回按行拆分的 tokens、主题前景色与背景色
 * @param {string} code 纯代码文本（不含行号）
 * @param {string} langId shiki 语言 id，未知语言传 "text"
 * @param {string} themeId shiki 主题 id
 */
export async function highlightCode(
	code: string,
	langId: string,
	themeId: string
): Promise<{ lines: import("shiki").ThemedToken[][]; fg: string; bg: string }> {
	const highlighter = await getHighlighter();
	await Promise.all([highlighter.loadTheme(themeId), highlighter.loadLanguage(langId)]);
	const result = highlighter.codeToTokens(code, { lang: langId, theme: themeId });
	const fg = result.fg ?? "#000";
	const bg = result.bg ?? "transparent";
	return { lines: result.tokens, fg, bg };
}
