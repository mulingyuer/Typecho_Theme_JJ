# Footer 模块优化方案

> 状态：方案待评审，尚未实施
>
> 涉及模块：[src/modules/footer/](src/modules/footer/)
>
> 涉及公共函数：[src/functions/utils.php](src/functions/utils.php)

## 一、原始诉求

优化主题页脚在首页、分类页、归档页及其他复用页中的展示与生成逻辑：

1. 减少页脚获取“关于”“友链”等指定独立页时的重复工作。
2. 准确生成 AutoSitemap 插件提供的 `/sitemap.xml` 链接，兼容伪静态开关、子目录部署和站点地址差异。
3. 保持现有页脚视觉结构，只做必要的语义、转义和可访问性增强。
4. 不增加数据库表、后台配置、第三方 PHP/前端依赖或额外网络请求。
5. 不影响禁用 JavaScript 时的页脚链接与文本展示。

## 二、现状与问题

页脚模板位于 [src/modules/footer/footer.php](src/modules/footer/footer.php)，当前有以下问题：

| 类别 | 现状 | 问题与优化方向 |
| --- | --- | --- |
| 指定页面 | 模板连续调用两次 `getHidePage()`，分别查找 `about` 和 `links` | `getHidePage()` 每次都会调用 `getAllPages()` 构建独立页列表；应在一个模板作用域内只读取一次，再按 slug 分配 |
| 独立页边界 | 只在 `slug === about/links` 时取标题和 permalink | 缺少空值、重复 slug、隐藏状态等统一校验；首版至少保证空地址不渲染空链接 |
| 站点地图地址 | 直接拼接 `$this->options->siteUrl() . 'sitemap.xml'` | 未经过 Typecho 路由系统；伪静态关闭、子目录部署和自定义站点地址时可能得到错误 URL |
| 插件状态 | 模板不知道 AutoSitemap 是否启用 | 插件未启用时不应把用户导向不存在的 `/sitemap.xml`；应优先使用已注册的插件路由 |
| 动态文本 | 站点标题、地址、邮箱、指定页面标题直接输出 | 标题、地址和邮箱可能包含特殊字符，应统一转义为 UTF-8 HTML 文本或属性 |
| 新标签页 | 站点地图与备案/主题链接使用 `target="_blank"` | 缺少完整的 `noopener noreferrer`；外链安全属性应按需补齐 |
| 前端代码 | [index.ts](src/modules/footer/index.ts) 仅导入样式 | 保持无运行时交互逻辑，不新增 JS、监听器或请求 |
| 语义结构 | 全部使用 `div/footer-item` | 页脚仍可保留视觉类名，但可增加语义化导航、地址和标题语义 |

## 三、目标与边界

本方案只优化页脚模块，不改动首页、分类页、归档页或文章页的整体布局。

- 保留现有 `$this->need('/modules/footer/footer.php')` 调用方式。
- 保留现有 `.footer-content` 和 `.footer-item` 类名及间距。
- 保留“关于”“友链”“站点地图”“版权”“联系地址”“联系邮箱”“备案信息”“Typecho 链接”等项目。
- 指定独立页是隐藏页时仍可显示，页面规则沿用现有 `getAllPages()` 中 `publish/hidden` 的查询范围。
- 草稿独立页不应出现在页脚链接中。
- 同一 slug 出现重复页面时，首版只取首个有效记录，不输出重复链接。
- 站点地图只在可确认路由存在时输出；插件停用后不保留失效站点地图项。
- 不把站点地图地址、隐藏页地址或站点数据写入前端 JS、全局变量或 `data-*` 属性。

## 四、独立页读取优化

### 4.1 新增公共函数

在 [src/functions/utils.php](src/functions/utils.php) 中新增一个面向批量指定页面的公共函数，推荐名称：

```php
getHidePages($page, array $names)
```

输入：

- `$page`：当前 Typecho archive/widget 对象，保持现有 `getHidePage()` 调用习惯。
- `$names`：需要读取的 slug 列表，例如 `array('about', 'links')`。

输出：

```php
array(
    'about' => array('title' => '...', 'href' => '...'),
    'links' => array('title' => '...', 'href' => '...'),
)
```

实现约束：

