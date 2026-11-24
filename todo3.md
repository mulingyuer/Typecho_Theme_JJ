# 用户头像占位与原生懒加载方案（Typecho 1.3）

## 一、结论（已定稿）

可行，且不需要改动数据库或主题设置。最终方案：**全部用户头像统一使用原生 `loading="lazy"`，配合 CSS 占位图、加载失败回退和头像源预连接**，不再引入 `data-src` / `IntersectionObserver` 方案。

具体包含：

1. 所有头像容器统一 CSS 占位（底色 + 剪影），图片解码前不再显示空白。
2. 评论列表、最近评论继续使用 Typecho 1.3 已输出的 `loading="lazy"`。
3. 通知列表、文章作者、顶部导航、评论表单中未带懒加载的头像，统一改为带 `loading="lazy" decoding="async"` 的 `<img>`。
4. 加载失败统一回退到本地 `default_avatar.svg`。
5. 对当前 Gravatar 源输出 `preconnect` / `dns-prefetch`，减少 DNS + TLS 开销。

不采用 `src/utils/lazyImg` 的原因：

1. Typecho 1.3 的 `Comments::gravatar()` **已经输出 `loading="lazy"`**，评论区和最近评论本身已具备浏览器级懒加载。
2. `LazyImg` 需要把真实地址从 `src` 改到 `data-src`，意味着重写所有头像模板，并放弃无 JS 时的头像显示。
3. `LazyImg` 会扫描所有 `img[data-src]`，与文章卡片缩略图共用同一属性时会产生重复监听/重复加载的竞争风险。
4. 现有 `LazyImg` 在加载失败时不会取消监听，也没有 `data-error` 回退；直接复用到头像会把这些问题带到评论区。

该决定是最终方案，不再保留 `data-src` 备选；`LazyImg` 继续只服务表情面板。

## 二、现状盘点

### 2.1 头像输出点

| 场景 | 文件 | 当前输出 | 说明 | 本次动作 |
| --- | --- | --- | --- | --- |
| 评论列表 | [list-template.php](src/modules/comment/comment-list/list-template.php) | `$comments->gravatar('40', '')` | Typecho 1.3 输出 `class="avatar" loading="lazy"`，带 `width/height/alt` | 不改，已原生懒加载 |
| 最近评论 | [recent-comments.php](src/modules/home/recent-comments/recent-comments.php) | `$comments->gravatar(40)` | 首页、归档、分类页共用，同样走 `Comments::gravatar()` | 不改，已原生懒加载 |
| 文章作者 | [article-author.php](src/modules/article-author/article-author.php) | `$this->author->gravatar(80)` | 走 `Users::gravatar()`，没有 `loading`/`decoding` | 改为手写 `<img>` 并补原生懒加载 |
| 通知列表 | [list.php](src/pages/notification/components/list.php) | 手写 `<img src="Common::gravatarUrl(...)">` | 无 `loading`/`decoding` | 补 `loading` / `decoding` |
| 评论表单 | [comment-form.php](src/modules/comment/comment-form/comment-form.php) | 登录用户 / 记住邮箱 / 默认头像三分支 | 登录与邮箱分支是远程头像，默认分支是本地 SVG | 三个分支统一补原生懒加载 |
| 顶部导航 | [header.php](src/modules/header/header.php) | 两处 `$this->author->gravatar()` | 登录态头像与下拉菜单头像 | 改为手写 `<img>` 并补原生懒加载 |
| 友链页图片 | 链接模块 | 站点图标，不是用户头像 | — | 不纳入头像逻辑 |

### 2.2 Typecho 1.3 的关键行为（已核对 1.3.0 源码）

- `Comments::gravatar($size, $default, $highRes)` 输出形如：

  ```html
  <img
    class="avatar"
    loading="lazy"
    src="https://cravatar.cn/avatar/xxx?s=40&amp;r=X"
    alt="作者名"
    width="40"
    height="40"
  />
  ```

  评论列表与最近评论因此**已经具备原生懒加载**；真正缺失的是占位视觉和失败回退。

- `Users::gravatar($size = 40, $rating = 'X', $default = null, $class = null)` 不输出 `loading`/`decoding`，文章作者头像属于这一类。

