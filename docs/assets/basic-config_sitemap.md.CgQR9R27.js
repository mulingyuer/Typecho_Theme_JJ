import{_ as i,c as s,a2 as e,o as t,aE as p}from"./chunks/framework.DhOcDEr8.js";const g=JSON.parse('{"title":"网站地图","description":"","frontmatter":{},"headers":[],"relativePath":"basic-config/sitemap.md","filePath":"basic-config/sitemap.md"}'),n={name:"basic-config/sitemap.md"};function h(l,a,r,o,c,d){return t(),s("div",null,a[0]||(a[0]=[e(`<h1 id="网站地图" tabindex="-1">网站地图 <a class="header-anchor" href="#网站地图" aria-label="Permalink to &quot;网站地图&quot;">​</a></h1><p>这是一个用于给爬虫抓取网页信息的功能，通过插件实现！</p><h2 id="插件下载" tabindex="-1">插件下载 <a class="header-anchor" href="#插件下载" aria-label="Permalink to &quot;插件下载&quot;">​</a></h2><p>点击下载：<a href="/Typecho_Theme_JJ/zip/AutoSitemap.zip">AutoSitemap</a></p><h2 id="安装" tabindex="-1">安装 <a class="header-anchor" href="#安装" aria-label="Permalink to &quot;安装&quot;">​</a></h2><p>下载完丢入 Typecho 的 plugins 目录下，解压，然后去博客后台启用该插件。</p><p>开启 typecho 伪静态处理，以 Nginx 为例：</p><div class="language-nginx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">nginx</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">!-e </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">$request_filename) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  rewrite</span><span style="--shiki-light:#032F62;--shiki-dark:#DBEDFF;"> ^(.*)$</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> /index.php$1 </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">last</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>然后到 typecho 后台 --&gt; 设置 --&gt; 永久链接 --&gt; 启用地址重写 --&gt; 自定义文章路径选择默认 --&gt; 保存即可。</p><p><img src="`+p+'" alt="" data-zoomable=""></p>',10)]))}const m=i(n,[["render",h]]);export{g as __pageData,m as default};