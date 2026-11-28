# 首页主题工具模块优化方案

> 状态：方案待评审，尚未实施
>
> 涉及模块：[src/modules/home/theme-tool/](src/modules/home/theme-tool/)
>
> 涉及页面：首页、分类页、归档页
>
> 约束：不新增数据库查询、不引入第三方依赖、不手写原生 SQL、不新增配置项

## 一、原始诉求

优化首页右侧的主题工具模块，在保留现有视觉结构和功能的前提下：

1. 降低首屏资源体积和无用 JavaScript。
2. 合理加载三张固定图标，避免无必要请求和布局偏移。
3. 统一链接、图片、标题和容错文本的语义与转义。
4. 提升键盘、屏幕阅读器和无 JavaScript 环境下的可访问性。
5. 保证 FAQ、文章 RSS、评论 RSS 在登录、未登录及异常配置下行为稳定。

## 二、现状与问题

模块由三个页面直接复用：

1. [home.php](src/pages/home/home.php)
2. [category.php](src/pages/category/category.php)
3. [archive.php](src/pages/archive/archive.php)

模板现状：[theme-tool.php](src/modules/home/theme-tool/theme-tool.php)

| 类别 | 现状 | 问题与优化方向 |
| --- | --- | --- |
| 功能范围 | FAQ 仅登录用户可见，文章 RSS 和评论 RSS 恒可见 | 登录状态逻辑保留；进入模块前先完整校验链接和资源，避免异常项 |
| 性能 | 三张图标均由模板直接输出 | 固定小图使用原生属性控制加载；模块不需要运行时 JS |
| JS | [index.ts](src/modules/home/theme-tool/index.ts) 只有 SCSS import | 保持入口职责只为样式构建，删除无用注释和运行时代码；评估将其合并到页面入口 |
| 模板结构 | 使用外层 `div` 和多个可点击 `div` 内部结构 | 使用语义化 `nav`、`ul/li` 和现有链接结构，首屏即可阅读和跳转 |
| 链接安全 | FAQ 使用 `_blank`，没有 `rel="noopener noreferrer"` | 外部文档链接补充安全 rel；站内 RSS 链接不强制新标签页 |
| 图片属性 | 无尺寸、loading、decoding 和稳定宽高比 | 补充固定宽高、原生延迟加载、异步解码和有效 alt |
| 文本转义 | 固定文案无需动态转义，但动态 RSS URL 和站点主题 URL 直接输出 | RSS 地址、主题资源地址统一输出安全转义后的值 |
| 键盘体验 | 原生 `<a>` 已支持键盘，但没有明确焦点态和新窗口说明 | 增加 `:focus-visible`；外部链接提供稳定可读的无障碍名称或说明 |
| 空状态 | 模板固定输出三项，配置异常时可能出现空链接或重复图标请求 | RSS 地址为空时跳过对应项；全部项无效时不渲染模块容器 |
| 数据库 | 模块不读取数据库 | 不新增查询，不使用 `Typecho_Db` 和原生 SQL |

## 三、目标结构

推荐保留现有视觉外观，仅将容器与单项语义化：

```html
<nav class="theme-tool" aria-label="主题工具">
  <ul class="theme-tool-content">
    <li class="theme-tool-item-wrap">
      <a
        class="theme-tool-item"
        href="..."
        target="_blank"
        rel="noopener noreferrer"
        title="..."
      >
        <span class="theme-tool-item-img-wrap">
          <img
            class="theme-tool-item-img"
            src="..."
            alt=""
            width="36"
            height="36"
            loading="eager"
            decoding="async"
          >
        </span>
        <span class="theme-tool-item-title">FAQ主题使用指南</span>
      </a>
    </li>
  </ul>
</nav>
```

结构约束：

- 模板中使用 `nav` 或 `section` 表示工具区域，不使用与页面导航无关的裸 `div`。
- 工具项使用 `ul/li`，保证链接列表语义正确。
- 标题可继续使用现有 `.theme-tool-item-title`，首版不新增重复可见文案。
- 图标由相邻文本说明，推荐 `alt=""`，避免“FAQ主题使用指南图片”重复朗读。
- 保留登录判断，只在登录用户可见 FAQ。
- RSS 链接优先同标签页打开；若使用 `_blank`，必须增加 `rel` 和可访问提示。

## 四、性能优化方案

### 4.1 JavaScript

本模块当前没有交互逻辑：