1. 每次页脚渲染只调用一次 `getAllPages()`。
2. 对 `$names` 去空、去重，且只保留合法 slug 字符。
3. 遍历独立页时同时匹配多个 slug，只遍历一次独立页列表。
4. 找到一个 slug 后立即排除该 slug，避免重复 slug 覆盖或重复输出。
5. 不符合的页面跳过，不要求或假设页面状态由模板自行判断。
6. 不使用原生 SQL；继续复用 `getAllPages()` 与 `Typecho_Db` 查询构造器。
7. 不修改现有 `getHidePage()` 的公开行为；可保留作为兼容包装，由批量函数调用内部共享逻辑。

兼容方案：

```php
function getHidePage($page, $name)
{
    $links = getHidePages($page, array($name));
    return $links[$name];
}
```

如果批量函数需要重置或复用 `$page` 的 widget 状态，只允许在现有 `getAllPages()` / `$page->to()` / `$page->next()` 机制内完成，不直接操作数据库字段或反射缓存。

### 4.2 模板使用方式

页脚模板按以下顺序读取：

```php
$footerLinks = getHidePages($this, array('about', 'links'));
$aboutLink = $footerLinks['about'];
$linksLink = $footerLinks['links'];
$sitemapLink = getSitemapUrl();
```

模板不再连续调用两个 `getHidePage()`。

### 4.3 链接校验

动态链接只接受由 Typecho 生成的站内绝对地址：

- 对空字符串、纯空白、换行、控制字符和非法协议一律跳过。
- 优先接受以当前站点协议和域名开头的站内地址。
- 不拼接 `about`、`links` 或任意 slug 到域名。
- 链接文本中的引号、尖括号和多行空白统一清理或转义。

首版不引入站外独立页白名单、重定向解析或额外 HTTP 请求。

## 五、站点地图 URL 生成

### 5.1 插件与路由规则

当前插件 [docker/plugins/AutoSitemap/Plugin.php](docker/plugins/AutoSitemap/Plugin.php) 在激活时注册：

- 路由名：`maproute`
- 路径：`/sitemap.xml`
- Action：[docker/plugins/AutoSitemap/Action.php](docker/plugins/AutoSitemap/Action.php)

页脚不能假设站点根目录可直接拼接字符串。它应优先通过 Typecho 路由系统取得最终链接。

推荐公共函数：

```php
function getSitemapUrl()
```

实现顺序：

1. 获取 `Typecho_Widget::widget('Widget_Options')` 或现有 `Helper::options()`。
2. 判断 `Typecho_Router::get('maproute')` 是否存在。
3. 路由存在时使用路由名生成路径：

```php
$path = Typecho_Router::url('maproute', array(), $options->index);
$url = Typecho_Common::url($path, $options->index);
```

4. 只有在确认路由 API 可用且生成结果是有效 HTTP/HTTPS URL 时才返回地址。
5. 如路由不存在或路由 API 无法生成有效地址，返回空字符串，不输出直接拼接的兜底 `/sitemap.xml` 链接。

不采用直接拼接的原因：

- 开启伪静态时 URL 应遵循站点路由规则。
- 关闭伪静态时 Typecho 的索引入口可能包含 `index.php`。
- 站点部署在子目录时根目录不能等于域名根目录。
- 插件停用或路由被移除后仍保留链接会指向 404。
- `siteUrl` 的末尾斜杠、大小写或代理路径可能与实际路由入口不一致。

### 5.2 URL 边界

生成结果必须满足：

- 协议为 `http://` 或 `https://`。
- 无换行、回车、空白控制字符。
- 符合当前站点的 `index` 基址。
- 由 Typecho 路由和公共 URL 工具生成，不手写原生 SQL 或数据库专属链接规则。

插件停用、路由删除、生成失败或非法协议时：

- 不输出站点地图 `<a>`。
- 不影响“关于”“友链”和其余页脚项。
- 不生成第二次请求或后台探测，避免首屏额外网络请求。

## 六、模板与语义优化

现有 `<footer>` 与 `.footer-item` 结构可保留，不因该方案重构整体页面。

推荐调整：

1. 指定页面和站点地图链接统一放在语义化的页脚导航容器中：

```html
<nav class="footer-item footer-links" aria-label="站点链接">
  <a ...>关于</a>
  <a ...>友链</a>
  <a ...>站点地图</a>
</nav>
```

不强制要求把单个 `.footer-item` 改成 `<nav>`；首版应以兼容现有选择器为主。

2. 站点地址、标题、版权链接使用安全转义：

```php
htmlspecialchars($value, ENT_QUOTES, 'UTF-8')
```

