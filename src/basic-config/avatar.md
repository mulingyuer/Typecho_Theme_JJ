<!--
 * @Author: mulingyuer
 * @Date: 2023-03-28 17:42:35
 * @LastEditTime: 2023-03-28 17:45:23
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
