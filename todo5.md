# 首页推荐文章卡片优化方案

> 状态：方案待评审，尚未实施
> 涉及模块：[src/modules/home/recommended-article/](src/modules/home/recommended-article/)
> 涉及数据：[src/functions/utils.php](src/functions/utils.php)、[src/functions/theme-config.php](src/functions/theme-config.php)

## 一、原始诉求

优化首页右侧的广告文章卡片展示模块，在保持首屏性能和现有视觉结构的前提下：

1. 提升卡片内容与文章图片的加载速度。
2. 优化 SEO：完善标题、摘要、图片替代文本、链接和结构化语义。
3. 处理空数据、无效 cid、重复 cid、缩略图缺失等边界情况。
4. 保证加载失败、慢网络和禁用 JavaScript 时仍可正常阅读和跳转。

## 二、现状与问题

请求链路：

1. 后台配置最多 3 个文章 cid：[src/functions/theme-config.php](src/functions/theme-config.php:148)
2. `getHomeRecommendedArticleList()` 按 cid 顺序逐个读取文章：[src/functions/utils.php](src/functions/utils.php:1128)
3. 模板循环输出卡片：[src/modules/home/recommended-article/recommended-article.php](src/modules/home/recommended-article/recommended-article.php)
4. 前端通过共享懒加载实例加载图片：[src/modules/home/recommended-article/index.ts](src/modules/home/recommended-article/index.ts)

| 类别 | 现状 | 间题与优化方向 |
| --- | --- | --- |
| 加载速度 | 模板先输出 GIF 占位图，再由 JS 源数据加载真实图片 | 首页右侧卡片即使在首屏外也会创建多个占位图和网络请求；应区分首屏与非首屏加载策略 |
| 图片状态 | 有缩略图时使用占位 GIF + `data-src`；无缩略图时使用固定空图 | 缺少真实尺寸、`loading`、`decoding`、失败回退和可访问状态 |
| 懒加载 | 使用 [ThumbLazy](src/modules/article-card/thumbLazy.ts) 共用实例监听全部图片 | 卡片数量固定最多 3 张，可在模板中直接使用原生懒加载，减少自定义 JS 和首屏负担；也可保留统一组件但补充去重与取消逻辑 |
| 数据查询 | 每个 cid 调用一次 `Helper::widgetById('Contents', $cid)` | 配置错误时单项可能使列表提前结束；应过滤并继续处理有效文章 |
| 字段兼容 | 缩略图直接读取 `$cidArticle->fields->thumb` | Typecho 1.3 中 `fields` 是对象；必须通过 `parseFields()` 读取自定义字段 |
| 状态校验 | 没有检查文章状态、类型或权限 | 草稿、私密文章或已删除内容不应展示；至少校验已发布文章且 cid 有效 |
| 卡片内容 | 只有标题与标签，没有摘要和发布时间 | 可补充清洗后的摘要和时间语义，但视觉上可保持默认只展示标题与标签 |
| SEO | 标题直接写入属性，图片 alt 与链接标题相同且链接使用 `_blank` | 标题、摘要、alt 和属性需统一转义；应提供有意义的图片描述；外链行为与站内跳转应明确区分 |
| 语义结构 | 卡片没有 `<article>`、`<h2>/<h3>` 或时间结构 | 应使用语义化的文章容器和标题层级，避免使用 div 承担完整卡片内容 |
| 防乱码 | 动态标题、摘要、URL 和字段直接拼到属性中 | 所有输出必须通过 UTF-8 安全转义，特殊字符不得破坏 HTML 属性 |

## 三、性能优化方案

### 3.1 图片加载策略

卡片最多展示 3 篇。优先采用原生浏览器能力，减少首页 JS 初始化量：

