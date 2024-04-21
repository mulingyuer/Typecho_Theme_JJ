<!--
 * @Author: mulingyuer
 * @Date: 2023-03-28 02:22:08
 * @LastEditTime: 2024-04-22 00:09:06
 * @LastEditors: mulingyuer
 * @Description:文章小技巧
 * @FilePath: \Typecho_Theme_JJ_docs\src\advanced-config\article-tips.md
 * 怎么可能会有bug！！！
-->

# 文章小技巧

> 一些提高使用舒适度的功能

## 文章首图

掘金的文章页展示，在顶部会有一张首图用于引流之类的，我这边也把这个功能弄过来了，在编辑文章时在底部自定义字段中可以填入图片链接地址以实现这个效果。

![](/images/advanced-config/article-tips/文章首图01.jpg)

首图除了在文章页展示，它还会用于文章缩略图展示，且优先级最高。

## 自定义缩略图

这个优先级小于文章首图，配置也和首图一样，在文章底部自定义字段中。

但是缩略图只作用于文章列表，不影响文章内容。

## 文章主题切换

在编辑文章的时候，我们可以针对每一篇文章使用喜欢的主题！

在编辑文章的自定义字段区域，有一个主题选择，一共有 14 个主题：

- 掘金
- github
- smartblue
- cyanosis
- channing-cyan
- fancy
- v-green
- mk-cute
- qklhk-chocolate
- orange
- scrolls-light
- vuepress
- nico
- devui-blue

默认为 **掘金** 主题

## todo 列表

用于处理一些已完成和未完成的事情

```markdown
[x] 这是一个选中的 todo 图标
[ ] 这是一个未选中的 todo 图标
```

![](/images/advanced-config/article-tips/todo列表01.jpg)

## 回复可见

用于一些内容，比如回复之后才能看到。

```markdown
[hide]
这里放要隐藏的内容
[/hide]
```

![](/images/advanced-config/article-tips/回复可见01.jpg)

## iframe 支持

有时候我们希望页面内嵌一些外链，比如视频，代码 codePen 这些，这个功能在之前是没有的，为此在 2.0 加入了对它的样式支持。

如果你想保持一定的宽高比列，主题目前支持16:9的比例，适用于视频和代码分享，如果需要，请给iframe元素添加一个属性：

```html
<iframe data-type="video">  </iframe>

<iframe data-type="code">  </iframe>

<iframe>  </iframe>
```

这两个自定义属性是必须的，如果你想保持这个比例的话，当然普通的iframe也是可以的，你可以自己配置行内样式实现自定义。

![](/images/advanced-config/article-tips/iframe支持01.png)

## 目录树

v2.2.2 版本重构了目录树，实现了**高保真掘金目录树**，为此它的展示逻辑和掘金相同，最大嵌套层级是 3 层，但是这个 3 层不是说必须从 h2-h4，而是嵌套深度只有 3 层，你可以 h3-h5 这种形式。

![](/images/advanced-config/article-tips/目录树01.jpg)

## 文章置顶

![](/images/advanced-config/article-tips/文章置顶03.jpg)

v2.3 版本新增了新增置顶功能，我们只需要在主题配置 -> 置顶文章 cid 列表 -> 填入需要置顶的文章 cid 即可。

支持多个置顶文章，多个文章用英文逗号隔开，例如：`2,3,4`。

文章 cid 就是发布文章后，链接上对应的 id 值，示例图：

![](/images/advanced-config/article-tips/文章置顶01.jpg)

这个 962 就是文章的 cid。

当我们配置了文章置顶后效果如下：

![](/images/advanced-config/article-tips/文章置顶02.jpg)

置顶的文章标题开头会有 **置顶** 的 tag 标签展示，当然这个标签也是可以自定义的，我们在主题配置 -> 置顶文章标题前面加的 tag -> 修改对应内容即可。

比如你可以通过 html 的行内样式来进行定制：

```html
<span style="background-color: red; color: #fff;">推荐</span>
```

当然你也可以使用我预设的：

```html
<span class="article-card-sticky-tag">置顶</span>
```

## 首页右侧推荐文章

![](/images/advanced-config/article-tips/首页右侧推荐文章01.jpg)

v2.3 版本新增了首页右侧推荐文章功能，我们只需要在主题配置 -> 首页右侧推荐文章 cid 列表 -> 填入对应的文章 cid 即可。

最大只支持 3 篇，推荐的文章必须填写自定义字段：自定义缩略图；否则展示会有问题。

因为推荐的文章展示是以图片的形式展出。

![](/images/advanced-config/article-tips/首页右侧推荐文章02.jpg)

配置完毕后效果如下：

![](/images/advanced-config/article-tips/首页右侧推荐文章03.jpg)

这个就非常适合推荐一些精品文章，配合优质的广告图进行展示，也可以是软文之类的，如果你对右下角的文字不满意，也可以自己在 **首页右侧推荐文章 tag 文字** 进行修改。
