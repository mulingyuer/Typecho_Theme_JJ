# bug修复

当前主题build后，访问`http://jj.test/`会显示错误，请通过vscode内置的浏览器进行联调修复

## 现状诊断（已确认）

1. **根因**：在 Webpack → Vite 8 构建迁移期间，多个含中文的 PHP 源文件经历 UTF-8 ↔ GBK 双重错误转换，字符被替换为 U+FFFD（`�`），吞掉了引号/换行：
   - `src/functions/seo.php` 16、18 行字符串未闭合 → **PHP Parse Error，首页 fatal**
   - `src/functions/utils.php` 50 行注释吞掉换行，导致后面的 `if` 被注释 → **逻辑错误**
2. **构建链路无编码问题**：`vite/plugin/theme-assembler.ts` 统一用 utf-8 读写拷贝 PHP，源文件坏 → 产物逐字节一致地坏。
3. **dist 产物同构损坏**：`dist/functions/seo.php` 与源文件错误相同，Typecho 加载 `functions.php` → `require seo.php` → Parse Error，首页白屏/500。
4. **工作区已有部分手工修复**（未提交），但采用"把 `�` 替换成 `锟`"的偷懒方式，语法错误虽消除，中文文案仍错误（如 `关键锟?`），且 `theme-config.php` 尾部有未配平的残留注释。

## 修复计划

### 阶段 1：精确修复乱码 PHP 源文件（核心）

> 原则：不做"批量替换 `�`"——每个 `�` 吞掉的字符数不同（有的吞 1 个汉字+引号，有的吞换行），必须对照 git 历史中的原始文案逐处恢复（`git show <乱码引入前commit>:<path>`）。

- [ ] 1.1 用 VS Code 内置浏览器打开 `http://jj.test/`，记录首页实际报错（Parse error 的文件与行号），作为验收基线
- [ ] 1.2 逐文件修复乱码（按严重度排序）：
  - [ ] `src/functions/seo.php` —— 16、18 行字符串未闭合（首页 fatal），25、57、134 行注释乱码
  - [ ] `src/functions/utils.php` —— 15-21 行时间单位数组、34 行 `'前`、50 行注释吞 `if`（逻辑 bug）、143/152/158/169 行 JSON 提示语、257/259/270 行表单文案、331 行注释
  - [ ] `src/functions/theme-config.php` —— 尾部残留乱码注释未正确闭合
  - [ ] 全库扫描兜底：`grep -rn "�\|锟" src/`（重点查 `src/modules`、`src/pages` 下的 PHP），确保无遗漏
- [ ] 1.3 中文文案按 git 历史原始版本逐段比对恢复
- [ ] 1.4 语法自检：每个改完的 PHP 文件用 `php -l`（无本机 PHP 则 `docker compose exec` 进容器 lint）

### 阶段 2：构建并浏览器联调验证

- [ ] 2.1 运行 `pnpm run build` 重新构建
- [ ] 2.2 校验 dist 产物：用 node 扫描脚本确认 `dist/functions/*.php` 已无 `�` / 未闭合字符串
- [ ] 2.3 VS Code 内置浏览器访问 `http://jj.test/` 验证：
  - [ ] 首页正常渲染，无 PHP 报错
  - [ ] 页头 SEO 标题（`blogTitle`）中文正常（搜索页/分类页标题是乱码重灾区）
  - [ ] 抽查文章页：时间格式化（`X天前`）、缩略图（验证 utils.php 的 `if` 恢复执行）、点赞/浏览量接口（`promo` 返回的中文 msg）
- [ ] 2.4 若浏览器报新错，按报错位置回到阶段 1 修复

### 阶段 3：收尾与防回归

- [ ] 3.1 确认 `.gitattributes` 对 `*.php` 有 `text eol=lf`（或 `working-tree-encoding`）约束，避免再次发生 Git 编码自动转换事故（本次乱码的根本诱因）
- [ ] 3.2（可选）在 `vite/plugin/theme-assembler.ts` 组装流程中加校验：产物 PHP 若含 U+FFFD 则 `logger.error` 报警，防止脏文件进入 dist
- [ ] 3.3 更新本文件标记完成；提交修复（`fix: 修复 PHP 源文件编码损坏导致的语法错误`）

## 执行顺序

1.1（浏览器看真实报错）→ 1.2/1.3（修复主体，约 5 个文件 30+ 处）→ 1.4 + 2.x（构建 + 浏览器闭环验证）→ 阶段 3