- `Common::gravatarUrl()` 会把查询分隔符输出成 `&amp;`（HTML 实体形式），模板里直接放进属性即可。**禁止再对返回值做 `htmlspecialchars()`**，否则会变成 `&amp;amp;`，`r`/`d` 参数失效。

- 头像 URL 的 `rating`/`default` 语义在不同调用点并不完全一致。本次把 `Users::gravatar()` 改为手写 `<img>` 时，必须保留原参数（见 4.2 对照表）。

### 2.3 现有的占位与懒加载能力（评估后不用于头像）

- [src/utils/lazyImg/index.ts](src/utils/lazyImg/index.ts)：`LazyImg` 只处理 `img[data-src]`，当前用于表情面板。
  - 命中视口后先 `removeAttribute('data-src')`，再异步加载；失败时没有回退，监听也不会解除。
  - 构造时一次性收集节点，没有 `scan()`，不适合通知页无限滚动追加的节点。
  - 与 `article-card` 的 `ThumbLazy` 共用 `data-src` 属性，混用会互相干扰。
- [src/modules/article-card/thumbLazy.ts](src/modules/article-card/thumbLazy.ts)：文章缩略图的专用懒加载，支持 `data-error` 回退，但它是模块单例，不处理头像。
- [src/styles/_color.scss](src/styles/_color.scss)：已有 `--jj-img-skeleton-bg: #eeeff2`，骨架屏文档把它标注为“图片占位背景（供 `<img>` 加载占位使用）”。
- [src/modules/header/style.scss](src/modules/header/style.scss)：顶部头像已经在用 `background-color: var(--jj-img-skeleton-bg)` 做占位。
- [public/images/comment/default_avatar.svg](public/images/comment/default_avatar.svg)：约 1.1 KB 的灰色剪影，适合做加载失败回退。
- [src/utils/error.ts](src/utils/error.ts)：已有全局图片错误分发，目前只处理友链图片；可以直接扩展头像。
- [public/scripts/globalError.js](public/scripts/globalError.js)：在 `<head>` 中捕获早期资源错误，主包加载后会重放，头像不会漏掉回退。

### 2.4 布局与 CLS

所有头像容器都已经固定尺寸，图片本身也由容器约束：

| 容器 | 尺寸 |
| --- | --- |
| `.comment-list-media-avatar` | 40 × 40 |
| `.recent-comments-list-item-avatar` | 36 × 36 |
| `.article-author-avatar` | 48 × 48 |
| `.notification-list-item-avatar` | 45 × 45 |
| `.comment-form-avatar` | 40 × 40 |
| `.header-avatar` / `.header-menu-avatar` | 36 × 36 / 48 × 48 |

因此占位图只影响填充效果，不会引入布局偏移（CLS）。

## 三、方案对比与决策

| 方案 | 占位 | 视口触发 | 无 JS | 改动面 | 主要风险 | 结论 |
| --- | --- | --- | --- | --- | --- | --- |
| **A. CSS 占位 + 原生 `loading="lazy"`** | CSS 背景剪影 | 浏览器阈值（会提前一段距离，具体由浏览器/网络决定） | 完整可用 | 小 | 触发距离不可控；老 Safari 会 eager | **采用** |
| B. `data-avatar-src` + `Observer` | `<img>` 本地占位图 | 自定义，可精确控制 | 头像只剩占位图 | 中 | 模板全量改写；动态节点；重复请求；参数走样 | 放弃 |
| C. 仅 JS 占位、不做懒加载 | `<img>` 本地占位图 | 立即加载 | 占位图 | 小 | 与 A 类似但没有带宽收益 | 放弃 |

**决策：采用 A。** Typecho 1.3 已经为评论头像输出 `loading="lazy"`，主题只需要把其余头像补齐为同一种原生方式，并加上占位与失败回退即可；不需要新增运行时依赖，也保留了无 JS 时的头像显示。

## 四、实施方案

### 4.1 统一占位样式

新增 `src/styles/_avatar.scss`，在 [src/styles/index.scss](src/styles/index.scss) 中 `@use` 引入。占位由两部分组成：

