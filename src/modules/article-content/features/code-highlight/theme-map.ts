/**
 * @description: 后台「文章代码块主题」key → shiki 主题 id 的别名表。
 * 旧 key 与 shiki 主题名并不一一对应（例如 github → github-light），故这一层是纯数据映射，
 * 未命中的一律回落 juejin（与迁移前"无/未配置 → juejin"的语义一致）。
 */
const THEME_ALIAS: Record<string, string> = {
	juejin: "juejin",
	github: "github-light",
	"github-gist": "github-light",
	"atom-one-dark": "one-dark-pro",
	"atom-one-light": "one-light",
	monokai: "monokai",
	"monokai-sublime": "monokai",
	srcery: "gruvbox-dark-hard",
	tomorrow: "github-light-default",
	"tomorrow-night-blue": "github-dark-default",
	"tomorrow-night-eighties": "github-dark-dimmed",
	// 旧库里的 tomorrow-night.css 与 github.css 同字节，现状就是浅色，保持浅色目标
	"tomorrow-night": "github-light",
	smartblue: "github-light",
	"atelier-sulphurpool-light": "snazzy-light",
	androidstudio: "material-theme-darker",
	"a11y-dark": "github-dark-high-contrast",
	"a11y-light": "github-light-high-contrast",
	zenburn: "slack-dark",
	vuepress: "github-dark"
};

/** 兜底主题 id，必须是 themes/index.ts 登记表里存在的键 */
export const FALLBACK_THEME_ID = "juejin";

/**
 * @description: 把后台 key 解析为 shiki 主题 id；空值或未命中统一回落 juejin
 * @param {string | null | undefined} key 文章字段 highlightTheme 的值
 */
export function resolveThemeId(key: string | null | undefined): string {
	if (!key) return FALLBACK_THEME_ID;
	return THEME_ALIAS[key] ?? FALLBACK_THEME_ID;
}
