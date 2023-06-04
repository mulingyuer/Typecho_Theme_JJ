<!--
 * @Author: mulingyuer
 * @Date: 2023-03-28 02:22:08
 * @LastEditTime: 2023-06-04 23:45:33
 * @LastEditors: mulingyuer
 * @Description:文章小技巧
 * @FilePath: \Typecho_Theme_JJ\src\advanced-config\article-tips.md
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

```markdown
## 这是一个 b 站视频

<iframe src="//player.bilibili.com/player.html?aid=824033998&bvid=BV1Ug4y1W7Ha&cid=1070035335&page=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>
```

![](/images/advanced-config/article-tips/iframe支持01.jpg)

不知道为什么 CodePen 不支持 iframe 内嵌了，可能是我的方式不对，上个 b 站的也是一样，反正是对 iframe 做了样式支持

## 目录树

v2.2.2 版本重构了目录树，实现了**高保真掘金目录树**，为此它的展示逻辑和掘金相同，最大嵌套层级是 3 层，但是这个 3 层不是说必须从 h2-h4，而是嵌套深度只有 3 层，你可以 h3-h5 这种形式。

![](/images/advanced-config/article-tips/目录树01.jpg)
