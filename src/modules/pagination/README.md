# 通用分页组件（pagination）

主题内所有分页场景的统一实现，支持两种模式：

- **infinite**：无限滚动，滚动到底部自动加载下一页（IntersectionObserver 提前 100px 触发）。
- **button**：按钮翻页，页码 + 上一页/下一页链接跳转。

## 目录结构

| 文件             | 职责                                                            |
| ---------------- | --------------------------------------------------------------- |
| `pagination.php` | 通用 PHP 模板，由 `renderPagination()` 调用，不要直接 `need()`  |
| `index.ts`       | 无限滚动加载器 `PaginationLoader`（button 模式纯 SSR，无需 JS） |
| `types.ts`       | `PaginationLoaderOptions` 类型                                  |
| `style.scss`     | 通用样式，颜色全部走 `--jj-pagination-*` CSS 变量               |

## PHP 层：`renderPagination($archive, $options)`

定义在 `src/functions/utils.php`，模板中直接调用：

```php
<?php renderPagination($this, [
    'type' => $this->options->paginationType === 'button' ? 'button' : 'infinite',
]);?>
```

### 参数表

| 参数         | 类型                   | 默认                            | 说明                                                                                                                                                                                                                                       |
| ------------ | ---------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `type`       | `'infinite'\|'button'` | `'infinite'`                    | 翻页模式                                                                                                                                                                                                                                   |
| `prevText`   | `string\|null`         | `'上一页'`                      | 上一页文案，传 `null`/`false` 不渲染                                                                                                                                                                                                       |
| `nextText`   | `string\|null`         | `'下一页'`                      | 下一页文案，传 `null`/`false` 不渲染                                                                                                                                                                                                       |
| `pageSize`   | `int`                  | `1`                             | button 模式 `pageNav()` 两侧页码数                                                                                                                                                                                                         |
| `noMoreText` | `string`               | `'没有更多了'`                  | 到底文案                                                                                                                                                                                                                                   |
| `nextUrl`    | `string\|null`         | `null`                          | 手动下一页链接，传入后进入**手工模式**（见下）                                                                                                                                                                                             |
| `prevUrl`    | `string\|null`         | `null`                          | 手动上一页链接（与 `nextUrl` 配套）                                                                                                                                                                                                        |
| `hasMore`    | `bool\|null`           | `null`                          | 手工模式下是否有下一页；`false` 时 infinite 首屏即 no-more 态                                                                                                                                                                              |
| `loadingImg` | `string`               | `'/images/article-loading.gif'` | loading 图（相对主题目录）                                                                                                                                                                                                                 |
| `hidden`     | `bool`                 | `true`                          | 初始隐藏（配合骨架屏，骨架关闭时需把 `.jj-pagination` 加入 `contentSelectors`）                                                                                                                                                            |
| `navWidget`  | `object\|null`         | `null`                          | button 模式 `pageNav()` 实际调用的 Widget，默认 `$archive`。评论分页**必须**传评论 Widget（`$this->comments()->to($comments)` 的 `$comments`）：文章页中 `$this` 是 `Widget\Archive`，其 `$countSql` 未初始化，直接 `pageNav()` 会抛 Error |

### 手工模式

默认走 Typecho 的 `pageLink()` / `pageNav()`，要求当前路由支持页码参数。**独立页没有 `page_page` 路由**（路由表仅 `page => /[slug].html`），`pageLink()` 会返回 `#`，此时用手工模式自行拼链接：

```php
<?php
$currentPage = max(1, intval($this->currentPage));
$nextPageUrl = $this->request->makeUriByRequest('page=' . ($currentPage + 1));
renderPagination($this, [
    'type'    => 'infinite',
    'nextUrl' => $nextPageUrl,
    'hasMore' => $hasMore,
]);
?>
```

button + 手工模式时只输出上一页/下一页两个链接（无页码）。

## TS 层：`PaginationLoader`

仅 infinite 模式需要。button 模式是纯 SSR 链接跳转，无需引入本模块 JS。

```ts
import PaginationLoader from "@/modules/pagination";

const pagination = document.querySelector<HTMLElement>(".jj-pagination--infinite");
const listContainer = document.querySelector<HTMLElement>(".article-card-wrap");
if (pagination && listContainer) {
	new PaginationLoader({
		pagination,
		listContainer,
		itemSelector: ".article-card", // 返回 HTML 片段中列表项的选择器
		afterAppend(items) {
			// 可选：新插入节点后的处理，如图片懒加载、表情替换
		}
	});
}
```

