# 将当前生态迁移成 Vite 8 生态

当前项目是早期的 webpack 构建（webpack 5 + babel-loader + sass-loader + mini-css-extract-plugin + html-webpack-plugin），核心诉求只有三件事：

1. 处理 TS / SCSS；
2. 多页面入口构建（`src/pages/*/index.ts`，每个页面入口 = `main.ts + 页面自身 index.ts`）；
3. 构建产物不是 HTML，而是为每个入口生成一个 PHP 模板片段（`dist/head/<name>.php`，内容为 `<script>` / `<link>` 标签），由 Typecho 的 PHP 模板（`index.php`、`post.php` 等）通过 `$this->need('./dist/head/xxx.php')` 引入。

迁移目标：用 Vite 8（Rolldown + Oxc + Lightning CSS）替换整条 webpack 流水线，产物结构与 PHP 引入方式保持不变。

## Vite 8 关键能力确认（已查阅官方文档）

- **`build.watch`**：Vite 8 支持 `vite build --watch` 或配置 `build.watch: {}` 启用 Rolldown watcher，专为"非 dev server 的纯构建监听"场景设计 —— 正好替代当前 `webpack --watch` 的开发模式（本项目不跑 dev server，PHP 由 Docker 里的 Typecho 渲染，前端只需把资源构建到 `dist/` 并监听改动）。
- **多入口**：通过 `build.rolldownOptions.input`（或顶层 `input`）传对象即可，等价于 webpack 的 `entry` 对象。
- **`build.manifest`**：生成 `.vite/manifest.json`，记录"入口名 → 带 hash 的产物文件名 + 关联 CSS"映射，是实现 PHP 模板注入的官方推荐方式（Backend Integration 模式）。
- **CSS**：内置 PostCSS 支持（自动读取 `postcss.config.js`），内置 sass 编译（`css.preprocessorOptions.scss.additionalData` 替代 sass-loader 的 `additionalData`），默认 Lightning CSS 压缩。Sass 选用官方高性能原生版本 `sass-embedded`（比纯 JS 版 `sass` 快数倍，Vite 现代编译器 API 原生支持）。
- **`build.rolldownOptions.output.codeSplitting`**：替代 webpack 的 `splitChunks`（注意：Vite 8 已移除对象形式的 `manualChunks`，函数形式也已废弃）。
- **注意点（Vite 8 breaking changes）**：
  - 默认构建目标是 `baseline-widely-available`（Chrome 111+ 等），可通过 `build.target` 下调，最低支持 `es2015`（ES6）—— 本项目要求最低兼容 ES6、不考虑 ES5，因此直接设 `build.target: 'es2015'`，语法降级由 Oxc 完成，**无需 babel、core-js，也无需 `@vitejs/plugin-legacy`**（该插件面向不支持原生 ESM 的 ES5 时代浏览器，与本项目目标不符）；
  - `process.env.NODE_ENV` 不再自动注入（src/main.ts 中有使用），需改用 `import.meta.env.DEV` / `import.meta.env.PROD`，或用 `define` 配置替换；
  - Vue 的 `__VUE_OPTIONS_API__` 等特性 flag 需通过 `define` 配置（原来在 webpack.dev.ts 的 DefinePlugin 中）；
  - `manualChunks` 对象形式已移除，需改用 `codeSplitting`。

## 迁移步骤

### 1. 安装依赖

新增：

- `vite` ^8.0.0
- `sass-embedded`（Sass 官方高性能原生版本，替代纯 JS 的 `sass` 包，编译速度数倍提升）
- `oxlint`（oxc 生态的 linter，Rust 实现，比 ESLint 快 50-100 倍，内置 500+ 规则，含 typescript/react/vue/import 等常用插件规则，零配置可用）
- `oxfmt`（oxc 生态的 formatter，Prettier 兼容的 Rust 实现，替代 Prettier；配置项与 Prettier 基本一致，可平移现有 `.prettierrc.json` 风格）

移除（确认无其他用途后）：

- `webpack`、`webpack-cli`、`webpack-merge`、`webpackbar`、`webpack-bundle-analyzer`
- `babel-loader`、`@babel/*`（cli/core/preset-env/preset-typescript/plugin-* 等）、`core-js` —— ES6 最低目标由 Oxc 直接降级，无需 babel 转译与 polyfill
- `css-loader`、`sass-loader`、`postcss-loader`、`mini-css-extract-plugin`、`html-webpack-plugin`、`compression-webpack-plugin`
- `sass`（由 `sass-embedded` 取代）
- `prettier`（由 `oxfmt` 取代，若有该依赖；当前仓库未发现 package.json 中声明，需确认是否为全局安装）
- 保留：`postcss`、`autoprefixer`（Vite 直接复用 `postcss.config.js`）