- 删除 [index.ts](src/modules/home/theme-tool/index.ts) 中的作者备注和无效运行时注释。
- 如果保留入口，文件只保留 `import "./style.scss";`。
- 首页、分类页、归档页继续按需复用模块入口；首版不新增 IntersectionObserver、网络请求或状态库。
- 三张图标属于固定的同步图标，不为每张图增加自定义懒加载实例。
- 若构建结果仍生成可观察的独立运行时 JS，评估将样式入口直接接入三个页面入口；不得引入额外前端包。

### 4.2 图片加载

- 资源本身固定且体积较小，使用浏览器原生加载能力，不保留 GIF 占位或 `data-src`。
- 每张 `<img>` 设置实际容器等价尺寸：`width="36" height="36"`。
- 设置 `decoding="async"`。
- 默认设置 `loading="eager"`，避免三张固定图标在首屏外被延迟或出现图标闪烁。
- 只有实测确认模块常出现在首屏外时才统一改为 `loading="lazy"`；不因截图或假设单独调整每张图。
- 图片容器固定宽高，避免加载前后布局偏移。
- 图片加载失败时保留文字标题，不能把整个工具项或文字隐藏。

### 4.3 链接与资源

- FAQ 地址只固定为官方使用指南地址，不从后台配置读取或拼接动态域名。
- RSS 地址由 `feedUrl()` / `commentsFeedUrl()` 读取；不自行拼接 `/feed`。
- 使用 `htmlspecialchars(..., ENT_QUOTES, 'UTF-8')` 安全输出所有动态链接和标题属性。
- 图标地址仍通过 `$this->options->themeUrl()` 获取并转义。
- 首版不预取 FAQ、不预解析 RSS、不引入预连接或资源提示。

## 五、可访问性与 SEO

### 5.1 链接

- FAQ 文档是外链：保留 `_blank` 时设置 `rel="noopener noreferrer"`。
- RSS 链接可保持默认新标签行为，但只在站点现有 UX 需要时使用 `_blank`。
- 所有链接都有可见的完整标题，不使用仅图标但无名称的锚点。
- 键盘焦点使用 `:focus-visible` 明确边框或背景，不只依赖 hover。
- 点击态保留现有轻微透明反馈，但透明度不得降低到文本不可读。

### 5.2 图片与文本

- 文档或 RSS 图标旁已有完整文字，因此默认使用空 alt，不重复朗读。
- 标题不使用固定全站或首页标题替代。
- 链接 `title` 与可见标题保持一致，不重复堆砌 SEO 关键词。
- 移动端与窄屏下标题不得截断或溢出容器。

### 5.3 模块语义

- 模块本身为站点工具导航，不声称文章或卡片结构。
- 不生成页面级 JSON-LD、meta description 或隐藏关键词。
- 不增加隐藏标题；可见标题本身已足够表达目标。

## 六、代码落点

| 文件 | 改动 |
| --- | --- |
| [theme-tool.php](src/modules/home/theme-tool/theme-tool.php) | 转为语义化导航结构；校验链接；安全转义；补充图像和安全属性 |
| [style.scss](src/modules/home/theme-tool/style.scss) | 保持现有间距和配色；补充列表重置、固定尺寸、焦点态和窄屏规则 |
| [index.ts](src/modules/home/theme-tool/index.ts) | 删除冗余注释；若无运行时逻辑，只保留样式入口；不新增业务 JS |
| [home.php](src/pages/home/home.php) / [category.php](src/pages/category/category.php) / [archive.php](src/pages/archive/archive.php) | 已复用模块，不改调用方式；确认三个页面入口仍正确加载样式 |

公共 PHP 函数：

- 本模块不需要新增公共函数。
- 若后续抽取链接校验或文本转义，公共逻辑统一放入 [utils.php](src/functions/utils.php)，禁止在模板中重复实现。
- 不改动主题配置，避免给固定工具项增加冗余后台选项。

## 七、模板与边界规则

模板按以下顺序生成：

1. 初始化 `$themeToolItems = []`。
2. 登录且 FAQ 地址有效时，加入 FAQ 项。
3. 文章 RSS 地址有效时，加入文章 RSS 项。
4. 评论 RSS 地址有效时，加入评论 RSS 项。
5. 列表为空时直接结束，不输出 `.theme-tool` 容量容器。
6. 循环输出 `<li>`，所有动态文本和属性使用 UTF-8 安全转义。

链接校验规则：

