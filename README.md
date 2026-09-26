# Typecho_Theme_JJ

Typecho 主题-《高仿掘金》

这是一个程序员风格的主题，是为了更好的文章阅读和分享知识！（可以话来点 Star 支持一下）

预览链接：[木灵鱼儿](https://www.mulingyuer.com)

## 仓库镜像地址

由于国内部分用户反馈github不方便查看，特意加了国内的Gitee地址。

Gitee仓库：[Typecho_Theme_JJ](https://gitee.com/mulingyuer/Typecho_Theme_JJ)

## FAQ 文档

[《主题使用指南》](https://mulingyuer.github.io/Typecho_Theme_JJ/)

## 安装注意

> ⚠️ **主题解压/上传后，`usr/themes/` 下的目录名必须是 `Typecho_Theme_JJ`，不要改名。**
>
> 主题内部分静态资源（如 copyright、links 页背景图）使用编译期写死的路径前缀 `/usr/themes/Typecho_Theme_JJ`。目录改名后这些资源会 404，导致图标、背景图无法显示。

## 主题功能

1. Vite + TypeScript 现代化构建
2. 支持 Typecho 1.2
3. 源码/产物分离的模块化架构（`src/` 开发，`dist/` 即完整主题）
4. 响应式兼容到 320px 分辨率
5. 提供 24 个文章主题，18 个代码高亮主题，支持代码行号，一键复制
6. 本地化 B 站表情，重构多版设计，本次更加便于扩展更新
7. 独立页也支持文章主题切换
8. 优化了灯箱逻辑，体验更好
9. 更加准确的分类菜单高亮
10. 更好的定位跳转
11. 新版的掘金 UI
12. 搜索记录列表
13. 文章列表加载支持无限加载和分页加载切换
14. 自定义 404 页面支持两种类型自由切换
15. 更好的页面性能和 SEO
16. 有彩蛋哦
17. 高保真掘金目录树
18. 支持 docsearch（需要自己申请 apiKey）
19. 新增移动端目录树功能
20. 新增文章置顶功能
21. 新增首页右侧推荐文章功能（具体查看文档）
22. 配套文章编辑器 [Typecho_Plugin_JJEditor](https://github.com/mulingyuer/Typecho_Plugin_JJEditor) 实现友链页样式编辑时预览
23. 还有很多变化需细细品味

## 主题预览

![pi7XRu4.png](https://s11.ax1x.com/2023/12/24/pi7XRu4.png)

![pPcFxFP.png](https://s1.ax1x.com/2023/09/09/pPcFxFP.png)

![pPcFqLd.png](https://s1.ax1x.com/2023/09/09/pPcFqLd.png)

![pPcFOeA.png](https://s1.ax1x.com/2023/09/09/pPcFOeA.png)

![pPcFXdI.png](https://s1.ax1x.com/2023/09/09/pPcFXdI.png)

![pPcFzJf.png](https://s1.ax1x.com/2023/09/09/pPcFzJf.png)

![pPckSW8.png](https://s1.ax1x.com/2023/09/09/pPckSW8.png)

![pPckCQg.png](https://s1.ax1x.com/2023/09/09/pPckCQg.png)

![pPckPyQ.png](https://s1.ax1x.com/2023/09/09/pPckPyQ.png)

![pPck9SS.png](https://s1.ax1x.com/2023/09/09/pPck9SS.png)

![pi7XWDJ.jpg](https://s11.ax1x.com/2023/12/24/pi7XWDJ.jpg)

## 相关插件

配套写了一个 Typecho 的掘金编辑器插件，推荐一起使用，体验更佳，支持文章主题和代码高亮在编辑时的预览效果，还支持友链页的特殊样式预览。（可以话来点 Star 支持一下）

[Typecho_Plugin_JJEditor](https://github.com/mulingyuer/Typecho_Plugin_JJEditor)

## 参与开发

### 环境要求

- **Node.js**：版本为 **24**（由根目录 [.node-version](.node-version) 文件定义）。推荐使用 [FNM](https://github.com/Schniz/fnm) 管理 Node 版本，进入项目目录时会自动切换。
- **pnpm**：通过 **corepack** 管理，版本由 [package.json](package.json) 中的 `packageManager` 字段锁定。首次克隆项目后执行以下命令激活：

  ```bash
  corepack enable
  ```

### 项目结构

```
src/                    # 开发源码（按功能内聚组织）
├── modules/            # 功能模块：php + ts + scss 同目录
├── pages/              # 页面：模板 + 页面逻辑 + 页面样式
├── functions/          # functions.php 按职责拆分
├── styles/ utils/ ...  # 纯前端共享层
scripts/                # 构建辅助脚本（版本号同步、zip 打包）
vite/plugin/            # 自研 Vite 插件（主题组装器）
public/                 # 静态资源（Vite publicDir，构建时拷贝到 dist/）
dist/                   # 构建产物 = 完整 Typecho 主题（git 忽略）
```

### 常用命令

```bash
pnpm install        # 安装依赖
pnpm dev            # 开发模式（vite watch 构建，含 PHP 变更同步）
pnpm build          # 构建完整主题到 dist/（不更新版本号）
pnpm build-zip      # 将 dist/ 打包为 Typecho_Theme_JJ.zip
pnpm lint           # 代码检查
pnpm format         # 代码格式化
pnpm check          # 并行执行 lint + 格式检查
pnpm fix            # 串行执行 lint 修复 + 格式化
pnpm update-version # 更新版本号（bumpp + 同步 home.php 中的 @version）
pnpm release        # 正式发布：更新版本号 → 构建 → 打包 zip
```

安装主题：将 `dist/` 目录放入 Typecho 的 `usr/themes/` 下即可，或使用 `pnpm build-zip` 生成的 zip 包安装。

本地 Typecho 调试环境（Docker）请查看 [docker/README.md](docker/README.md)。

### 构建脚本说明

`scripts/` 目录下是与发布流程配套的 Node 脚本（通过 ts-node 运行，仅被 pnpm 命令调用，无需手动执行）：

| 脚本              | 说明                                                                                                                              |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `updateVersion.ts` | 配合 `pnpm update-version` 使用：bumpp 更新 [package.json](package.json) 版本号后，将其同步到 `src/pages/home/home.php` 的 `@version` 注释中（Typecho 从该注释读取主题版本）。 |
| `zip.ts`          | 配合 `pnpm build-zip` 使用：将 `dist/` 目录以最大压缩级别打包为根目录下的 `Typecho_Theme_JJ.zip`，zip 根目录即主题文件，可直接在 Typecho 后台上传安装。 |

## 有志之士

如果你也想完善这个主题，可以提交你的代码，在我博客留言探讨也行 [木灵鱼儿](https://www.mulingyuer.com)

## 底层基建

本主题采用 Vite 多入口构建，通过自研主题组装插件将 `src/` 源码输出为完整可用的 Typecho 主题。

## 捐赠

开源并非易事，如果您喜欢这个的项目，请考虑捐赠一些资金，以助项目更好地发展壮大。

| ![微信捐赠](./faq/donated_wx.jpg) | ![支付宝捐赠](./faq/donated_zfb.jpg) |
| --------------------------------- | ------------------------------------ |