### 2. 编写 vite.config.ts

要点（对照现有 webpack.common.ts 逐项映射）：

- `input`：用 `glob` 扫描 `src/pages/*/index.ts` 生成多入口对象（逻辑搬自 `webpack/entryAndHtml.ts` 的 `createEntry`）。注意当前 webpack 每个入口是 `[main.ts, page.ts]` 数组，迁移时改为在每个页面 `index.ts` 顶部 `import "@/main"`（或在 main.ts 基础上统一改造），因为 Rolldown 的 input 不支持数组形式的多文件合并入口语义（数组会走 lib 模式的多入口，行为不同）。
- `resolve.alias`：`@ -> ./src`，与现有一致。
- `css.preprocessorOptions.scss.additionalData`：注入全局 scss（color/mixins/variable 三个文件），注意 Dart Sass 现代 API 建议改用 `@use` 而非 `@import`。
- `define`：注入 `__VUE_OPTIONS_API__: false`、`__VUE_PROD_DEVTOOLS__`（按环境区分）、`__VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false`。
- `build.target: 'es2015'`：最低兼容 ES6（不考虑 ES5），语法降级由 Oxc 完成；如需同步下调 CSS 降级目标可设 `build.cssTarget`。
- `css.preprocessorOptions.scss`：除 `additionalData` 外，配合 `sass-embedded` 使用现代编译器 API（modern API 下 `@import` 会有 deprecation warning，见风险点）。
- `build.manifest: true`：生成 manifest 供 PHP 模板生成插件消费。
- `build.outDir: 'dist'`、`build.emptyOutDir: true`。
- `build.rolldownOptions.output`：
  - `entryFileNames: 'scripts/[name].[hash:8].js'`、`chunkFileNames`、`assetFileNames`（CSS 到 `styles/`、图片到 `images/`、字体到 `fonts/`），对齐现有产物目录结构；
  - `codeSplitting`：配置 vendor 分组（node_modules 合并为 vendors chunk），对齐现有 splitChunks 策略。
- `build.watch`：dev 模式下启用（或直接用 CLI `vite build --watch`）。
- 静态资源：`static/` 目录目前是 PHP 直接引用的独立资源（不进构建），保持现状即可，不要配置成 `publicDir` 被复制进 dist。

### 3. 自研 Vite 插件：生成 PHP head 模板（替代 html-webpack-plugin）

这是迁移中唯一需要自研的部分，逻辑很简单：

- 在 `writeBundle` / `closeBundle` 钩子中读取 `dist/.vite/manifest.json`；
- 对每个入口生成 `dist/head/<name>.php`，内容等价于现有 `webp由于是非 HTML 自定义入口，modulepreload polyfill 不会自动注入——ES6 目标浏览器均支持 `<script type="module">`，可直接 `build.modulePreload: { polyfill: false }` 关闭（或在入口手动 `import 'vite/modulepreload-polyfill'`）ript>` 标签；
- 资源 URL 前缀拼接 `<?php echo $this->options->themeUrl; ?>/dist`（对齐现有 `publicPath` 行为）；
- script 标签需要 `type="module"`（Vite 产物是原生 ESM）；若使用 plugin-legacy，还需输出 nomodule 兜底标签和 modulepreload polyfill。

### 4. 源码适配（小改动）

- `src/main.ts`：`process.env.NODE_ENV !== "development"` 改为 `import.meta.env.PROD`（或用 define 保留原写法，推荐直接改为 Vite 原生方式）。
- 检查是否还有依赖 webpack 特有 API 的代码（`require.context`、魔法注释等，初步排查未发现）。
- `src/types/global.d.ts` 中补充 `/// <reference types="vite/client" />` 以获得 `import.meta.env` 类型。

### 5. 脚本与命令调整（package.json）

- `dev`：`vite build --watch`（等价现有 webpack watch 模式；不需要 dev server，因为页面由 PHP 渲染）。
- `build`：`vite build && bumpp --no-commit --no-tag --no-push && ts-node buildCommand/updateVersion.ts`（后半段版本号逻辑不变）。
- `analyze`：可换用 `rolldown` 自带的分析能力或 `source-map-explorer` 等（webpack-bundle-analyzer 不再适用，属于可选项，优先级低）。
- gzip 压缩产物（compression-webpack-plugin）：Vite 侧无内置等价物，实际由服务器（nginx）做 gzip 更合理；若确需 `.gz` 文件，可写个简单的 post-build 脚本，优先级低。
- `tsconfig.json`：`module`/`moduleResolution` 调整为 `ESNext` + `Bundler`，`types` 中加入 `vite/client`。

