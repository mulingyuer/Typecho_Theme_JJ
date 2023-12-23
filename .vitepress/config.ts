import { defineConfig } from "vitepress";
import mdItCustomAttrs from "markdown-it-custom-attrs";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "JJ 主题使用文档",
  description: "Typecho_Theme_JJ 使用文档",
  srcDir: "src",
  base: "/Typecho_Theme_JJ/",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "首页", link: "/" },
      { text: "文档", link: "/start/introduce-theme" },
    ],
    sidebar: [
      {
        text: "开始",
        items: [
          {
            text: "主题介绍",
            link: "/start/introduce-theme",
          },
          {
            text: "主题安装",
            link: "/start/install-theme",
          },
        ],
      },
      {
        text: "基础配置",
        items: [
          {
            text: "最近评论页",
            link: "/basic-config/recent-comments",
          },
          {
            text: "友情链接页",
            link: "/basic-config/friends-links",
          },
          {
            text: "关于页",
            link: "/basic-config/about",
          },
          {
            text: "网站地图",
            link: "/basic-config/sitemap",
          },
          {
            text: "站点LOGO",
            link: "/basic-config/logo",
          },
          {
            text: "头像换源",
            link: "/basic-config/avatar",
          },
          {
            text: "资源更新",
            link: "/basic-config/update",
          },
          {
            text: "文章主题",
            link: "/basic-config/article-theme",
          },
        ],
      },
      {
        text: "高级配置",
        items: [
          {
            text: "备案信息",
            link: "/advanced-config/beian",
          },
          {
            text: "站点统计&自定义脚本",
            link: "/advanced-config/script",
          },
          {
            text: "文章小技巧",
            link: "/advanced-config/article-tips",
          },
          {
            text: "自定义分享图",
            link: "/advanced-config/share-img",
          },
          {
            text: "DocSearch",
            link: "/advanced-config/docsearch",
          },
          {
            text: "掘金编辑器",
            link: "/advanced-config/jj-editor",
          },
        ],
      },
      {
        text: "主题构建打包",
        items: [
          {
            text: "主题构建",
            link: "/build/build-theme",
          },
          {
            text: "代码高亮",
            link: "/build/code-highlight",
          },
        ],
      },
      // {
      //   text: "Examples",
      //   items: [
      //     { text: "Markdown Examples", link: "/markdown-examples" },
      //     { text: "Runtime API Examples", link: "/api-examples" },
      //   ],
      // },
    ],

    socialLinks: [{ icon: "github", link: "https://github.com/mulingyuer/Typecho_Theme_JJ" }],
  },
  markdown: {
    config(md) {
      md.use(mdItCustomAttrs, "image", {
        "data-fancybox": "gallery",
      });
    },
  },
  head: [
    ["link", { rel: "stylesheet", href: "https://cdn.jsdelivr.net/npm/@fancyapps/ui/dist/fancybox.css" }],
    ["script", { src: "https://cdn.jsdelivr.net/npm/@fancyapps/ui@4.0/dist/fancybox.umd.js" }],
  ],
});