- 首屏第一张卡片：直接设置真实缩略图地址，不等待 IntersectionObserver；设置 `loading="eager"`、`fetchpriority="high"`、`decoding="async"`。
- 后续卡片：设置 `loading="lazy"`、`decoding="async"`。
- 所有卡片保留固定宽高比容器，模板或 CSS 可提供尺寸约束，避免布局抖动。
- 无缩略图时使用固定空图作为内容兜底，并确保空图不会被重复懒加载。
- 图片加载失败时切换到现有的 `loading_error.gif` 或统一空图，并移除脆弱的多次重试逻辑。
- 不在模板中预先拼接 GIF 占位图到真实图片地址；占位图只作为样式骨架或低成本背景。
- 不做额外图床代理、无损压缩或动态裁剪，除非缩略图地址支持明确参数且能稳定回退。

第一版更推荐保留现有视觉样式，`<img>` 的加载策略以原生属性为主；只有首页确实出现大量外链图片或需要位移加载时，再保留自定义观察器。

### 3.2 内容加载策略

- 通过现有 `getHomeRecommendedArticleList()` 一次取出最多 3 篇文章，不增加后台配置项。
- 单条无效 cid 时跳过并继续读取下一项，最终列表不出现空卡片。
- 对 cid 列表去空格、去重、限制长度；仅接受正整数 cid。
- 逐项校验文章存在性、状态和类型；草稿、私密、页面或已删除文章不进入卡片。
- 使用 `parseFields()` 读取 `thumb`，符合项目的 Typecho 1.3 字段兼容约束。
- 摘要只在模板实际需要展示时读取；当前卡片视觉不显示摘要时，不额外扩展模板属性。
- 不新增数据库表、不手写原生 SQL、不引入任何第三方 PHP 依赖。

### 3.3 缓存与资源控制

- 第一版不引入独立缓存表或磁盘缓存，避免状态失效和跨方言问题。
- 对外部图片地址只做白名单协议校验：只接受 `http://` 或 `https://`，拒绝 `javascript:` 等非法值。
- 外站图片可按需设置 `referrerpolicy="no-referrer"`，避免泄露站点来源；若图片服务依赖来源校验，则保留默认策略并单独实测。
- 只有配置了至少一个有效外站图片时才考虑在 `<head>` 中输出对应 `preconnect`；不能为每张卡片生成多个预连接。
- 不把动态文章地址、摘要或图片地址写入浏览器全局状态。

## 四、SEO 与语义优化方案

### 4.1 卡片结构

推荐结构：

```html
<article class="recommended-article-item" itemscope itemtype="https://schema.org/Article">
  <a class="recommended-article-item-link" href="..." itemprop="url">
    <figure class="recommended-article-item-media">
      <img
        class="recommended-article-item-img"
        itemprop="image"
        src="..."
        alt="..."
        width="..."
        height="..."
        loading="eager|lazy"
        decoding="async"
      >
    </figure>
    <h2 class="recommended-article-item-title" itemprop="headline">文章标题</h2>
  </a>
</article>
```

实际可仅保留现有外观不渲染 `<h2>` 文本层，避免视觉变化；语义化结构应通过现有卡片标题或新增隐藏标题来提供，不得出现重复可见标题。

### 4.2 标题

- 标题使用文章真实标题，不使用固定“推荐文章”替代。
- 卡片 `<a>` 的 `title` 属性使用完整标题或由标题加说明组成，不重复灌水。
- 标题与摘要中的 HTML 使用 `htmlspecialchars(..., ENT_QUOTES, 'UTF-8')` 输出。
- 站点标题换行、引号、特殊符号不会破坏 HTML 属性。

### 4.3 摘要

只有用户选择在卡片中展示摘要时才启用；默认可先输出 `data-description` 或模板变量，后续再做视觉呈现。

摘要生成规则：

1. 优先使用文章摘要字段 `$article->excerpt` 或 Typecho 提供的摘要能力。
2. 摘要为空时从正文去除 HTML 标签、Markdown 源码残留和空白字符后截取。
3. 截取为固定长度（建议 60~80 个中文字符），保留完整关键词但不截断 HTML 标签。
4. 摘要文本统一去除换行、连续空格和控制字符。
5. 不把摘要作为 `meta description` 替代品；卡片可贡献语义和可读性，但最终页面描述仍由现有 SEO 函数控制。

