# build 构建 PHP 目录结构调整

## 背景与目标

当前构建产物把 `src/modules/**/*.php` 平移到了 `dist/php_modules/`，与源码目录名不一致；页面级组件也没有就近存放的位置。本次调整目标：

1. `src/modules/**/*.php` → `dist/modules/**`，保持目录结构一致（干掉 `php_modules` 这层命名差异）。
2. `src/pages/<name>/components/**/*.php` → `dist/pages/<name>/components/**`，让页面可以像 Vue 项目一样就近放页面级组件。
3. `src/pages/<name>/<name>.php` → `dist/<name>.php` 的规则**不变**（`home` → `index.php`），否则 Typecho 找不到页面模板。
4. 借此机会消灭 `$this->need()` 中 `./`、`/` 前缀混用的现状，统一为 `/modules/...` 风格（相对主题根）。

## 现状调研结论

### 引用现状（grep 实测）

- 全仓库 `$this->need()` 共 **95 处**，分布在 15 个文件（8 个页面 + 7 个模块）。
- 路径前缀两种风格混用：`./php_modules/...`（多数页面）与 `/php_modules/...`（多数模块内嵌套引用）。
- 现有嵌套引用链：`comment.php → comment-form/comment-list`、`comment-form → emoji.php`、`article-content → markdown.php`、`home/recent-comments → skeleton`、`notification/list → skeleton`，说明模块 PHP 之间互相 `need()` 是常态，移动目录时**模块内部引用也必须同步改**。
- `page.php` / `post.php` 引用了 `php_modules/post/*`（如 `directory-tree`、`articles-related`），这些是 src/modules/post/ 下的文章页专属子模块，属于第 1 条迁移范围，不是页面 components。

### Typecho `need()` 路径解析机制（关键约束）

`Widget_Archive::need()` 实际解析规则：以**当前主题根目录**（`usr/themes/<themeName>/`）为基准拼接，**不是相对当前 PHP 文件**。

- `/modules/xx.php` → `<themeDir>/modules/xx.php`（开头的 `/` 只是"主题根"的写法，非系统根）
- `./modules/xx.php` → 同样落到 `<themeDir>/modules/xx.php`（`.` 被规范化掉）
- 因此：`need('/modules/a.php')` 与 `need('./modules/a.php')` 等价，全项目统一成哪一种都行，推荐 `/modules/...`。

**结论：只要源内引用路径与 dist 实际落盘位置一致即可，`/` 与 `./` 无需区分迁移，但建议顺手统一为 `/` 前缀。**

## 迁移方案

### A. theme-assembler.ts 改动（[theme-assembler.ts](vite/plugin/theme-assembler.ts#L161-L170)）

1. **模块拷贝目标改名**：
   - `phpModulesDir = join(outDir, "php_modules")` → `join(outDir, "modules")`
   - glob、层级保留逻辑不变。
2. **新增页面 components 拷贝**：
   - 页面 glob 从 `"*/*.php"` 拆成两类：
     - `*/<pageName>.php`（页面模板，保持 → `dist/<pageName>.php` / `index.php`）
     - `*/components/**/*.php`（页面组件，→ `dist/pages/<pageName>/components/**`）
   - 注意现有 glob `"*/*.php"` 只匹配一层，`components/**` 需要独立 glob 规则，避免把 components 里的 PHP 误当页面模板输出到 dist 根。
3. **旧产物清理**：dist 不自动清空，迁移后 `dist/php_modules/` 会成为残留。构建时检测并删除 `dist/php_modules` 旧目录（`rmSync(recursive, force)`），防止增量 watch 构建残留。
4. **占位符注入逻辑不变**（只处理页面模板，components 里的 PHP 不注入资源标签）。

### B. 源码 `$this->need()` 路径批量改写（95 处）

规则：

- `./php_modules/` → `/modules/`
- `/php_modules/` → `/modules/`

即统一替换字符串 `php_modules/` 为 `modules/` 即可（两种前缀最终解析一致，但顺手把 `./` 归一为 `/`）。

涉及文件清单（15 个，来自 grep）：

- 页面（8）：[404.php](src/pages/404/404.php)、[archive.php](src/pages/archive/archive.php)、[category.php](src/pages/category/category.php)、[home.php](src/pages/home/home.php)、[links.php](src/pages/links/links.php)、[notification.php](src/pages/notification/notification.php)、[page.php](src/pages/page/page.php)、[post.php](src/pages/post/post.php)
- 模块（7）：[article-content.php](src/modules/article-content/article-content.php)、[comment.php](src/modules/comment/comment.php)、[comment-form.php](src/modules/comment/comment-form/comment-form.php)、[comment-list.php](src/modules/comment/comment-list/comment-list.php)、[recent-comments.php](src/modules/home/recent-comments/recent-comments.php)、[links/content.php](src/modules/links/content.php)、[notification/list.php](src/modules/notification/list.php)

### C. 目录约定文档同步

- [.github/copilot-instructions.md](.github/copilot-instructions.md)「五、目录约定」表格需更新：
  - `src/modules/<name>/` 产物路径 `dist/php_modules/` → `dist/modules/`
  - 新增一行：`src/pages/<name>/components/` → `dist/pages/<name>/components/`，并注明"页面级组件 PHP，不注入 VITE_HEAD_TAGS"
- 检查 `vite/plugin/theme-assembler.ts` 顶部注释里的描述同步更新。
- grep 一遍 `php_modules` 确认无其他残留引用（README、docker 挂载、zip 打包脚本 [scripts/zip.ts](scripts/zip.ts) 等）。

## 执行步骤（按序）

1. [x] 改 theme-assembler.ts：输出目录改名 + 新增 components 拷贝 + 旧 php_modules 清理 + 注释更新
2. [x] 批量替换 15 个 PHP 文件中的 `php_modules/` → `modules/`（顺统一 `./` → `/`）
3. [x] 删旧 `dist/` 后 `pnpm build`，确认产物结构：`dist/modules/**`、`dist/pages/...`（如有 components）、无 `dist/php_modules`
4. [x] 容器内 `php -l` 抽查改动文件 + docker sqlite 环境逐页面点开验证（首页/文章页/评论/归档/404，覆盖嵌套 need 链）
5. [x] 更新 copilot-instructions.md 目录约定 + repo memory 笔记
6. [x] grep `php_modules` 全仓确认零残留

## 风险点

- **缓存/opcache**：docker 联调容器若开了 opcache，改 dist 后需确认刷新生效（本项目 Apache 镜像默认没开，改 dist 即生效，已在 memory 验证）。
- **zip 打包脚本**：[scripts/zip.ts](scripts/zip.ts) 若按目录白名单打包需检查是否硬编码了 `php_modules`。
- **Typecho 后台"外观编辑"**：后台编辑器按主题目录列文件，`modules/` 目录名变更不影响功能，只是展示路径变化。
- **页面 components 与模块的取舍**：通用组件仍放 `src/modules/`；`components/` 只放页面专属、不复用的 PHP，避免两套心智混用。需要在 copilot-instructions.md 写清边界。