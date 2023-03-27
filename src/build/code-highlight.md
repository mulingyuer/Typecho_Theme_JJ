<!--
 * @Author: mulingyuer
 * @Date: 2023-03-28 02:43:14
 * @LastEditTime: 2023-03-28 02:50:32
 * @LastEditors: mulingyuer
 * @Description: 代码高亮
 * @FilePath: \Typecho_Theme_JJ\src\build\code-highlight.md
 * 怎么可能会有bug！！！
-->

# 代码高亮

由于代码种类非常之多，我只能在尽量少的脚本大小情况下，支持常见的一些代码类型，但是并不是所有的代码类型我都支持，如果你需要高亮的代码刚好不在支持范围内，可以通过自己构建的方式，引入对应的代码高亮支持，然后构建自己的主题。

::: tip
采用的 highlight.js 实现的代码高亮
:::

## 支持的代码类型

- bash
- c
- csharp
- cpp
- css
- go
- xml
- json
- java
- javascript
- less
- markdown
- php
- phpTemplate
- python
- pythonRepl
- rust
- scss
- sql
- shell
- typescript
- webAssembly
- yaml
- http
- nginx
- apache
- dockerfile

## 加入需要的代码高亮

找到脚本文件：`/src/modules/article_content/hljs.ts`

import 引入你需要的语音类型，然后在`languages`对象中加入引入的类型，重新打包主题即可使用。

**例：**

```typescript
import hljs from "highlight.js/lib/core";
import bash from "highlight.js/lib/languages/bash";
import { LanguageFn } from "highlight.js";

type Languages = {
  [key: string]: LanguageFn;
};
const languages: Languages = {
  bash,
};

//批量注册
Object.keys(languages).forEach((name) => {
  hljs.registerLanguage(name, languages[name]);
});

export default hljs;
```
