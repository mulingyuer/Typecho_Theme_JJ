# Skeleton 通用骨架屏组件

项目内统一的骨架屏解决方案，由三部分协作：

- **PHP 渲染**：`renderSkeleton()`（定义在 `src/functions/utils.php`）根据布局配置直出骨架 DOM；
- **TS 显隐**：`SkeletonController`（定义在本目录 `controller.ts`，由 `index.ts` 统一导出）负责页面加载完成后隐藏骨架、显示真实内容；
- **SCSS 基础样式**：本目录 `style.scss` 提供 `.jj-skeleton-*` 结构类与默认尺寸（默认值参考 Ant Design / Element Plus / 掘金），颜色全部走 [src/styles/_color.scss](../../styles/_color.scss) 中的 CSS 变量。

适用场景：首屏 PHP 直出前的占位骨架、接口数据返回前的列表占位骨架。

## 快速开始

以「头像 + 两行文本」的评论列表骨架为例：

**1. PHP 模板中渲染骨架（在内容容器之前）：**

```php
<?php renderSkeleton([
	'selector' => 'recent-comments-skeleton',
	'count'    => 3,
	'item'     => ['type' => 'row', 'gap' => 12, 'children' => [
		['type' => 'avatar', 'size' => 40],
		['type' => 'column', 'gap' => 8, 'children' => [
			['type' => 'line', 'width' => '40%'],
			['type' => 'line'],
		]],
	]],
]);?>
<div class="recent-comments-list hidden"><!-- 真实内容 --></div>
```

**2. 页面/模块入口 TS 中引入样式并接管显隐：**

```ts
import { SkeletonController } from "@/modules/skeleton"; // 引入骨架基础样式与显隐控制器

export const skeleton = new SkeletonController({
	selector: ".recent-comments-skeleton",
	contentSelectors: [".recent-comments-list"],
	waitForCloseSignal: true // 需要等接口数据时再关闭
});

// 接口数据渲染完成后：
skeleton.receiveClose();
```

**3. 业务样式定制（可选，在业务模块的 style.scss 中）：**

```scss
.recent-comments-skeleton {
	background-color: var(--jj-skeleton-bg);
	padding: 16px 20px;
}
```

## PHP 配置参考

`renderSkeleton(array $options): void`

| 字段       | 类型   | 必填 | 说明                                                                      |
| ---------- | ------ | ---- | ------------------------------------------------------------------------- |
| `selector` | string | 是   | 根元素附加 class（与 `jj-skeleton` 并列），供业务样式覆盖与 TS 选择器定位 |
| `count`    | int    | 否   | 列表项重复次数，默认 `1`                                                  |
| `item`     | array  | 是   | 单个列表项的块结构                                                        |

### 块类型

| type     | 字段                              | 说明                                     | 示例                                                          |
| -------- | --------------------------------- | ---------------------------------------- | ------------------------------------------------------------- |
| `avatar` | `size?: int`                      | 圆形头像块，`size` 单位 px，默认 40      | `['type' => 'avatar', 'size' => 32]`                          |
| `line`   | `width?: string`                  | 行块，`width` 支持 `%`/`px`，默认 `100%` | `['type' => 'line', 'width' => '60%']`                        |
| `image`  | `width: string`、`height: string` | 矩形图块                                 | `['type' => 'image', 'width' => '120px', 'height' => '80px']` |
| `row`    | `gap?: int`、`children: array`    | 横向排列容器，`gap` 单位 px，默认 12     | 见快速开始                                                    |
| `column` | `gap?: int`、`children: array`    | 纵向排列容器，`gap` 单位 px，默认 8      | 见快速开始                                                    |

`row` / `column` 可任意嵌套；`children` 中的块按顺序渲染。

> 约定：配置中的尺寸/间距以内联 style 输出，**颜色一律不写内联**，统一走 CSS 变量。

## TS 配置参考

```ts
new SkeletonController(options: SkeletonControllerOptions)
```

