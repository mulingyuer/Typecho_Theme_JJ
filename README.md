![ppK0vdO.jpg](https://s1.ax1x.com/2023/03/11/ppK0vdO.jpg)

## 说明

这是一个用于开发 Typecho 博客主题的的多页面打包项目，支持自动扫描 `src/pages/**/index.ts` 文件作为入口，不需要手动配置 entry 了，但是唯一的缺陷就是目前没办法在启动 watch 监听后再自动获取入口，所以，如果已经开启了 watch 模式，也就是 dev 命令，新增的入口，就得重新启动一次项目，以便重新获取入口。

打包出来的文件会以 pages 目录下的文件夹名称作为文件名，生成一个对应名字的 php 文件，这个文件存放着 css 和 js 引入，我们只需要在后续的 php 模板中引入该文件即可，php 文件存放在`dist/head/`下。

做这个的初衷也是为了追上现代化开发的步伐，主题的模板开发一直没有什么变化，一方面是是因为整体是 MVC 架构，html 文件只能通过模板的方式进行渲染，这就导致现在的单页面开发那一套不适用，但是我又希望能使用到现代化开发的各种功能，比如 ts、sass 这些东西，然后 js 文件的压缩混淆，于是产生了自己手搓一个工程管理的想法，于是就有了本项目。

目前补充了 php 示例文件，可以直接下载丢入 typecho 的主题目录体验，非常简单的 demo 示例

## 技术栈

- webpack5
- typescript
- sass
- postcss
- Babel
- ejs

开发所使用的 node 版本为：v18.15.0

pnpm 包管理器的版本：7.29.1

## 基本理念

主题是由不同的页面组成，每个页面对应着 src/pages 目录下的一个文件夹，文件夹的名称为页面的名称，比如首页可以命名为 home，home 目录下的 index.ts 文件为该页面的入口文件，这个页面需要使用到的 scss 样式文件，脚本文件，都在这个文件里面引入，具体的业务逻辑也可以写在该文件里面。

如果你有 spa 单页应用的开发经验应该是可以很快上手的。

由于存在资源的导入路径，为此我加入了路径别名，比如我在 home.ts 中引入与它同级的 styles.scss 样式文件，除了示例中的这种写法：

```typescript
import "./style.scss";
```

除了这种相对路径，还可以使用路径别名的方式引入：

```typescript
import "@/pages/home/style.scss";
```

`@`表示 src 目录，在 import 引入中都可以使用路径别名来简化引入的路径，减少心智负担。

## 启动命令

提供了三个命令：

1. `pnpm run dev` 用于开发模式，会 watch 监听文件变化自动打包处理
2. `pnpm run build` 用于构建正式版文件，开发完成使用该命令打包
3. `pnpm run analyze` 用于代码分析，分析打包后的文件占比以实现对应的优化处理

## 功能

### typescript 支持

支持 ts 文件编译，针对代码也做了 babel 兼容处理，但是默认是以 es6 为兼容标准打包的，如果你需要兼容旧版本浏览器，可以将 `.browserslistrc`文件中的代码改为：

```bash
last 1 version
>1%
ie>=11
```

这样就能兼容到 ie11 了，但是这样的话会导致 js 文件包体变大。

当然还可以自定义一些配置，比如兼容安卓什么版本，这个就自行研究吧。

### scss 预处理

支持 sass 作为 css 的预处理，并增加了全局文件，默认定死为：

- src\styles\color.scss
- src\styles\mixins.scss

一个是全局颜色变量文件，一个是全局混入文件，如果你有其他的需要增加的全局文件，可以打开：`webpack.common.ts`

找到 sass-loader 的配置项`additionalData`，按照相同的格式手动添加即可。

### postcss

postcss 目前只增加了自动增加浏览器前缀的处理，它也是根据`.browserslistrc`文件的兼容配置进行处理的，可以自行配置对应的兼容范围，以便加上对应的浏览器前缀。

如果有其他需要可以配置`postcss.config.js`文件。

## 公共引入

分多入口虽然可以将不同的页面的 js 文件完全分割开来，但是不是所有的东西都是独立的，比如可能会封装一些公共的类方法，比如针对 html 的 header 元素的类，或者一些样式字体文件，这些很多页面都会用到。

但是每个页面都需要引入一份太麻烦了，可以在`src/main.ts`这个文件中引入，这个文件所有的页面都会用到它。

这样就不用重复引入了。

## 更改打包后的引入文件地址

默认我是使用的字符串拼接的方式将`<?php echo $this->options->themeUrl; ?>`和打包后的文件路径进行拼接。

如果你需要更改这个配置，可以前往：`webpack\entryAndHtml.ts`目录下修改 createHtml 函数下的`publicPath`配置。

## 关于.map 文件

一般情况下，我们会在开发环境生成 map 文件，而在生产环境是不产生 map 文件的，也就是 build 后我们是不会有 map 文件的，这样有利于代码的保护。

但是如果你需要在生产环境生成 map 文件，可以修改`webpack\webpack.prod.ts`文件的`devtool`选项，将其注释放开，值改为：

```typescript
{
  devtool: "eval",
}
```

再打包即可。

## 优化处理：gzip 和 tree shaking

默认已经在`webpack\webpack.prod.ts`文件配置好了，不建议改动，其中 gzip 都有注释，有需要可以看下。

而 tree shaking 在官方的定义下，它需要满足三个条件才可以，所以不建议改动`webpack.prod.ts`文件，以免摇树失效。

非要改自己遵循 webpack 官方的规则即可。
