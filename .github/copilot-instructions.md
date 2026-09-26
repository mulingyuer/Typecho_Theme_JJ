# Typecho_Theme_JJ — AI 开发规范

> 本项目使用 VS Code + Copilot 开发。AI 生成/修改代码时必须遵守本文件约定。
> 本文件是规范的唯一权威来源；todo.md 等文件仅保留计划与待办。

## 一、核心约束（最高优先级）

1. **数据库兼容性**：任何与数据库相关的代码，都必须同时支持 MySQL、PostgreSQL、SQLite，与 Typecho 官方保持一致的兼容性。一律使用 `Typecho_Db` 查询构造器由 DAL 自动翻译方言，**禁止手写任何原生 SQL**（详见「数据库兼容性」一节）。
2. **编码**：所有 PHP/模板文件一律 UTF-8（无 BOM）。构建末端的 theme-assembler 已带 U+FFFD/`锟` 乱码校验，产物出现乱码必须修源码/构建脚本，禁止绕过校验。
3. **`$archive->fields` 解析**：Typecho 1.3 中它是对象而非 serialize 字符串，必须走 [src/functions/utils.php](../src/functions/utils.php) 的 `parseFields()`（兼容 array/object/string/false），**禁止裸写 `unserialize($x->fields)`**。
4. **`getAllChildren()` 可能返回 `null`**，`count()` 前必须先 `is_array()` 判断。
5. **函数归属**：公共 PHP 函数统一放 [src/functions/utils.php](../src/functions/utils.php)，禁止跨文件重复声明同名函数（历史上 `getOs` 重复声明 + 函数体污染事故，`php -l` 查不出来，需对照 git 历史核对）。

## 二、数据库兼容性（三库通用）

- 主题层面三库功能无差异，已验证能力：主题设置读写、点赞（`table.fields` 自定义字段）、评论/父评论查询、`[hide]` 回复可见短代码、独立页/归档/分类/分页。新增涉及 DB 的功能必须在此清单基础上补齐三库验证。
- Typecho 无官方跨库迁移工具，换库 = 重装；主题设置存于 `typecho_options` 表，换库后丢失属预期行为，代码层面不需要也无法做迁移兼容。
- 生产环境推荐：虚拟主机 → SQLite（零配置）或 MySQL；大流量 VPS → MySQL 8.0；已有 Pg 基础设施 → PostgreSQL。
- 本地三库验证：`docker/` 下三套 compose 覆盖文件（`docker-compose.mysql80.yml` / `docker-compose.pgsql.yml` / `docker-compose.sqlite.yml`），切换前先 `docker compose down`，详见 [docker/README.md](../docker/README.md)「切换数据库环境」。

### 编码规则（避免方言泄露）

1. 禁止原生 SQL：任何查询一律使用 `$db->select()->from('table.xxx')->where(...)` 构造器。
2. 表名一律写 `table.xxx` 占位符（`table.contents`、`table.comments`、`table.fields`、`table.users`），不写真实表名或前缀，由 DAL 替换前缀。
3. 禁止数据库专属函数（`CONCAT`、`IFNULL`、`GROUP_CONCAT`、`DATE_FORMAT`、`RAND()` 等）：字符串拼接、判空、随机数、日期格式化等逻辑放到 PHP 层处理。
4. `LIMIT` 用构造器的 `->limit()` / `->offset()`，不拼字符串。
5. 排序用常量 `Typecho_Db::SORT_ASC / SORT_DESC`。
6. 写入操作用 `insert()` / `update()` / `delete()` 构造器。
7. 布尔/枚举值用字符串（如 `status = 'publish'`），不依赖 MySQL 隐式类型转换（PG/SQLite 更严格）。
8. `table.fields` 自定义字段（点赞 likes 等）继续用 `str_value` + PHP `intval()` 处理，避免数值型字段在三库的行为差异。
9. 字段/表名保持全小写命名（PostgreSQL 对未加引号标识符统一转小写）。

## 三、技术栈

### PHP 模板层（SSR）

- Typecho 1.3.0 / PHP 8.2（以 `joyqi/typecho:1.3.0-php8.2-apache` 镜像为准）
- 仅使用 Typecho 官方 Widget/Helper API 与 PHP 内置函数，**不引入第三方 PHP 依赖**
- 本机无 PHP 环境，PHP 验证一律在 Docker 容器内进行

### 前端交互层

- TypeScript 5 + Vue 3（**仅 Composition API**，构建已禁用 Options API）
- 样式：SCSS（sass-embedded）→ lightningcss 按 `.browserslistrc` 降级压缩
- 库：axios、mitt、highlight.js、simplebar、toastify-js、qrcode、@floating-ui/dom、@docsearch/js
- JS 构建目标 `es2015`；`modulePreload.polyfill` 已关闭，modulepreload 标签由构建插件手动输出

### 构建与工具链

