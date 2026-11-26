import type { ThemeRegistration } from "shiki";

/**
 * @description: 由旧 public/css/highlight/juejin.css（即 hljs 9.x 的 github 主题）逐个选择器组转写而来，色值零改动
 * .hljs-xxx 类名反推 TextMate scope 时的归位说明：
 * - hljs 的 "comment" 覆盖了 quote/comment 两类 → punctuation.definition.comment + string.comment
 * - "keyword / selector-tag / subst" 统一为加粗的关键字色 → keyword.control 等
 * - "section/selector-id/title"（#900 加粗）在旧样式里独立成组，这里落到 markup.heading
 * - "meta"（#999 加粗）无法从通用 meta scope 精确命中，归入 support 兜底色
 * 唯一有损点：次级 scope（如 entity.name.function vs entity.name.class）会同色，属反推类名的固有歧义，肉眼基本无感。
 */
export const juejinTheme: ThemeRegistration = {
	name: "juejin",
	type: "light",
	bg: "#f8f8f8",
	fg: "#333",
	settings: [
		{
			scope: ["comment", "punctuation.definition.comment", "string.comment"],
			settings: { foreground: "#998", fontStyle: "italic" }
		},
		{
			scope: ["keyword", "storage", "storage.type", "keyword.control", "keyword.operator.word"],
			settings: { foreground: "#333", fontStyle: "bold" }
		},
		{
			scope: [
				"constant",
				"constant.numeric",
				"constant.language",
				"variable.language",
				"variable.other",
				"tpl.template-variable",
				"markup.meta.diff.header"
			],
			settings: { foreground: "teal" }
		},
		{
			scope: ["string", "punctuation.definition.string", "string.doctag", "meta.diff"],
			settings: { foreground: "#d14" }
		},
		{
			scope: ["entity.name.section", "entity.name.tag", "entity.name.selector", "selector-id", "markup.heading"],
			settings: { foreground: "#900", fontStyle: "bold" }
		},
		{
			scope: [
				"entity.name.class",
				"entity.name.type",
				"entity.name.function",
				"entity.other.inherited-class",
				"support.type",
				"support.class"
			],
			settings: { foreground: "#458", fontStyle: "bold" }
		},
		{
			scope: ["meta.tag", "entity.other.attribute-name", "markup.tag", "attribute-name"],
			settings: { foreground: "navy", fontStyle: "" }
		},
		{ scope: ["string.regexp", "markup.underline.link", "link"], settings: { foreground: "#009926" } },
		{
			scope: ["constant.other.symbol", "punctuation.definition.list", "markup.bullet", "markup.symbol"],
			settings: { foreground: "#990073" }
		},
		{
			scope: ["support.function", "support.constant", "support.builtin", "builtin-name"],
			settings: { foreground: "#0086b3" }
		},
		{ scope: ["meta", "meta.object-literal.key"], settings: { foreground: "#999", fontStyle: "bold" } },
		{ scope: ["markup.deleted", "markup.diff.deleted"], settings: { background: "#fdd" } },
		{ scope: ["markup.inserted", "markup.diff.inserted"], settings: { background: "#dfd" } },
		{ scope: ["markup.bold", "markup.strong"], settings: { fontStyle: "bold" } },
		{ scope: ["markup.italic", "markup.emphasis"], settings: { fontStyle: "italic" } }
	]
};
