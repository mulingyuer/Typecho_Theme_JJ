import{_ as a,c as s,a2 as t,o as l,ab as e,ac as n,ad as p,ae as h,af as r,ag as k,ah as d,ai as o,aj as c,ak as E,al as g}from"./chunks/framework.DhOcDEr8.js";const _=JSON.parse('{"title":"文章小技巧","description":"","frontmatter":{},"headers":[],"relativePath":"advanced-config/article-tips.md","filePath":"advanced-config/article-tips.md"}'),m={name:"advanced-config/article-tips.md"};function u(y,i,b,F,f,v){return l(),s("div",null,i[0]||(i[0]=[t('<h1 id="文章小技巧" tabindex="-1">文章小技巧 <a class="header-anchor" href="#文章小技巧" aria-label="Permalink to &quot;文章小技巧&quot;">​</a></h1><blockquote><p>一些提高使用舒适度的功能</p></blockquote><h2 id="文章首图" tabindex="-1">文章首图 <a class="header-anchor" href="#文章首图" aria-label="Permalink to &quot;文章首图&quot;">​</a></h2><p>掘金的文章页展示，在顶部会有一张首图用于引流之类的，我这边也把这个功能弄过来了，在编辑文章时在底部自定义字段中可以填入图片链接地址以实现这个效果。</p><p><img src="'+e+`" alt="" data-zoomable=""></p><p>首图除了在文章页展示，它还会用于文章缩略图展示，且优先级最高。</p><h2 id="自定义缩略图" tabindex="-1">自定义缩略图 <a class="header-anchor" href="#自定义缩略图" aria-label="Permalink to &quot;自定义缩略图&quot;">​</a></h2><p>这个优先级小于文章首图，配置也和首图一样，在文章底部自定义字段中。</p><p>但是缩略图只作用于文章列表，不影响文章内容。</p><h2 id="文章主题切换" tabindex="-1">文章主题切换 <a class="header-anchor" href="#文章主题切换" aria-label="Permalink to &quot;文章主题切换&quot;">​</a></h2><p>在编辑文章的时候，我们可以针对每一篇文章使用喜欢的主题！</p><p>在编辑文章的自定义字段区域，有一个主题选择，一共有 14 个主题：</p><ul><li>掘金</li><li>github</li><li>smartblue</li><li>cyanosis</li><li>channing-cyan</li><li>fancy</li><li>v-green</li><li>mk-cute</li><li>qklhk-chocolate</li><li>orange</li><li>scrolls-light</li><li>vuepress</li><li>nico</li><li>devui-blue</li></ul><p>默认为 <strong>掘金</strong> 主题</p><h2 id="todo-列表" tabindex="-1">todo 列表 <a class="header-anchor" href="#todo-列表" aria-label="Permalink to &quot;todo 列表&quot;">​</a></h2><p>用于处理一些已完成和未完成的事情</p><div class="language-markdown vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">markdown</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> [</span><span style="--shiki-light:#032F62;--shiki-dark:#DBEDFF;--shiki-light-text-decoration:underline;--shiki-dark-text-decoration:underline;">x</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">] 这是一个选中的 todo 图标</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> [ ] 这是一个未选中的 todo 图标</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">1.</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> [</span><span style="--shiki-light:#032F62;--shiki-dark:#DBEDFF;--shiki-light-text-decoration:underline;--shiki-dark-text-decoration:underline;">x</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">] 这是一个选中的 todo 图标</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">2.</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> [ ] 这是一个未选中的 todo 图标</span></span></code></pre></div><p>必须是在列表中，否则不会生效，注意<code>] </code>方括号后面是有一个空格的。</p><p><img src="`+n+`" alt="" data-zoomable=""></p><h2 id="回复可见" tabindex="-1">回复可见 <a class="header-anchor" href="#回复可见" aria-label="Permalink to &quot;回复可见&quot;">​</a></h2><p>用于一些内容，比如回复之后才能看到。</p><div class="language-markdown vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">markdown</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[</span><span style="--shiki-light:#032F62;--shiki-dark:#DBEDFF;--shiki-light-text-decoration:underline;--shiki-dark-text-decoration:underline;">hide</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">这里放要隐藏的内容</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[</span><span style="--shiki-light:#032F62;--shiki-dark:#DBEDFF;--shiki-light-text-decoration:underline;--shiki-dark-text-decoration:underline;">/hide</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">]</span></span></code></pre></div><p><img src="`+p+`" alt="" data-zoomable=""></p><h2 id="iframe-支持" tabindex="-1">iframe 支持 <a class="header-anchor" href="#iframe-支持" aria-label="Permalink to &quot;iframe 支持&quot;">​</a></h2><p>有时候我们希望页面内嵌一些外链，比如视频，代码 codePen 这些，这个功能在之前是没有的，为此在 2.0 加入了对它的样式支持。</p><p>如果你想保持一定的宽高比列，主题目前支持16:9的比例，适用于视频和代码分享，如果需要，请给iframe元素添加一个属性：</p><div class="language-html vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">html</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">iframe</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> data-type</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;video&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;  &lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">iframe</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">iframe</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> data-type</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;code&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;  &lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">iframe</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">iframe</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;  &lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">iframe</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span></code></pre></div><p>这两个自定义属性是必须的，如果你想保持这个比例的话，当然普通的iframe也是可以的，你可以自己配置行内样式实现自定义。</p><p><img src="`+h+'" alt="" data-zoomable=""></p><h2 id="目录树" tabindex="-1">目录树 <a class="header-anchor" href="#目录树" aria-label="Permalink to &quot;目录树&quot;">​</a></h2><p>v2.2.2 版本重构了目录树，实现了<strong>高保真掘金目录树</strong>，为此它的展示逻辑和掘金相同，最大嵌套层级是 3 层，但是这个 3 层不是说必须从 h2-h4，而是嵌套深度只有 3 层，你可以 h3-h5 这种形式。</p><p><img src="'+r+'" alt="" data-zoomable=""></p><h2 id="文章置顶" tabindex="-1">文章置顶 <a class="header-anchor" href="#文章置顶" aria-label="Permalink to &quot;文章置顶&quot;">​</a></h2><p><img src="'+k+'" alt="" data-zoomable=""></p><p>v2.3 版本新增了新增置顶功能，我们只需要在主题配置 -&gt; 置顶文章 cid 列表 -&gt; 填入需要置顶的文章 cid 即可。</p><p>支持多个置顶文章，多个文章用英文逗号隔开，例如：<code>2,3,4</code>。</p><p>文章 cid 就是发布文章后，链接上对应的 id 值，示例图：</p><p><img src="'+d+'" alt="" data-zoomable=""></p><p>这个 962 就是文章的 cid。</p><p>当我们配置了文章置顶后效果如下：</p><p><img src="'+o+'" alt="" data-zoomable=""></p><p>置顶的文章标题开头会有 <strong>置顶</strong> 的 tag 标签展示，当然这个标签也是可以自定义的，我们在主题配置 -&gt; 置顶文章标题前面加的 tag -&gt; 修改对应内容即可。</p><p>比如你可以通过 html 的行内样式来进行定制：</p><div class="language-html vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">html</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">span</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> style</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;background-color: red; color: #fff;&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;推荐&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">span</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span></code></pre></div><p>当然你也可以使用我预设的：</p><div class="language-html vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">html</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">span</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> class</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;article-card-sticky-tag&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;置顶&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">span</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span></code></pre></div><h2 id="首页右侧推荐文章" tabindex="-1">首页右侧推荐文章 <a class="header-anchor" href="#首页右侧推荐文章" aria-label="Permalink to &quot;首页右侧推荐文章&quot;">​</a></h2><p><img src="'+c+'" alt="" data-zoomable=""></p><p>v2.3 版本新增了首页右侧推荐文章功能，我们只需要在主题配置 -&gt; 首页右侧推荐文章 cid 列表 -&gt; 填入对应的文章 cid 即可。</p><p>最大只支持 3 篇，推荐的文章必须填写自定义字段：自定义缩略图；否则展示会有问题。</p><p>因为推荐的文章展示是以图片的形式展出。</p><p><img src="'+E+'" alt="" data-zoomable=""></p><p>配置完毕后效果如下：</p><p><img src="'+g+'" alt="" data-zoomable=""></p><p>这个就非常适合推荐一些精品文章，配合优质的广告图进行展示，也可以是软文之类的，如果你对右下角的文字不满意，也可以自己在 <strong>首页右侧推荐文章 tag 文字</strong> 进行修改。</p>',55)]))}const x=a(m,[["render",u]]);export{_ as __pageData,x as default};