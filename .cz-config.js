/*
 * @Author: mulingyuer
 * @Date: 2023-06-04 00:58:00
 * @LastEditTime: 2023-06-04 01:35:21
 * @LastEditors: mulingyuer
 * @Description: git cz 配置文件
 * @FilePath: \Typecho_Theme_JJ\.cz-config.js
 * 怎么可能会有bug！！！
 */
module.exports = {
	// type 类型（定义之后，可通过上下键选择）
	types: [
		{ value: ":sparkles: feat", name: "✨ feat: 新功能" },
		{ value: ":bug: fix", name: "🐛 fix: 修复bug" },
		{ value: ":lipstick: style", name: "💄 style: 更新界面与样式文件" },
		{ value: ":recycle: refactor", name: "♻️ refactor: 重构" },
		{ value: ":zap: perf", name: "⚡️ perf: 性能优化" },
		{ value: ":art: style", name: "🎨 style: 代码格式（不影响功能，例如空格、分号等格式修正）" },
		{ value: ":boom: breaking change", name: "💥 breaking change: 破坏性变更" },
		{ value: ":mag: search", name: "🔍 search: 改进搜索引擎优化" },
		{ value: ":package: build", name: "📦️ build: 打包" },
		{ value: ":pencil2: docs", name: "✏️ docs: 文档变更" },
		{ value: ":fire: delete", name: "🔥 delete: 删除代码或文件" },
		{ value: ":arrow_up: upgrade", name: "⬆️ upgrade: 升级依赖" },
		{ value: ":arrow_down: downgrade", name: "⬇️ downgrade: 降级依赖" },
		{ value: ":pushpin: chore", name: "📌 chore: 固定依赖在特定版本" },
		{ value: ":rewind: revert", name: "⏪ revert: 回滚代码" },
		{ value: ":twisted_rightwards_arrows: merge", name: "🔀 merge: 合并分支" },
		{ value: ":rocket: chore", name: "🚀 chore: 部署功能或性能优化(构建/工程依赖/工具)" },
		{ value: ":tada: init", name: "🎉 init: 项目初始化" },
		{ value: ":white_check_mark: test", name: "✅ test: 测试" },
		{ value: " :construction: wip", name: "🚧 wip: 进行中的工作(自定义)" }
	],

	// scope 类型（定义之后，可通过上下键选择）
	scopes: [
		["components", "组件相关"],
		["hooks", "hook 相关"],
		["utils", "utils 相关"],
		["element-ui", "对 element-ui 的调整"],
		["styles", "样式相关"],
		["deps", "项目依赖"],
		["auth", "对 auth 修改"],
		["other", "其他修改"],
		// 如果选择 custom，后面会让你再输入一个自定义的 scope。也可以不设置此项，把后面的 allowCustomScopes 设置为 true
		["custom", "以上都不是？我要自定义"]
	].map(([value, description]) => {
		return {
			value,
			name: `${value.padEnd(30)} (${description})`
		};
	}),

	// 是否允许自定义填写 scope，在 scope 选择的时候，会有 empty 和 custom 可以选择。
	// allowCustomScopes: true,

	// allowTicketNumber: false,
	// isTicketNumberRequired: false,
	// ticketNumberPrefix: 'TICKET-',
	// ticketNumberRegExp: '\\d{1,5}',

	// 针对每一个 type 去定义对应的 scopes，例如 fix
	/*
    scopeOverrides: {
      fix: [
        { name: 'merge' },
        { name: 'style' },
        { name: 'e2eTest' },
        { name: 'unitTest' }
      ]
    },
    */

	// 交互提示信息
	messages: {
		type: "确保本次提交遵循：前端代码规范！\n选择你要提交的类型：",
		scope: "\n选择一个 scope（可选）：",
		// 选择 scope: custom 时会出下面的提示
		customScope: "请输入自定义的 scope：",
		subject: "填写简短精炼的变更描述：\n",
		body: '填写更加详细的变更描述（可选）。使用 "|" 换行：\n',
		breaking: "列举非兼容性重大的变更（可选）：\n",
		footer: "列举出所有变更的 ISSUES CLOSED（可选）。 例如: #31, #34：\n",
		confirmCommit: "确认提交？"
	},

	// 设置只有 type 选择了 feat 或 fix，才询问 breaking message
	allowBreakingChanges: ["feat", "fix"],

	// 跳过要询问的步骤
	skipQuestions: ["scope", "body", "breaking", "footer"],

	subjectLimit: 100, // subject 限制长度
	breaklineChar: "|" // 换行符，支持 body 和 footer
	// footerPrefix : 'ISSUES CLOSED:'
	// askForBreakingChangeFirst : true,
};
