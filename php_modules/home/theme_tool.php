<div class="theme-tool">
  <div class="theme-tool-content">
    <?php if ($this->user->hasLogin()): ?>
    <a class="theme-tool-item" href="https://mulingyuer.github.io/Typecho_Theme_JJ/" target="_blank" title="FAQ主题使用指南">
      <div class="theme-tool-item-img-wrap">
        <img class="theme-tool-item-img" src="<?php $this->options->themeUrl('/static/images/theme-tool/faq.png');?>" alt="FAQ主题使用指南">
      </div>
      <h3 class="theme-tool-item-title">FAQ主题使用指南</h3>
    </a>
    <?php endif;?>
    <a class="theme-tool-item" href="<?php $this->options->feedUrl();?>" target="_blank" title="博客文章RSS订阅">
      <div class="theme-tool-item-img-wrap">
        <img class="theme-tool-item-img" src="<?php $this->options->themeUrl('/static/images/theme-tool/rss_article.png');?>" alt="博客文章RSS订阅">
      </div>
      <h3 class="theme-tool-item-title">博客文章RSS订阅</h3>
    </a>
    <a class="theme-tool-item" href="<?php $this->options->commentsFeedUrl();?>" target="_blank" title="博客评论RSS订阅">
      <div class="theme-tool-item-img-wrap">
        <img class="theme-tool-item-img" src="<?php $this->options->themeUrl('/static/images/theme-tool/rss_comments.png');?>" alt="博客评论RSS订阅">
      </div>
      <h3 class="theme-tool-item-title">博客评论RSS订阅</h3>
    </a>
  </div>
</div>