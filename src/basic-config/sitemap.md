<!--
 * @Author: mulingyuer
 * @Date: 2023-03-28 02:01:59
 * @LastEditTime: 2023-05-27 17:36:36
 * @LastEditors: mulingyuer
 * @Description: 网站地图
 * @FilePath: \Typecho_Theme_JJ\src\basic-config\sitemap.md
 * 怎么可能会有bug！！！
-->

# 网站地图

这是一个用于给爬虫抓取网页信息的功能，通过插件实现！

## 插件下载

点击下载：[AutoSitemap](/zip/AutoSitemap.zip)

## 安装

下载完丢入 Typecho 的 plugins 目录下，解压，然后去博客后台启用该插件。

开启 typecho 伪静态处理，以 Nginx 为例：

```nginx
if (!-e $request_filename) {
  rewrite ^(.*)$ /index.php$1 last;
}
```

然后到 typecho 后台 --> 设置 --> 永久链接 --> 启用地址重写 --> 自定义文章路径选择默认 --> 保存即可。

![](/images/basic-config/sitemap/sitemap01.jpg)