- Vite 8（rolldown）多页面构建 + 自定义插件 [vite/plugin/theme-assembler.ts](../vite/plugin/theme-assembler.ts)
- 包管理：**pnpm 12.5.1**（以 pnpm-lock.yaml 为准，禁用 npm/yarn）
- Lint/格式化：**oxlint + oxfmt**（不引入 ESLint/Prettier）
- 构建脚本：scripts/ 下 ts 文件经 ts-node 运行

## 四、架构设计

### 构建流水线

```
src/ ──Vite 多入口构建──▶ JS/CSS/manifest ──theme-assembler──▶ dist/（完整 Typecho 主题）
```

- 每个页面一个入口：`src/pages/<page>/index.ts`，由 glob 自动发现，无需手动注册
- theme-assembler 依据 `.vite/manifest.json` 收集各入口的 CSS 与静态依赖 chunk，向页面 PHP 注入 `<link>` / `<script type="module">` / modulepreload 标签
- public/ 下静态资源原样拷贝到 dist/

### 分层职责

1. **PHP 模板层**：pages/modules 下的 `.php` + functions/\*.php —— 只负责取数与直出 HTML
2. **TS 交互层**：pages/modules 下的 `index.ts` —— 只负责浏览器端交互；通过 DOM 上的 `data-*` 或内嵌 JSON 读取 PHP 输出的数据，不反向依赖 PHP 内部实现
3. **共享层**：`src/store`（数据）、`src/utils`、`src/request` / `src/api`（请求）、`src/types`（类型），别名 `@` 指向 `src/`

### 架构约定

- **不搞 SPA**：首屏永远 PHP 直出，Vue 仅用于局部交互组件
- **模块可复用、页面做组合**：modules/ 是独立可复用单元（PHP 模板 + TS + SCSS 自包含），pages/ 负责组装
- 局部滚动条统一 simplebar，事件通信统一 mitt，请求统一走 request/api 封装

## 五、目录约定

| 目录                      | 职责                                                                                                      |
| ------------------------- | --------------------------------------------------------------------------------------------------------- |
| `src/pages/<name>/`       | 页面单元：`<name>.php`（模板）、`index.ts`（入口）、`style.scss`；目录名即入口名                          |
| `src/modules/<name>/`     | 可复用模块：PHP 模板 + `index.ts` + `style.scss`，可按需再分子目录（如 comment/comment-form）             |
| `src/functions/`          | 纯 PHP 助手：`utils.php`（公共函数）、`theme-config.php`、`seo.php`、`comment.php` 等，构建时组装进主题根 |
| `src/api/` `src/request/` | 浏览器端请求封装（axios 实例、接口定义）                                                                  |
| `src/store/`              | 前端共享数据/状态                                                                                         |
| `src/styles/`             | 全局 SCSS：color/mixins/variable 已由构建自动注入每个 scss 文件，**勿重复 @use**                          |
| `src/plugins/`            | 第三方库的本地改造版（如 simplebar）                                                                      |
| `src/types/`              | 全局 d.ts 类型声明                                                                                        |
| `src/bin/`                | 骨架屏等构建期脚本                                                                                        |
| `vite/plugin/`            | 自定义 Vite 插件（theme-assembler 等），改动须保持 UTF-8 读写 PHP                                         |
| `public/`                 | 静态资源（css/fonts/images/scripts），原样进 dist                                                         |
| `docker/`                 | 本地联调环境：base compose + mysql80/pgsql/sqlite 覆盖文件，挂载 `../dist` 为主题目录                     |
| `scripts/`                | Node 侧工程脚本（版本更新、打包 zip），独立 tsconfig                                                      |

## 六、常用命令

```bash
pnpm dev            # vite build --watch，配合 docker 联调
pnpm build          # 产物到 dist/（exit code 恒为 1 属已知现象，以产物为准）
pnpm check          # oxlint + oxfmt --check
pnpm fix            # 自动修复 lint 与格式
pnpm release        # 升版本 + 构建 + 打包 zip
```

```bash
# PHP 语法检查（本机无 PHP，走容器）
docker run --rm -v "<repo>:/work" -w /work joyqi/typecho:1.3.0-php8.2-apache sh -c 'php -l <file>'

# 本地联调（dist 挂载进容器，改 dist 刷新即生效）
cd docker; docker compose -f docker-compose.sqlite.yml up -d   # 访问 http://jj.test/
```

## 七、AI 生成代码时的检查清单

- [ ] 涉及数据库：是否只用了 `Typecho_Db` 查询构造器（零手写 SQL），并已在 mysql80/pgsql/sqlite 三套 compose 环境实测？
- [ ] 涉及 `fields`：是否走了 `parseFields()`？
- [ ] 新增/修改 PHP 函数：是否与 utils.php 及全仓库无重复声明？
- [ ] 新增页面：是否按 `src/pages/<name>/{<name>.php, index.ts, style.scss}` 结构创建？
- [ ] 改完是否跑过 `pnpm build` + `php -l`（容器内）验证？