- 动态链接只接受 `http://` 或 `https://`；模板可直接读取 Typecho 配置时，以站点配置生成的绝对地址为准。
- 空字符串、纯空白、非法协议和明显含换行/控制字符的地址一律跳过。
- FAQ 固定为官方 HTTPS 地址；资源地址只接受由 `$this->options->themeUrl()` 生成的主题地址。
- 不把链接拼接到日志、全局 JS 状态或 `data-*` 属性中。

边界矩阵：

| 场景 | 期望 |
| --- | --- |
| 未登录 | 不渲染 FAQ，仅输出有效的 RSS 项 |
| 已登录 | 渲染 FAQ、文章 RSS、评论 RSS |
| RSS 地址为空 | 跳过该 RSS 项，不保留空链接 |
| RSS 地址非法 | 跳过该项并保留其他有效项 |
| 图标加载失败 | 保持文字标题可读，不触发重试和无限请求 |
| 禁用 JavaScript | 模板直接渲染，全部链接仍可点击 |
| 深色模式与窄屏 | 保持现有配色变量，容器不溢出、不重叠 |
| 三项都不可用 | 整个模块不输出 DOM |

## 八、样式稳定性

- 保留现有 `.theme-tool`、`.theme-tool-content`、`.theme-tool-item` 类名，避免破坏主题选择器兼容性。
- 新增语义结构时优先新增包装类，不直接重写现有外观尺寸。
- 继续使用现有四个颜色变量；只有确实缺少深色变量时，再补充最小变量。
- 固定图标容器为 `36px × 36px`，图片可保持 `80%` 的视觉比例，不能因 `<img>` 属性改变现有显示。
- 使用 `overflow-wrap: anywhere` 或等价规则处理异常长标题，不覆盖正常中文标题。
- 列表重置只作用于模块作用域，避免影响页面其他 `<ul>`。
- 悬停、按下和键盘焦点必须使用同一可读性标准，不以颜色唯一表达状态。

## 九、性能验收

- 模块没有运行时数据请求和外部脚本依赖。
- 模块新增或重构后首页网络请求不多于现状；三张固定图标可复用浏览器缓存。
- 无 JavaScript 时 FAQ 和 RSS 链接仍可正常跳转。
- 图片加载失败不影响链接和文字。
- 首屏容器和图标在加载前后不产生明显布局抖动。
- 构建后主入口不包含无关模块逻辑；只有样式导入产生必要产物。

## 十、验证清单

### 10.1 模板与功能

| 用例 | 期望 |
| --- | --- |
| 未登录访问首页 | 不显示 FAQ，显示有效 RSS 项 |
| 登录访问首页 | 显示 FAQ、文章 RSS、评论 RSS |
| 分类页复用模块 | 三项行为与首页一致 |
| 归档页复用模块 | 三项行为与首页一致 |
| RSS 地址为空或非法 | 跳过对应项，不输出空 `href` |
| 三项都不可用 | 不渲染 `.theme-tool` 容器 |
| 标题和地址含引号、尖括号或控制字符 | HTML 属性安全，链接不破坏标签 |
| 禁用 JavaScript | 链接和文字正常渲染 |
| 图标加载失败 | 文字和链接可用 |

### 10.2 构建与兼容

- 容器内执行 `php -l` 检查修改后的模板和全部相关 PHP。
- 执行 `pnpm check` 和 `pnpm build`。
- 构建末端不得出现 U+FFFD/`锟` 乱码告警。
- 确认 `dist/` 已按现有 theme-assembler 流程同步到 `docker/themes/Typecho_Theme_JJ/`。
- 桌面、平板、移动端分别验证图标尺寸、文字对齐和键盘焦点。
- 无需三库数据库验证，因为本模块不查询、写入或解析数据库字段。

### 10.3 浏览器与无障碍

- 键盘可依次聚焦所有可见工具项。
- `:focus-visible` 在浅色、深色、悬停和激活状态下可见。
- 屏幕阅读器可理解导航名称、链接标题和图标装饰状态。
- FAQ 新标签页行为设置 `noopener noreferrer`。
- 缩放或窄屏下不出现横向溢出或标题重叠。

## 十一、不做的事

- 不新增主题后台配置项或数据库字段。
- 不新增点赞、缓存、埋点、访问统计或 API 请求。
- 不引入 Vue、Axios、轮播、动画或交互组件。
- 不把固定图标改成远程字体、SVG 精灵或第三方图标库。
- 不为三张静态小图引入自定义懒加载、资源代理或 CDN。
- 不为 RSS 地址手写拼接规则或数据库查询。
- 不把模块改成站内卡片组件、文章推荐或 SEO 数据模块。
- 不改变 FAQ 的登录可见策略，除非另行评审确认。