- `background-color: var(--jj-img-skeleton-bg)`：图片解码前先铺底色。
- 一张内联 SVG 剪影作为 `background-image`：让占位更像头像，而不是空白方块。

示意：

```scss
/* src/styles/_avatar.scss */
$jj-avatar-placeholder: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='15.5' r='6' fill='%23c2c8d1'/%3E%3Cpath d='M8 38c1.2-8 6-12 12-12s10.8 4 12 12z' fill='%23c2c8d1'/%3E%3C/svg%3E");

:where(
		.comment-list-media-avatar,
		.recent-comments-list-item-avatar,
		.article-author-avatar,
		.notification-list-item-avatar,
		.comment-form-avatar,
		.header-avatar,
		.header-menu-avatar
	)
	img {
	background-color: var(--jj-img-skeleton-bg);
	background-image: $jj-avatar-placeholder;
	background-position: center;
	background-repeat: no-repeat;
	background-size: cover;
}
```

要点：

- 用 `:where()` 降低优先级，方便各模块后续覆盖。
- 不使用 `::before` 遮罩：遮罩在图片加载完成后还需要 JS 主动隐藏，否则会盖住真实头像；背景层天然被不透明图片覆盖。
- Gravatar 返回的头像通常是不透明 PNG/JPEG，真实图片会完全覆盖占位；如果未来允许透明头像，占位会透出，但仍是可接受的降级。
- 不默认加扫光动画。CSS 无法感知图片加载完成，动画会在图片加载后继续在背后运行，收益低且浪费渲染；如确实需要，只对 `.jj-avatar-loading` 这类由 JS 控制的类生效。
- 如果站点 CSP 的 `img-src` 禁止 `data:`，剪影不会显示，但 `background-color` 仍然生效，不阻塞头像本身。
- 评论表单的默认头像是本地 SVG，和占位剪影叠加可能略深；若观感不佳，把 `.comment-form-avatar` 从 `:where()` 列表移除即可，不影响远程头像分支。

### 4.2 全部头像统一原生懒加载

评论列表与最近评论已经由 Typecho 输出 `loading="lazy"`，不需要改。其余场景统一补成带 `loading="lazy" decoding="async"` 的 `<img>`。

评论列表/最近评论保持原生输出的原因：`Comments::gravatar()` 同时负责 `commentsAvatar` 开关和 `gravatar` 插件钩子，直接重写会绕过这些行为；40px 头像补 `decoding="async"` 的收益也很小，因此只补占位与失败回退，不强行替换。

#### 4.2.1 通知列表

```php
<img
  loading="lazy"
  decoding="async"
  src="<?php echo \Typecho\Common::gravatarUrl($comment['mail'], 40); ?>"
  alt="<?php echo htmlspecialchars($comment['author']); ?>"
>
```

#### 4.2.2 文章作者

[article-author.php](src/modules/article-author/article-author.php) 当前使用 `Users::gravatar(80)`，改为：

```php
<img
  loading="lazy"
  decoding="async"
  src="<?php echo \Typecho\Common::gravatarUrl($this->author->mail, 80, 'X', null, $this->request->isSecure()); ?>"
  alt="<?php echo htmlspecialchars($this->author->screenName); ?>"
  width="80"
  height="80"
>
```

必须保持 `Users::gravatar()` 的语义：`size = 80`、`rating = 'X'`、`default = null`、`isSecure = $this->request->isSecure()`，`alt` 用 `screenName`。注意 `Common::gravatarUrl()` 已输出 `&amp;`，不能再 `htmlspecialchars()`。`Users::gravatar()` 内部就是 `gravatarUrl()` + `<img>`，没有额外插件钩子，手写输出等价。

#### 4.2.3 顶部导航

[header.php](src/modules/header/header.php) 有两处 `Users::gravatar()`：

- `.header-avatar`：`gravatar(80)` → `size = 80`、`rating = 'X'`、`alt = screenName`。
- `.header-menu-avatar`：`gravatar(100)` → `size = 100`、`rating = 'X'`、`alt = screenName`。

两处都改为手写 `<img>`，补 `loading="lazy" decoding="async"`，保留 `.header-menu-avatar` 外层 `<a>` 的链接与 `target` 行为。头像在首屏时会立即加载，`loading="lazy"` 不会让首屏头像延迟；下拉菜单里的 100px 头像则可以在菜单打开前保持延迟。

