# Markdown 高级语法增强方案

## 一、问题范围

只解决文章内的数学公式与 Mermaid 图表渲染，不改动评论区、分类页、标签页和 links 页。

- 数学公式：支持 Markdown 中常见的行内公式与块级公式。
- Mermaid：支持 Markdown ` ```mermaid `代码块及正文中已明确标记的 Mermaid 内容。
- 保持首屏可读性：未加载增强脚本时，公式与图表至少保留原始文本，不能出现整篇文章空白或运行时报错。

## 二、实现方向

采用“服务端标记 + 页面级按需加载 + 客户端局部增强”的组合方案。

1. `markdown.php` 继续负责输出已解析的正文、回复可见、TODO 列表等现有处理，不改成前端完整解析 Markdown。
2. 在文章页面的模板中，根据当前内容检测公式和 Mermaid，并在 `.article-content-markdown` 容器元素上输出 `data-*` 标记。
3. 页面只在标记存在时加载对应模块和资源；`links` 页复用 `markdown.php` 时不得触发文章增强。
4. 每个增强模块单独动态加载；公式与图表互不依赖。
5. Mermaid 节点进入视口后再渲染，公式可按正文容器分批处理。
6. 使用本地资源作为默认来源，必要时才允许从可配置 CDN 加载，并设置加载失败回退。

文章首屏仍由 Typecho/PHP 直出，不把整个 Markdown 解析链路改成客户端渲染。

## 三、需要识别哪些内容

主题应统一提供一个文章增强检测流程，并只在文章页面调用：

- Mermaid 在解析后的 HTML 中检测：
  - `<pre><code class="language-mermaid">...`
  - 有些 Markdown 渲染器可能只保留 `language-mermaid`、`lang-mermaid` 或 Mermaid 自定义容器；统一只以稳定 Mermaid 节点为准。
- 数学公式优先检测原始文章文本中的成对语法，避免仅根据普通美元符号误判。
- 可以在公共 PHP 函数中新增 `detectMarkdownEnhancements($html)`，统一返回 `math` 和 `mermaid` 两个布尔值；公共函数统一放在 `src/functions/utils.php`。
- 成对公式和 Mermaid 标记只影响对应模块是否加载，不修改数据库字段，也不新增后台配置。
- Mermaid 节点保留原始图表文本和稳定的容器类名。
- 公式原始表达式应保留在前端节点中，渲染失败时可恢复为文本。
- 页面资源加载不依赖手动给每篇文章写配置；是否加载由当前正文实际检测结果决定。

推荐在 [src/modules/article-content/article-content.php](/e:/code/github/Typecho_Theme_JJ/src/modules/article-content/article-content.php) 的 Markdown 容器上输出：

```html
<div
  id="markdown"
  class="article-content-markdown markdown-body"
  data-enhance-math="true"
  data-enhance-mermaid="true"