公共摘要生成逻辑应放入 [src/functions/utils.php](src/functions/utils.php)，禁止在模板和多个模块中重复实现。

### 4.4 图片 alt

- 有缩略图且能明确表达文章主题时：`alt="文章标题 - 缩略图"` 或直接使用文章标题；避免“图片”“推荐文章图片”之类无意义文本。
- 缩略图纯装饰且旁边已有完整标题时：允许 `alt=""`，避免重复朗读。
- 缺失缩略图时：固定空图应使用与内容对应的描述，例如文章标题；不要保留空白或占位 GIF 的可访问名称。
- alt 中的引号、尖括号和换行统一转义。

### 4.5 链接与结构化数据

- 默认不使用 `target="_blank"`，让用户停留在当前站点，或仅保留后台明确配置的跳转行为。
- 如必须新标签页打开，使用 `rel="noopener noreferrer"`，并在可访问名称中说明新窗口行为。
- 卡片链接使用文章真实 `permalink`，禁止通过域名拼接或未校验的查询参数生成 URL。
- 可按 `Article` 类型为卡片补充 `itemprop`：`url`、`headline`、`image`、`datePublished` 和 `description`。
- 卡片不自行生成 JSON-LD，避免重复和冲突；全站结构化数据继续由现有 SEO 模块统一维护。
- 发布时间使用 `<time datetime="...">`，格式来自 Typecho 时间字段，不自行拼接数据库专属日期格式。

## 五、前端与模板改动

建议落点：

| 文件 | 改动 |
| --- | --- |
| [src/functions/utils.php](src/functions/utils.php) | 完善 `getHomeRecommendedArticleList()`：校验 cid、去重、校验文章状态、解析字段、补充摘要和安全文本 |
| [src/functions/theme-config.php](src/functions/theme-config.php) | 仅调整配置说明，明确最多 3 篇、只允许已发布文章 cid、缩略图字段用途 |
| [src/modules/home/recommended-article/recommended-article.php](src/modules/home/recommended-article/recommended-article.php) | 输出语义化结构、原生图片加载属性、转义后的标题/摘要/alt、可选发布时间和失败兜底 |
| [src/modules/home/recommended-article/index.ts](src/modules/home/recommended-article/index.ts) | 若保留自定义懒加载，只负责首屏外图片；若完全使用原生属性，则移除对 ThumbLazy 的依赖 |
| [src/modules/home/recommended-article/style.scss](src/modules/home/recommended-article/style.scss) | 固定宽高比、骨架状态、图片加载和失败状态、标题行数及摘要样式；不改变当前卡片间距和外观，除非评审通过 |

前端首版不新增交互组件、不引入轮播、不引入独立请求接口、不引入额外动画。

## 六、边界与回退

- 配置为空：整个模块不输出任何 DOM。
- 配置含无效 cid：跳过无效项，不输出占位卡片。
- 所有 cid 无效：模块不输出容器。
- 缩略图字段为空或非法：使用固定空图。
- 缩略图加载失败：使用现有错误图或空图，不影响标题和链接。
- 无 JavaScript：图片应可通过原生 `loading` 属性加载，卡片仍可点击。
- 禁用懒加载或旧浏览器：直接加载真实图片，确保不因自定义脚本空白。
- 摘要为空：不输出摘要行，不留空白占位。
- 正文或摘要包含脚本/事件属性：经过 Typecho 输出与 HTML 清洗后再转义，禁止把原始 HTML 注入属性或链接。

## 七、验证清单

### 7.1 功能用例

