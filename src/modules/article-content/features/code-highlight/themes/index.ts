import type { ThemeInput } from "shiki";
import { juejinTheme as juejin } from "./juejin";

/**
 * @description: shiki 主题登记表。键必须是 shiki 主题 id（要与各主题注册时的 name 一致），
 * 旧后台 key → 主题的转换在 ../theme-map.ts。
 * 表里的值都是"加载函数"：注册时不会预加载，运行期只有真正命中的那个主题会被 import()。
 */
export const bundledThemeTable: Record<string, ThemeInput> = {
	// 自建保真主题（由旧 hljs github/juejin CSS 转写），随主包进入，零额外请求
	juejin,
	"github-light": () => import("@shikijs/themes/github-light").then((m) => m.default),
	"github-light-default": () => import("@shikijs/themes/github-light-default").then((m) => m.default),
	"github-light-high-contrast": () => import("@shikijs/themes/github-light-high-contrast").then((m) => m.default),
	"github-dark": () => import("@shikijs/themes/github-dark").then((m) => m.default),
	"github-dark-default": () => import("@shikijs/themes/github-dark-default").then((m) => m.default),
	"github-dark-dimmed": () => import("@shikijs/themes/github-dark-dimmed").then((m) => m.default),
	"github-dark-high-contrast": () => import("@shikijs/themes/github-dark-high-contrast").then((m) => m.default),
	"one-dark-pro": () => import("@shikijs/themes/one-dark-pro").then((m) => m.default),
	"one-light": () => import("@shikijs/themes/one-light").then((m) => m.default),
	monokai: () => import("@shikijs/themes/monokai").then((m) => m.default),
	"gruvbox-dark-hard": () => import("@shikijs/themes/gruvbox-dark-hard").then((m) => m.default),
	"snazzy-light": () => import("@shikijs/themes/snazzy-light").then((m) => m.default),
	"material-theme-darker": () => import("@shikijs/themes/material-theme-darker").then((m) => m.default),
	"slack-dark": () => import("@shikijs/themes/slack-dark").then((m) => m.default)
};