### 选项（`PaginationLoaderOptions`）

| 选项              | 类型                       | 必填 | 说明                                             |
| ----------------- | -------------------------- | ---- | ------------------------------------------------ |
| `pagination`      | `HTMLElement`              | 是   | `.jj-pagination--infinite` 根元素                |
| `listContainer`   | `HTMLElement`              | 是   | 列表容器，新项 append 到这里                     |
| `itemSelector`    | `string`                   | 是   | 返回片段中列表项选择器                           |
| `fetcher`         | `(url) => Promise<string>` | 否   | 自定义请求，默认 request 封装（GET + 2 次重试）  |
| `afterAppend`     | `(items) => void`          | 否   | 追加后钩子（懒加载/表情替换/代码高亮等）         |
| `observerOptions` | `IntersectionObserverInit` | 否   | 默认 `rootMargin: 0px 0px 100px 0px`（提前触发） |

工作原理：监听分页元素进入视口 → 读取 `a.next` 的 href → 请求下一页整页 HTML → 解析出 `itemSelector` 命中的节点追加到列表 → 用片段中的新分页区替换当前分页（同步 `no-more` 状态）。

### 到底约定（重要）

翻到最后一页后继续请求时，**后端需返回 404 + 含 `jj-pagination-no-more` 的 HTML 片段**（即正常渲染页面即可，`renderPagination()` 在无下一页时输出的片段天然满足），[src/request/index.ts](../../request/index.ts) 拦截器会识别为 `NoMoreError` 并正常结束，不弹错误提示。参考实现：[src/pages/home/home.php](../../pages/home/home.php)（`isAjax()` 分支只输出列表 + 分页片段）。

## 样式定制

颜色变量集中在 [src/styles/_color.scss](../../styles/_color.scss) 的 `/* pagination */` 组：

```
--jj-pagination-bg / --jj-pagination-border / --jj-pagination-no-more-color
--jj-pagination-item-color / --jj-pagination-item-color-hover
--jj-pagination-item-bg / --jj-pagination-item-bg-hover
```

另有两个非颜色的尺寸变量（在 `style.scss` 中带默认值）：`--jj-pagination-item-size`（页码按钮尺寸，默认 32px）、`--jj-pagination-item-radius`（默认 6px）。

业务侧定制**只覆写变量或做少量布局覆盖**，不要复制整份样式：

```scss
/* 评论分页：更大的按钮 + 不同底色 */
.comment-pagination {
	--jj-pagination-item-bg: #f7f8fa;
	--jj-pagination-item-size: 35px;
	--jj-pagination-item-radius: 4px;
	.jj-pagination-button {
		border: none;
		background: transparent;
	}
}
```

## 接入一个新分页场景（完整步骤）

1. 页面 PHP 在列表末尾调用 `renderPagination($this, [...])`（独立页用手工模式拼 `?page=N`）。
2. 页面支持 ajax 片段输出：参考 home.php 的 `isAjax()` 分支，ajax 时只输出列表项 + 分页，保证到底时片段含 `jj-pagination-no-more`。
3. 页面入口 TS 引入 `PaginationLoader`，传 `itemSelector` 与 `afterAppend`。
4. 首屏有骨架屏时，把 `.jj-pagination` / `.jj-pagination-button` / `.jj-pagination-button-no-more` 加入 `SkeletonController` 的 `contentSelectors`。
5. 需要视觉差异时，在业务容器上覆写 CSS 变量。

## 已有接入

| 场景                              | 模式              | 说明                                                                                                           |
| --------------------------------- | ----------------- | -------------------------------------------------------------------------------------------------------------- |
| 文章列表（home/archive/category） | infinite / button | 由配置项 `paginationType` 控制                                                                                 |
| 通知列表（notification 独立页）   | infinite / button | 手工模式（`?page=N`），由 `notificationPaginationType` 控制                                                    |
| 评论列表                          | 仅 button         | 楼中楼嵌套结构不适合 ajax 追加（会破坏层级，且分页走 `comment-page` 路由参数），**明确不支持无限滚动，勿接入** |