| 用例 | 期望 |
| --- | --- |
| 未配置 cid | 不渲染模块 |
| 配置 1、2、3 篇有效文章 | 按配置顺序输出最多 3 张卡片 |
| 配置中包含重复 cid | 去重后只展示一次 |
| 配置中包含空白或非法 cid | 跳过非法项 |
| 配置中包含草稿、私密或不存在的 cid | 跳过，不影响其他有效文章 |
| 缩略图字段为空 | 使用固定空图，不使用 GIF 占位图 |
| 缩略图加载失败 | 切换到错误图或空图，卡片仍可点击 |
| 文章标题含引号、尖括号、中文和空格 | HTML 属性与文本都正确转义，不产生残缺标签 |
| 摘要含 HTML 标签或多行空白 | 摘要只显示纯文本，长度受控 |
| 禁用 JavaScript | 卡片和图片均可正常渲染与跳转 |
| 外链缩略图地址非法 | 不写入 `<img src>` 或跳转链接 |

### 7.2 性能验证

- 首屏网络瀑布图中：真实图片只按首张 eager、后续 lazy 的策略加载。
- 不在首屏外强制请求全部缩略图。
- 慢速网络下卡片容器无明显尺寸跳动。
- 图片加载失败不触发无限重试。
- 禁用自定义懒加载后卡片仍可加载。
- 首页首屏不因新增摘要查询出现明显额外数据库压力；若引入查询，需在 MySQL、PostgreSQL、SQLite 中实测差异。

### 7.3 构建与兼容验证

- 涉及数据库时只使用 `Typecho_Db` 查询构造器，不手写原生 SQL；本方案优先复用 `Helper::widgetById` 和现有数据结构，不新增方言代码。
- 涉及 `fields` 时只通过 `parseFields()` 读取。
- 公共 PHP 函数统一放入 [src/functions/utils.php](src/functions/utils.php)，不跨文件重复声明。
- 在容器内执行 `php -l` 检查所有修改的 PHP 文件。
- 执行 `pnpm check`、`pnpm build`；确认构建末端无 U+FFFD/`锟` 乱码告警。
- 验证产物已同步到 `docker/themes/Typecho_Theme_JJ/`。
- 重点检查桌面端、平板和移动端三种布局，卡片图片、标题和标签不重叠。

## 八、数据库与三库验证

本模块主要读取文章和自定义字段，不需要新增建表、迁移或原生 SQL。

如因实现需要新增数据库查询，必须：

1. 使用 `$db->select()->from('table.contents')` 等 `Typecho_Db` 构造器。
2. 表名保留 `table.xxx` 占位符。
3. 不使用方言专属函数、原生 `LIMIT` 或真实表前缀。
4. 分别在 sqlite、mysql80、pgsql compose 环境验证有效文章、草稿、重复 cid 和缺失 cid。

## 九、SEO 验收标准

- 卡片标题可被搜索引擎和屏幕阅读器理解，不依赖固定标签文本。
- 图片 alt 能传达文章主题或明确标记为装饰图。
- 链接地址指向真实文章，不暴露未校验字段。
- 可选摘要不重复页面可见标题，且不注入 HTML。
- 不重复输出页面级 JSON-LD 或其他 SEO 标签。
- 无效卡片不占用可爬取链接空间。
- 站内跳转默认不强制新标签页；只有明确外链或配置要求时才使用 `_blank` 与安全 rel。

## 十、不做的事

- 不把文章卡片改造成轮播或无限滚动。
- 不引入第三方图片压缩、图片代理或 CDN SDK。
- 不新增独立缓存表、点赞表、访问日志或建表 DDL。
- 不手写 MySQL、PostgreSQL、SQLite 原生 SQL。
- 不在卡片模块生成页面级 SEO Meta 或 JSON-LD。
- 不把卡片摘要直接等同于文章页面的 `meta description`。
- 不为吸引爬虫重复堆叠隐藏关键词或无意义锚文本。
- 不因为标签过短就在后台强制改默认文案；可见标签仍沿用现有主题配置。