```php
<img
  loading="lazy"
  decoding="async"
  src="<?php echo \Typecho\Common::gravatarUrl($this->author->mail, 80, 'X', null, $this->request->isSecure()); ?>"
  alt="<?php echo htmlspecialchars($this->author->screenName); ?>"
  width="80"
  height="80"
>
```

下拉菜单处把 size 改成 `100`，`width/height` 同步改成 `100`，`gravatarUrl()` 的第二个参数同步改成 `100`。

#### 4.2.4 评论表单

[comment-form.php](src/modules/comment/comment-form/comment-form.php) 三个分支统一：

```php
<?php if ($this->user->hasLogin()): ?>
  <img
    loading="lazy"
    decoding="async"
    src="<?php echo \Typecho\Common::gravatarUrl($this->author->mail, 40, 'X', null, $this->request->isSecure()); ?>"
    alt="<?php echo htmlspecialchars($this->author->screenName); ?>"
    width="40"
    height="40"
  >
<?php else: ?>
  <?php $email = $this->remember('mail', true); if (!empty($email)): ?>
    <img
      loading="lazy"
      decoding="async"
      src="<?php echo \Typecho\Common::gravatarUrl($email, 80); ?>"
      alt="评论头像"
      width="80"
      height="80"
    >
  <?php else: ?>
    <img
      loading="lazy"
      decoding="async"
      src="<?php $this->options->themeUrl('/images/comment/default_avatar.svg');?>"
      alt="默认头像"
      width="40"
      height="40"
    >
  <?php endif;?>
<?php endif;?>
```

- 登录分支对齐 `Users::gravatar()` 默认值：`size = 40`、`rating = 'X'`、`default = null`、`isSecure = $this->request->isSecure()`。
- 记住邮箱分支沿用现有 `Common::gravatarUrl($email, 80)`：`rating = null`、`default = null`、`isSecure` 走默认值（与现状一致，不改变行为）。
- 默认分支是本地 SVG，也统一带 `loading="lazy"`，保持所有头像标签一致。
- `CommentAvatar.inputChange` 只更新 `src`，不涉及 `loading` 属性，现有逻辑无需改动。

#### 4.2.5 参数对照

| 场景 | 原调用 | `size` | `rating` | `default` | `alt` |
| --- | --- | --- | --- | --- | --- |
| 评论列表 | `$comments->gravatar('40', '')` | 40 | `Helper::options()->commentsAvatarRating` | `''` | 评论作者名（Typecho 自带） |
| 最近评论 | `$comments->gravatar(40)` | 40 | `Helper::options()->commentsAvatarRating` | `null` | 评论作者名（Typecho 自带） |
| 文章作者 | `$this->author->gravatar(80)` | 80 | `'X'` | `null` | `screenName` |
| 顶部头像 | `$this->author->gravatar(80)` | 80 | `'X'` | `null` | `screenName` |
| 下拉菜单头像 | `$this->author->gravatar(100)` | 100 | `'X'` | `null` | `screenName` |
| 评论表单-登录 | `$this->author->gravatar()` | 40 | `'X'` | `null` | `screenName` |
| 评论表单-记住邮箱 | `Common::gravatarUrl($email, 80)` | 80 | `null` | `null` | 自定义 |
| 通知列表 | `Common::gravatarUrl($mail, 40)` | 40 | `null` | `null` | 评论作者名 |

手写输出的 `isSecure` 统一传 `$this->request->isSecure()`；通知列表保持现有默认值（`true`），不改变原有行为。

> 原生 `loading="lazy"` 会在接近视口时提前加载，具体距离由浏览器和网络状况决定；这是本方案接受的浏览器行为。

### 4.3 加载失败回退

在 [src/utils/error.ts](src/utils/error.ts) 增加头像错误处理，并挂到现有的 `globalErrorCallback`：

