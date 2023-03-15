<header id="header">
  <div class="header-container">
    <div class="header-content">
      <div class="header-left">
        <a class="header-logo" href="<?php $this->options->siteUrl();?>" target="_self">
          <img class="header-logo-pc" src="<?php $this->options->themeUrl('/static/images/header/pc-logo.png');?>" alt="<?php $this->options->siteUrl();?>">
          <img class="header-logo-mobile" src="<?php $this->options->themeUrl('/static/images/header/mobile-logo.png');?>" alt="<?php $this->options->siteUrl();?>">
        </a>
        <nav class="header-nav">
          <div class="header-nav-mobile-menu-wrap">
            <div class="header-nav-mobile-menu">
              首页
              <i class="jj-icon jj-icon-down header-nav-mobile-menu-icon"></i>
            </div>
          </div>
          <ul class="header-nav-list">
            <li>
              <a class="header-nav-list-item <?php if ($this->is('index')) {echo 'active';}
;?>"  target="_self" href="<?php $this->options->siteUrl();?>" title="首页">首页</a>
            </li>
            <?php $this->widget('Widget_Contents_Page_List')->to($pages);?>
            <?php while ($pages->next()): ?>
            <li>
              <a class="header-nav-list-item <?php if ($this->is('page', $pages->slug)) {echo 'active';}
;?>" target="_self" href="<?php $pages->permalink();?>" title="<?php $pages->title();?>"><?php $pages->title();?></a>
            </li>
            <?php endwhile;?>
          </ul>
        </nav>
      </div>
      <div class="header-right">
        <div class="header-search-icon-wrap">
          <div class="header-search-icon" title="搜索">
            <i class="jj-icon jj-icon-sousuo"></i>
          </div>
        </div>
        <div class="header-search-wrap">
          <form class="header-search-form" method="post" action="<?php $this->options->siteUrl();?>" role="search">
            <input class="header-search-input" type="text" id="s" name="s" placeholder="<?php _e('输入关键字搜索');?>" autocomplete="off">
            <div class="header-search-btn">
              <i class="jj-icon jj-icon-sousuo" tabindex="0"></i>
            </div>
            <div class="header-search-history">
              <div class="header-search-history-head">
                <span class="header-search-history-head-title">搜索历史</span>
                <span class="header-search-history-clear-btn">清空</span>
              </div>
              <div class="header-search-history-list">
                <div class="header-search-history-list-item">asad</div>
                <div class="header-search-history-list-item">sadasda</div>
                <div class="header-search-history-list-item">sadasda</div>
                <div class="header-search-history-list-item">sadasda</div>
                <div class="header-search-history-list-item">sadasda</div>
                <div class="header-search-history-list-item">sadasda</div>
              </div>
            </div>
          </form>
          <?php if ($this->user->hasLogin()): ?>
          <a class="header-article-btn" href="<?php $this->options->siteUrl();?>admin/write-post.php" target="_self" title="写文章">写文章</a>
          <?php else: ?>
          <a class="header-article-btn login" href="javascript:;" target="_self" title="写文章">写文章</a>
          <?php endif;?>
        </div>
        <a class="header-comment" href="" target="_self" title="评论列表">
          <i class="jj-icon jj-icon-tongzhixiaoxi header-comment-icon"></i>
        </a>
        <div class="header-menu-wrap">
          <div class="header-avatar">
            <?php $this->author->gravatar(80);?>
          </div>
        </div>
      </div>
    </div>
  </div>
</header>