>
```

无对应能力时不输出相应的 `data-enhance-*` 属性，避免在所有文章上附加额外状态。

### 与现有模块的职责边界

- [src/modules/markdown/markdown.php](/e:/code/github/Typecho_Theme_JJ/src/modules/markdown/markdown.php)
  - 保持负责正文处理：链接、TODO、回复可见及现有短代码。
  - 不导入 KaTeX、Mermaid 或添加两套增强脚本。
- [src/modules/article-content/article-content.php](/e:/code/github/Typecho_Theme_JJ/src/modules/article-content/article-content.php)
  - 仅文章详情页输出增强标记。
- [src/modules/article-content/index.ts](/e:/code/github/Typecho_Theme_JJ/src/modules/article-content/index.ts)
  - 根据容器标记动态加载公式或 Mermaid 增强模块。
  - 保留现有代码块、图片灯箱逻辑，不因增强功能重复初始化。
- Mermaid 节点必须从现有代码块高亮流程中排除，不能先执行普通 hljs，再交给 Mermaid 二次处理。
- `src/modules/article-content/features/` 可按功能拆分公式和 Mermaid 模块，互相独立。
- [src/modules/links/content.php](/e:/code/github/Typecho_Theme_JJ/src/modules/links/content.php) 不应套用文章增强标记，即使它复用 Markdown 输出模块。

### TODO 列表兼容

Typecho 1.3 当前使用的 HyperDown 不原生把 GFM 任务列表转换成复选框。本地容器实测：

```markdown
- [ ] 未完成
- [x] 完成
```

解析后的原始 HTML 为：

```html
<ul><li>[ ] 未完成</li><li>[x] 完成</li></ul>
```

因此主题需要保留 TODO 的 PHP 后处理：

- 在 [src/modules/markdown/markdown.php](/e:/code/github/Typecho_Theme_JJ/src/modules/markdown/markdown.php) 中启用 `todoListFormatted()`。
- 使用 `preg_replace` 只转换列表项开头的 `[ ]` 和 `[x]`，不要全局替换正文中的方括号文本。
- 未完成项输出 `input type="checkbox" disabled`。
- 已完成项额外输出 `checked`。
- 包含任务项的 `ul/ol` 添加 `contains-task-list`，任务项的 `li` 添加 `task-list-item`。
- 复选框只表现状态，不绑定前端保存逻辑。
- 已完成和未完成标记应从可见正文中移除。
- 此处理独立于公式和 Mermaid，不触发额外 JS 或动态资源。

## 四、数学公式方案

- 优先使用本地 KaTeX 或同类轻量公式渲染库。
- 同时支持：
  - 行内公式：常见 `$...$` 与 `\(...\)`。
  - 块级公式：常见 `$$...$$` 与 `\[...\]`。
- 优先由前端扫描文本节点，不使用正则直接修改整段 HTML：
  - 先排除 `<code>`、`<pre>`、`script`、`style` 等不可渲染区域。
  - 再识别成对公式定界符，避免普通 `$5`、货币文本或转义字符误判。
  - 使用树遍历或文本节点替换，保留图片、链接和其他 HTML 结构。
- 如果 Markdown 解析器已把公式转成稳定自定义节点，则优先识别节点属性，不再重复扫描全文。
- 渲染前先确定正文确实包含公式标记，避免所有文章加载公式库。
- 渲染成功后替换目标节点，原始公式可保存在节点属性或相邻数据中，便于复制和重渲染。
- 渲染失败时保留原始文本，记录一次可见于开发者工具的警告，不影响其他公式和正文。

## 五、Mermaid 方案

- Mermaid 以独立动态模块加载，不放入基础文章入口。
- 使用 `IntersectionObserver` 延迟渲染，只处理进入或即将进入视口的图表。
- 相同图表不要重复初始化或重复渲染。
- 在普通代码块处理前识别 Mermaid：
  - 如果 `code` 的 class 包含 `language-mermaid`，跳过 highlight.js/Shiki 普通代码高亮和复制头部；
  - 保留 `<pre>` 与原始 `code.textContent`；
  - 由 Mermaid 模块替换为图表容器或保留原代码块作为失败回退。
- Mermaid 渲染前先保存原始文本；渲染失败时保留代码块，不能清空或只留下空容器。
- 渲染 SVG 时需要限制外部资源、远程图片和脚本能力，避免文章中的图表标记产生不受控的页面行为。

## 六、按需加载与缓存

资源加载策略分为三层：

1. 入口层：文章模块只加载基础代码，不主动导入 KaTeX、Mermaid 或其图标、字体等重资源。
2. 功能层：检测到公式或 Mermaid 后，使用动态 `import()` 加载对应模块。
3. 数据层：复用模块单例、主题资源和已渲染节点缓存，避免同一文章重复加载和重复渲染。

运行时要求：

- 按需模块只放在需要增强的页面入口中。
- 已加载模块在页面生命周期内复用。
- 浏览器正常缓存脚本、字体和样式；构建产物使用内容哈希，方便更新和缓存失效。
- 图表渲染顺序不可无限堆积，图片、公式和图表之间互不阻塞首屏阅读。

## 七、本地环境与 CDN 策略

本地开发环境不要求外网；所有公式和 Mermaid 依赖应能从主题构建产物中直接提供。

- 默认从主题自身的静态资源或构建 chunk 加载，不依赖 CDN。
- CDN 可以作为可选加速配置，但不能作为唯一来源。
- 使用 CDN 时必须同时支持：
  - 本地资源回退；
  - 显式超时或加载失败回退；
  - HTTPS、本地文件和自部署站点下的路径兼容。
- 不通过裸 CDN 地址写进模板，以免切换环境时需要修改主题模板。
- 如果站点启用了严格 CSP，应能通过站点配置允许对应资源来源，主题不应依赖内联脚本绕过 CSP。

本地 `docker/` 联调与生产主题都应能在断网情况下完成公式和 Mermaid 的基础渲染。

## 八、资源体积与拆分

- 将 KaTeX 的公式解析器、CSS 和字体作为公式模块的一部分按需加载。
- 将 Mermaid 单独拆成独立 chunk，且不与基础代码高亮模块共享首屏入口。
- 优先只保留当前主题实际需要的 Mermaid 功能，不全量复制无关字体、图标或语言包。
- 在构建时检查：
  - 主文章入口不应包含 Mermaid 或 KaTeX 主体；
  - 无公式、无 Mermaid 的文章不触发对应 chunk；
  - 有公式但无 Mermaid 的文章只加载公式资源；
  - 有 Mermaid 的文章在页面滚动到图表前仍可延迟加载。

## 九、检测与回退的边界

- 服务端检测负责决定是否准备增强能力，客户端检测负责处理已有节点和动态节点。
- 类型和标记不明确时不加载对应资源。
- 用户禁用 JavaScript 时：
  - 公式应尽量保留可读文本；
  - Mermaid 应保留 `<code>` 原文和语言标记；
  - 基础文章正文不依赖增强脚本才能阅读。
- 增强脚本加载失败时，不覆盖 Typecho 原始正文。

## 十、验证清单

实现后至少验证以下场景：

- 普通文章不加载公式或 Mermaid 资源。
- 纯公式文章只加载公式资源。
- 纯 Mermaid 文章只加载 Mermaid 资源。
- 同时包含公式和 Mermaid 时，两套模块互不影响。
- 公式渲染失败、Mermaid 渲染失败时正文仍可读。
- `docker/` 本地环境断网时可正常加载本地资源。
- CDN 可用、不可用和不配置三种情况下行为一致且不报错。
- 页面快速切换、重复初始化、动态重载时不会重复渲染。
- 多篇文章聚合或页面局部刷新时不会漏标记或重复注入资源。

