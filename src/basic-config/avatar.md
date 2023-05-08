<!--
 * @Author: mulingyuer
 * @Date: 2023-03-28 17:42:35
 * @LastEditTime: 2023-05-08 22:03:25
 * @LastEditors: mulingyuer
 * @Description: 头像换源
 * @FilePath: \Typecho_Theme_JJ\src\basic-config\avatar.md
 * 怎么可能会有bug！！！
-->

# 头像换源

官方默认的源在国内访问非常的慢，可以自己在 Typecho 设置里更换

找到博客根目录的 `config.inc.php`文件，在里面加入这句话就行了：

```php
/** 更换gravatar头像源*/
define('__TYPECHO_GRAVATAR_PREFIX__', 'https://gravatar.loli.net/avatar/');
```

源的地址有很多，可以自己百度 gravatar 头像源地址

## 推荐方案

根据和泽泽的沟通，他提供了一个不错的解决方案，就是采用**cravatar**提供的服务来实现头像展示，这是一个面向国内环境的 Gravatar 头像代替方案，是有降级处理的，首先它会获取这个人在 cravatar 站点设置的头像，如果没有使用 Gravatar 头像，如果没有，则去匹配 QQ 头像，如果也没有，则使用保底的默认图案。

总体来说这个方案可选性非常好，个人使用了一下速度也很快，值得一用！

cravatar 官网：[https://cravatar.cn/](https://cravatar.cn/)

使用方法和上面头像换源一样，把源地址改成 cravatar 就行了。

```php
/** 更换gravatar头像源*/
define('__TYPECHO_GRAVATAR_PREFIX__', 'https://cravatar.cn/avatar/');
```