### 5.5 代码校验与格式化（oxc 工具链）

新架构统一使用 oxc 生态替代传统的 ESLint + Prettier 组合，与 Vite 8 的 Oxc 转译链路同源（同一 AST，无需重复解析）：

- **lint（oxlint）**：
  - 新增 `.oxlintrc.json`（或 `oxlint.config.ts`）配置：`categories` 开启 `correctness`（默认）+ 视情况开启 `suspicious`/`perf`；`plugins` 开启 `typescript`、`import`、`vue`；`env` 设置 `browser: true`；
  - 现有代码首次全量跑 `oxlint --fix` 修一批可自动修复的问题，剩余告警逐一确认是否收紧；
  - 编辑器侧安装 VS Code 的 `oxc.oxc-vscode` 扩展获得实时诊断（同一扩展同时提供 lint 与 format）。
- **format（oxfmt）**：
  - 用 `oxfmt --init` 或手动从 `.prettierrc.json` 迁移配置（`printWidth: 120`、`useTabs: true`、`semi: true`、`singleQuote: false`、`trailingComma: "none"`、`endOfLine: "lf"` 等核心项均兼容），确认格式 diff 可接受后删除 `.prettierrc.json`；
  - 首次全量 `oxfmt --write` 格式化一遍（建议单独一个 commit，避免污染后续功能改动的 diff）；
  - 注意确认 oxfmt 当前对 `.vue` / `.scss` / `.php` 文件的支持范围：不支持的文件类型（如 php、scss）维持现状不格式化，或保留 prettier 仅用于这些类型（视迁移时 oxfmt 的实际能力决定）。
- **接入钩子**：husky pre-commit 增加 `pnpm lint-staged`（或直接 `oxlint --fix && oxfmt` 全量跑，oxc 的速度足以支撑全量），新增 `lint-staged` 依赖。
- **新增 scripts**：`"lint": "oxlint"`、`"lint:fix": "oxlint --fix"`、`"format": "oxfmt --write ."`、`"format:check": "oxfmt --check ."`。

### 6. 验证与清理

- 对比迁移前后 `dist/` 产物结构（`scripts/`、`styles/`、`images/`、`fonts/`、`head/*.php`）；
- 在 dev-env 的 Docker Typecho 环境中逐页面验证（home/post/page/archive/category/links/notification/404 共 8 个入口）；
- 确认无误后删除 `webpack/` 目录及相关依赖，`buildCommand/`、`postcss.config.js` 保留。

## 风险点
`build.target: 'es2015'` 只降级语法、不含任何 polyfill，且 Vite 产物的运行底线是原生 ESM + dynamic import + `import.meta`（约 Chrome 64+/Safari 11.1+）；页面代码若用到 ES6 之后的运行时 API 需自行确认兼容性（如 `ResizeObserver` 已有 `resize-observer-polyfill` 依赖兜底），ES5 时代浏览器（IE 等）明确放弃
1. **PHP 模板生成插件是自研代码**，需仔细处理 CSS/JS 的顺序与依赖（manifest 中的 `css`、`imports` 字段）；
2. **浏览器兼容**：Vite 默认目标比现有 babel + core-js 方案高，如需兼容旧浏览器必须引入 `@vitejs/plugin-legacy`；
3. **SCSS `@import` 弃用**：Vite 用的是 Dart Sass 现代编译器，全局注入的 `@import` 写法会有 deprecation warning，建议顺便迁移为 `@use`；
4. **chunk 拆分差异**：webpack 的 `runtimeChunk`（manifest 内联运行时代码）在 Rolldown 中没有完全对应物，需要验证产物加载顺序是否受影响（ESM + modulepreload 机制下通常无需关心）；
5. **oxfmt 与 Prettier 的格式差异**：oxfmt 追求 Prettier 兼容但非 100% 一致，首次全量格式化可能产生大量 diff，需审查关键文件确认无意外变更；且 oxfmt 对非 JS/TS 文件（scss、php、ejs 模板等）的支持范围需在迁移时核实，可能需保留 prettier 处理这些文件类型；
6. **oxlint 规则覆盖**：oxlint 规则集是 ESLint 生态的子集，若后续需要某些冷门 ESLint 插件规则（如特定的 import 排序、安全规则），需提前确认 oxlint 是否已支持。