| 字段                 | 类型     | 默认    | 说明                                               |
| -------------------- | -------- | ------- | -------------------------------------------------- |
| `selector`           | string   | —       | 骨架容器选择器（即 PHP 侧的 `selector`，需带 `.`） |
| `contentSelectors`   | string[] | `[]`    | 关闭骨架时需要移除 `hidden` 的内容容器选择器列表   |
| `waitForCloseSignal` | boolean  | `false` | 是否需要外部调用 `receiveClose()` 后才允许关闭     |
| `maxDelay`           | number   | `200`   | DOMContentLoaded 后延迟关闭的毫秒数（避免闪烁）    |

### 两种关闭模式

- **自动关闭**（`waitForCloseSignal: false`，默认）：DOM 解析完成后延迟 `maxDelay` 毫秒自动隐藏骨架、显示内容。适用于首屏 PHP 直出场景。
- **信号关闭**（`waitForCloseSignal: true`）：DOM 解析完成后仍保持骨架，直到业务调用 `receiveClose()`（通常是接口数据渲染完成后）。适用于异步列表场景。

```ts
// 自动关闭
new SkeletonController({
	selector: ".article-skeleton",
	contentSelectors: [".article-card-wrap", ".article-pagination"]
});

// 信号关闭
const skeleton = new SkeletonController({
	selector: ".list-skeleton",
	contentSelectors: [".notification-list-content"],
	waitForCloseSignal: true
});
skeleton.receiveClose(); // 数据就绪后调用
```

## 样式定制指南

### CSS 变量（定义于 src/styles/_color.scss）

| 变量                               | 默认值                     | 用途                                                  |
| ---------------------------------- | -------------------------- | ----------------------------------------------------- |
| `--jj-skeleton-bg`                 | `#fff`                     | 骨架容器背景色                                        |
| `--jj-skeleton-block-bg`           | `#e4e6eb`                  | 骨架块基础色（扫光动画两端色）                        |
| `--jj-skeleton-block-bg-highlight` | `rgba(228, 230, 235, 0.5)` | 骨架块扫光高亮色                                      |
| `--jj-img-skeleton-bg`             | `#eeeff2`                  | 图片占位背景（非本组件专用，供 `<img>` 加载占位使用） |

### 结构类名

`.jj-skeleton`（根）、`.jj-skeleton-item`（列表项）、`.jj-skeleton-row`、`.jj-skeleton-column`、`.jj-skeleton-avatar`、`.jj-skeleton-line`、`.jj-skeleton-image`

业务通过「根 selector + 结构类」覆盖默认样式：

```scss
.my-skeleton {
	// 覆盖容器背景与内边距
	background-color: var(--jj-skeleton-bg);
	padding: 20px;

	// 改行块高度
	.jj-skeleton-line {
		height: 14px;
	}

	// 改头像大小（也可直接通过配置 size 字段）
	.jj-skeleton-avatar {
		width: 32px;
		height: 32px;
	}

	// 改列表项间距
	.jj-skeleton-item + .jj-skeleton-item {
		margin-top: 16px;
	}
}
```

### 常见定制场景

- **改背景色**：业务选择器内覆盖 `background-color`（引用 `--jj-skeleton-bg` 或自定义变量）。
- **改块颜色/扫光色**：业务选择器内重定义 `--jj-skeleton-block-bg` / `--jj-skeleton-block-bg-highlight`，只影响该骨架作用域。
- **改行高/头像大小/图块圆角**：覆盖对应结构类的 `height` / `width` / `border-radius`（行块宽度和头像尺寸优先用配置字段，不写样式）。
- **暗色/特殊区块**：在对应作用域重定义上述颜色变量即可，无需改组件。

## 迁移说明

旧的 `article-skeleton`、`home/recent-comments-skeleton`、`notification/list-skeleton` 三套独立骨架模块已废弃删除，`Skeleton` 抽象基类已由 `SkeletonController` 取代。新代码一律使用本组件，不要再新建独立骨架模块。