可见文本和 HTML 属性都使用 UTF-8 转义，不裸输出用户可配置值。

3. 站点地图使用 `_blank` 时补充：

```html
rel="noopener noreferrer"
```

如果现有 UX 允许，优先同标签页打开；首版不强制改变用户习惯。

4. 页脚外链继续保留现有 `_blank`；Typecho 链接也应补充 `rel="noopener noreferrer"`。

5. 版权年份继续使用 PHP `date('Y')`，但可优先复用现有模板逻辑，不新增缓存或定时任务。

6. `filing()` 是主题模板已有的扩展点；若内容来自后台配置，继续保持由主题现有输出机制处理，不在本方案中改成字符串拼接。

## 七、性能优化方案

### 7.1 PHP

- 指定页面由批量函数一次读取，再按 slug 分配。
- 不新增每个链接的数据库查询。
- 不为站点地图地址探测插件版本或发送 HTTP 请求。
- 不读取 sitemap 内容，不解析 XML，不生成或缓存完整站点地图。
- 不引入文件缓存、内存缓存表或后台配置项。
- 请求内可复用现有页脚结果，但不跨请求依赖静态缓存，避免主题切换或路由变化后的陈旧地址。
- 保持 `getHidePage()` 对旧模板和第三方主题片段的兼容性。

### 7.2 模板与资源

- 不新增 CSS、图片、字体或第三方脚本。
- 页脚 JS 入口继续只保留样式导入：

```ts
import "./style.scss";
```

- 不在页脚增加预连接、预加载、资源提示或异步接口。
- 不为站点地图链接创建自定义点击事件或轮询检查。
- 无效链接在模板生成前过滤，不输出空 `<a href="">`。

### 7.3 布局与性能

- 不改变现有文字间距、链接间距或容器宽度。
- 页脚文字只补充合适的焦点样式，不引入动画或尺寸变化。
- 外链安全属性不新增可视资源。
- 深色模式沿用现有变量，不在页脚重复定义配色。

## 八、可访问性与 SEO

- 链接保留可见标题，不因缺少图标而失去链接名称。
- 新标签页外链通过 `rel="noopener noreferrer"` 降低安全风险；必要时在可读名称中说明将在新标签页打开。
- 站点地图链接使用固定可读标题“站点地图”，不堆叠关键词。
- 页脚中不新增页面级 JSON-LD、Meta、隐藏关键词或重复标题。
- 键盘可依次聚焦页脚中的可见链接。
- 继续使用 `:hover` 和 `:active` 状态，同时为链接增加 `:focus-visible` 然后保留足够颜色对比度。
- 禁用 JavaScript 时页脚链接和文本仍可由 PHP 模板直接输出与跳转。
- 图片不涉及页脚优化，不新增装饰图或懒加载逻辑。

## 九、边界矩阵

| 场景 | 期望 |
| --- | --- |
| 未配置或不存在 `about` 独立页 | 不渲染关于链接 |
| 未配置或不存在 `links` 独立页 | 不渲染友链链接 |
| 独立页标题为空或地址非法 | 跳过该项，不保留空链接 |
| 同一 slug 存在重复页面 | 只保留首个有效页面 |
| 独立页被删除或为草稿 | 不渲染对应链接 |
| AutoSitemap 插件未启用 | 不渲染站点地图链接 |
| AutoSitemap 路由已注册 | 使用 Typecho 路由生成准确地址 |
| 伪静态开启 | URL 遵循重写后的站点路由 |
| 伪静态关闭 | URL 遵循 Typecho 的 index 路径规则 |
| 站点部署在子目录 | URL 使用站点 index 基址，不拼接域名根目录 |
| 站点标题或地址含引号和尖括号 | 正确转义，不破坏 HTML |
| 邮箱格式异常或为空 | 不产生畸形 `mailto:`；首版沿用现有作者数据回退规则 |
| 禁用 JavaScript | 页脚文本与有效链接正常渲染 |
| 插件路由生成失败 | 不输出失效站点地图项，不影响其他页脚项 |

## 十、代码落点