```ts
const AVATAR_IMG_SELECTOR = [
	".comment-list-media-avatar img",
	".recent-comments-list-item-avatar img",
	".article-author-avatar img",
	".notification-list-item-avatar img",
	".comment-form-avatar img",
	".header-avatar img",
	".header-menu-avatar img"
].join(",");

function avatarImgError(event: ErrorEvent) {
	const target = event.target;
	if (!(target instanceof HTMLImageElement)) return;
	if (!target.matches(AVATAR_IMG_SELECTOR)) return;

	const fallback = joinThemePath("/images/comment/default_avatar.svg");
	if (!fallback) return;

	const current = target.currentSrc || target.src;
	if (current.includes("/images/comment/default_avatar.svg")) return;

	target.removeAttribute("srcset");
	target.src = fallback;
}

function globalErrorCallback(event: ErrorEvent) {
	linksImgError(event); // 现有友链逻辑保持不变
	avatarImgError(event);
}
```

要点：

- 用 `currentSrc` 优先判断，`srcset` 存在时也不会误判。
- 用路径包含判断防止默认头像再次失败导致循环。
- 新增头像场景时，需要同步把容器选择器加进 `AVATAR_IMG_SELECTOR`；这是本方案唯一的维护点。
- 早期错误由 `globalError.js` 记录并重放，不会因为主包未加载而丢失。

### 4.4 预连接头像源（推荐，低成本）

头像慢很大一部分时间花在 DNS + TLS 握手上。在 [default-head.php](src/modules/default-head/default-head.php) 输出 `preconnect` / `dns-prefetch`，复用主题已经生效的头像源常量：

```php
<?php
$gravatarPrefix = getGravatarPrefix();
$gravatarScheme = parse_url($gravatarPrefix, PHP_URL_SCHEME);
$gravatarHost = parse_url($gravatarPrefix, PHP_URL_HOST);
if (
    is_string($gravatarScheme)
    && is_string($gravatarHost)
    && $gravatarHost !== ''
    && in_array(strtolower($gravatarScheme), array('http', 'https'), true)
):
    $gravatarOrigin = strtolower($gravatarScheme) . '://' . $gravatarHost;
?>
<link rel="preconnect" href="<?php echo headEscape($gravatarOrigin); ?>" />
<link rel="dns-prefetch" href="<?php echo headEscape($gravatarOrigin); ?>" />
<?php endif; ?>
```

要点：

- 只取 scheme + host，不拼接 `/avatar/` 路径。
- 系统 `config.inc.php` 已定义 `__TYPECHO_GRAVATAR_PREFIX__` 时，`getGravatarPrefix()` 会返回系统值，自动跟随，不需要额外分支。
- 图片请求是 no-cors，**不要加 `crossorigin`**，否则连接无法被普通 `<img>` 复用。
- `preconnect` 被 CSP `connect-src` 拦住时只会产生控制台提示，不影响头像加载。

### 4.5 改动清单

| 文件 | 操作 | 说明 |
| --- | --- | --- |
| `src/styles/_avatar.scss` | 新增 | 统一头像占位底色与剪影 |
| [src/styles/index.scss](src/styles/index.scss) | 编辑 | 引入 `_avatar.scss` |
| [src/utils/error.ts](src/utils/error.ts) | 编辑 | 新增头像失败回退并挂到全局错误分发 |
| [src/pages/notification/components/list.php](src/pages/notification/components/list.php) | 编辑 | 补 `loading="lazy" decoding="async"` |
| [src/modules/article-author/article-author.php](src/modules/article-author/article-author.php) | 编辑 | 将 `gravatar(80)` 改为带 `loading="lazy"` 的手写 `<img>`，保持 `rating='X'` |
| [src/modules/header/header.php](src/modules/header/header.php) | 编辑 | 两处 `gravatar()` 改为带 `loading="lazy"` 的手写 `<img>`，size 分别为 80 / 100 |
| [src/modules/comment/comment-form/comment-form.php](src/modules/comment/comment-form/comment-form.php) | 编辑 | 三个头像分支统一补 `loading="lazy" decoding="async"` |
| [src/modules/default-head/default-head.php](src/modules/default-head/default-head.php) | 编辑 | 输出头像源 `preconnect` / `dns-prefetch` |
| [src/utils/lazyImg/index.ts](src/utils/lazyImg/index.ts) | 不改 | 继续只服务表情面板 |
| 数据库 / 主题设置 | 不改 | 无新增字段、无新增配置项 |

