# 资源更新

## 站点静态资源更新

当主题的资源文件发生变化后（css、js），我们刷新网站其实并不会发生变化，其主要问题就是因为宝塔的 nginx 默认配置 css 和 js 文件使用的是强缓存。

```nginx
location ~ .*\.(js|css)?$
    {
        expires      12h;
        error_log off;
        access_log /dev/null;
    }
```

官方默认配置 12 个小时内资源都是使用缓存的形式，这就导致我们一些新的变化没法及时展示了，为此我们需要将其调整为协商缓存的形式：

```nginx
location ~ .*\.(js|css)?$
    {
        add_header Last-Modified $date_gmt;
        if_modified_since off;
        etag on;
        error_log /dev/null;
        access_log /dev/null;
    }
```

使用方式，在宝塔中找到你的站点，然后点击设置，找到配置文件，将内容改为上述代码内容即可：

![](/images/basic-config/update/update01.png)