| 文件 | 改动 |
| --- | --- |
| [src/functions/utils.php](src/functions/utils.php) | 新增批量独立页读取函数与站点地图路由 URL 函数；保留 `getHidePage()`兼容入口 |
| [src/modules/footer/footer.php](src/modules/footer/footer.php) | 一次读取指定独立页；通过路由函数获取站点地图；统一转义动态文本和属性 |
| [src/modules/footer/style.scss](src/modules/footer/style.scss) | 保持现有外观；补充链接焦点态和窄屏可读性；不新增布局结构依赖 |
| [src/modules/footer/index.ts](src/modules/footer/index.ts) | 保持仅导入样式，不增加运行时逻辑 |

公共函数约束：

- 新公共函数统一放入 [src/functions/utils.php](src/functions/utils.php)，禁止在模板中重复声明。
- 不新增跨文件同名函数，不重写历史上的 `getOs` 等问题函数。
- 涉及数据库仍使用 `getAllPages()` 现有的 `Typecho_Db` 查询构造器，不手写原生 SQL。
- 涉及 `fields` 不适用于本模块，不读取或修改 `table.fields`。

## 十一、验证清单

### 11.1 功能验证

| 用例 | 期望 |
| --- | --- |
| 首页/分类页/归档页包含页脚 | 指定页面和站点地图逻辑一致 |
| 有效 `about` 和 `links` 页面 | 分别渲染正确标题和真实 permalink |
| 缺少其中一个隐藏页 | 不渲染缺失项，不输出空链接 |
| 两个 slug 都缺失 | 不影响版权、地址、邮箱、备案和 Typecho 行 |
| 插件未启用 | 不渲染站点地图 |
| 插件已启用且路由已注册 | 渲染与 Typecho 路由一致的 sitemap 地址 |
|伪静态开启/关闭 | 两种配置下地址正确且可访问 |
| 站点部署在子目录 | 地址保留子目录，不跳到域名根目录 |
| 动态标题含引号、尖括号或多行空白 | 文本和属性安全，不破坏标签 |
| 禁用 JavaScript | 所有有效页脚链接仍可点击 |

### 11.2 性能验证

- 页脚不再在一次渲染中重复调用 `getAllPages()`。
- 页脚没有网络请求、轮询、预加载或路由探测请求。
- 站点地图地址只在模板生成阶段计算一次。
- 无效独立页和插件停用不会产生额外 DOM 占位或空项。
- 首页首次渲染不因页脚读取独立页出现明显额外数据库压力。
- 若需要跟踪查询次数，在开发环境确认 `about` 和 `links` 共用一次独立页读取。

### 11.3 构建与 PHP 验证

- 在 Docker 容器内对修改后的 PHP 文件执行 `php -l`。
- 执行 `pnpm check` 和 `pnpm build`。
- 确认构建末端没有 U+FFFD/`锟` 乱码告警。
- 确认 `dist/` 已按 theme-assembler 流程同步到 `docker/themes/Typecho_Theme_JJ/`。
- 检查桌面、平板和移动端页脚换行、间距和焦点态。

### 11.4 数据库三库验证

页脚复用现有独立页查询，因此若修改或新增查询逻辑，应在以下环境实测：

- SQLite：`docker-compose.sqlite.yml`
- MySQL 8.0：`docker-compose.mysql80.yml`
- PostgreSQL：`docker-compose.pgsql.yml`

验证至少覆盖：

- 同时存在 `about` 和 `links` 隐藏页。
- 缺少任一指定页。
- 重复 slug。
- 草稿独立页不显示。
- 插件启用和停用两种状态。

使用构造器读取独立页，不使用三库原生 SQL。

## 十二、文档与兼容

- 不改动主题版本号、发布流程或后台设置结构。
- 不新增站点地图插件配置项；路由由 AutoSitemap 插件自己的激活流程管理。
- 不把插件停用后的站点地图地址写入主题配置。
- 保留现有隐藏页 slug：`about` 和 `links`。
- 保留页脚现有文案和视觉项，除非法/无效数据外不隐藏正常内容。

## 十三、不做的事

- 不生成或代理站点地图 XML 内容。
- 不调用 sitemap 页面进行 HTTP 存活探测。
- 不新增独立页缓存表、磁盘缓存或后台缓存开关。
- 不新增页脚 Vue、Axios、mitt、轮播或交互组件。
- 不修改 AutoSitemap 插件的路由名、插件名或 Action 实现。
- 不将任意插件路由或自定义页面路径硬编码到模板。
- 不在页脚引入第三方字体、图标库或资源 CDN。
- 不进行跨数据库迁移，不新增表或原生 DDL。
- 不重写备案、版权、地址、邮件的既有主题配置语义。
