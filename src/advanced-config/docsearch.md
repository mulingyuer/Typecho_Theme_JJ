<!--
 * @Author: mulingyuer
 * @Date: 2023-06-04 23:47:41
 * @LastEditTime: 2023-06-05 00:08:32
 * @LastEditors: mulingyuer
 * @Description: docsearch
 * @FilePath: \Typecho_Theme_JJ\src\advanced-config\docsearch.md
 * 怎么可能会有bug！！！
-->

## 介绍

DocSearch 是一个第三方的搜索插件，它自己有爬虫抓取，所以不依赖博客本身，一般情况它会一周抓取一次网页数据，使用 DocSearch 可以带来一些搜索体验提升，由于 Typecho 本身搜索功能是比较弱的，一些文章内的关键词搜索基本是没戏，而且不支持即时返回搜索结果，必须刷新页面，体验上也会打折扣一些。

目前我们可以看到一些开源的文档库其实都是使用了 DocSearch，当我们去查询 api 的时候带来的精准度非常可观，加上我本人的博客其实是一个分享技术类的，常常有一些内容其实并不能在标题中展示，这就导致我知道我要什么，但是就是搜不出来的窘境，为此我不得不去想想办法，有什么方式能提高搜索的效果。

于是在 v2.2.2 的版本中迎来了一些大的改动，除了架构更加完善了，其中也增加了 DocSearch 配置。

## 使用

目前 DocSearch 是免费的，你需要自己去申请一些使用，一般 3 个工作日就会有一封邮件回复，里面包含了你的 apiKey 等相关数据。

申请地址：[DocSearch](https://docsearch.algolia.com/apply/)

成功后我们进入到主题配置页面：

![](/images/advanced-config/article-tips/docsearch01.jpg)

选择开启，然后填入对应的数据，保存即可享用。

入口我放在了浮动工具模块中，开启 DocSearch 后会出现一个搜索按钮，点击即可体验！

![](/images/advanced-config/article-tips/docsearch02.gif)

除了通过搜索按钮触发，DocSearch 还支持快捷键 `CTRL + K` 进行触发，mac 系统也是支持快捷键的，把 CTRL 换成对应的键即可。

如果不想要这个功能，可以主题配置中选择关闭即可。

## 注意事项

1. 火狐浏览器+搜狗输入法会导致 DocSearch 无法输入中文，如果你使用了火狐并且使用搜狗输入法，搜索时可以切换成微软输入法来输中文，个人测试是没有问题的。
2. DocSearch 不支持商用，仅用于开源项目和技术博客，具体申请的时候有说明。
3. 免费版我记得是有额度限制的，每月 10,000 次搜索，每月 50 MB 的存储空间。