不需要修改 PHP 函数库，也不涉及任何 SQL；三库兼容性不受影响。

### 4.6 验证清单

构建与静态检查：

```bash
pnpm check
pnpm build
```

```bash
# 本机无 PHP，改动的 PHP 文件走容器校验
docker run --rm -v "<repo>:/work" -w /work joyqi/typecho:1.3.0-php8.2-apache sh -c 'php -l src/pages/notification/components/list.php && php -l src/modules/article-author/article-author.php && php -l src/modules/header/header.php && php -l src/modules/comment/comment-form/comment-form.php && php -l src/modules/default-head/default-head.php'
```

手工验证（DevTools 开启 Slow 3G / 离线模拟）：

- [ ] 评论列表：首屏头像先显示灰色剪影，真实头像到达后覆盖；滚动到评论区不出现空白方块。
- [ ] 最近评论（首页 / 归档 / 分类）：骨架关闭后先显示占位，再显示真实头像。
- [ ] 通知页：首屏头像有占位；滚动加载下一页后，新追加项同样有占位。
- [ ] 文章作者：右侧栏头像有占位，不闪烁、不撑开布局；移动端滚到该位置时才发起请求。
- [ ] 评论表单：三个分支都带 `loading="lazy" decoding="async"`；输入合法邮箱后头像能正常切换，占位不会残留。
- [ ] 顶部导航：登录态头像与下拉菜单头像都有占位，`loading` 属性不影响首屏显示和菜单交互。
- [ ] 失败回退：DevTools 阻断头像域名后，所有头像回退为本地 `default_avatar.svg`，不出现循环请求。
- [ ] 自定义头像源：主题设置切换 Cravatar / 自定义源 / 官方源后，头像是新源，`preconnect` 也指向新 host。
- [ ] 无 JS：头像仍然正常加载（原生方案的关键优势）。
- [ ] 关闭 `commentsAvatar` 选项：评论区不输出头像，页面无报错。
- [ ] 页面无 CLS：Lighthouse / Performance 面板的 CLS 不因头像占位变化。

## 五、已否决方案（存档）

`data-avatar-src` + `Observer` 方案不再实施。保留该结论，避免后续重复讨论：

- 原生 `loading="lazy"` 已覆盖评论区，再引入 JS 懒加载只会重复实现同一能力。
- 需要把所有头像的 `src` 改为 `data-src`，重写模板并失去无 JS 时的头像显示。
- 需要额外处理 `rating`/`default` 参数、动态评论表单、通知页追加节点和 observer 生命周期。
- 收益仅是“触发距离可控/淡入”，与当前需求不匹配。

`LazyImg` 保持现状，仅用于表情面板；`article-card` 的 `ThumbLazy` 继续服务文章缩略图。两者都不参与头像链路。

## 六、实施顺序

1. 新增 `_avatar.scss` 并在全局入口引入，先验证所有头像有占位、无 CLS。
2. 统一补齐原生懒加载：
   - 通知列表：补 `loading="lazy" decoding="async"`。
   - 文章作者：改为带 `loading="lazy"` 的手写 `<img>`，保持 `rating='X'`。
   - 顶部导航：两处 `gravatar()` 改为手写 `<img>`，size 分别 80 / 100。
   - 评论表单：三个分支统一补 `loading="lazy" decoding="async"`。
3. 扩展 `error.ts`，验证阻断头像域名后的回退。
4. 在 `default-head.php` 增加头像源预连接，验证切换头像源后 host 同步变化。
5. 跑 `pnpm check`、`pnpm build`（exit code 1 属已知现象，以产物为准）、PHP lint 和 4.6 节手工清单。

## 七、本次不做

- 不做头像本地缓存/代理（会引入目录权限、清理策略和隐私问题）。
- 不新增主题设置开关；头像占位属于默认行为，无需配置。
- 不修改 Gravatar 源选择逻辑、不改 `applyGravatarPrefix()`。
- 不改 `CommentAvatar` 的邮箱实时换头像逻辑（只更新 `src`，不影响 `loading` 属性）。
- 不做 `data-src` / `IntersectionObserver` 头像懒加载（见第五节）。
- 不引入第三方懒加载库。