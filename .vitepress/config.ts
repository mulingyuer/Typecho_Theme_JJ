import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "JJ 主题使用文档",
  description: "Typecho_Theme_JJ 使用文档",
  srcDir: "docs",
  base: "/Typecho_Theme_JJ/",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "首页", link: "/" },
      { text: "文档", link: "/markdown-examples" },
    ],

    sidebar: [
      {
        text: "主题介绍",
        link: "/Introduce-theme",
      },
      {
        text: "Examples",
        items: [
          { text: "Markdown Examples", link: "/markdown-examples" },
          { text: "Runtime API Examples", link: "/api-examples" },
        ],
      },
    ],

    socialLinks: [{ icon: "github", link: "https://github.com/mulingyuer/Typecho_Theme_JJ" }],
  },
});

