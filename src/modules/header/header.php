<header id="header" class="header">
  <div class="header-container">
    <div class="header-content">
      <div class="header-left">
        <a class="header-logo" href="<?php $this->options->siteUrl();?>" target="_self">
          <img class="header-logo-pc" src="<?php $this->options->themeUrl('/images/header/pc-logo.png');?>" alt="<?php $this->options->siteUrl();?>">
          <img class="header-logo-mobile" src="<?php $this->options->themeUrl('/images/header/mobile-logo.png');?>" alt="<?php $this->options->siteUrl();?>">
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
          <button type="button" class="header-search-icon" title="搜索" aria-label="搜索">
            <i class="jj-icon jj-icon-sousuo"></i>
          </button>
        </div>
        <div class="header-search-wrap">
          <form class="header-search-form" method="post" action="<?php $this->options->siteUrl();?>" role="search">
            <input id="header-search-input" class="header-search-input" type="text" name="s" maxlength="40" placeholder="<?php _e('输入关键字搜索');?>" autocomplete="off" role="combobox" aria-autocomplete="list" aria-controls="header-search-history" aria-expanded="false">
            <button type="submit" class="header-search-btn" aria-label="搜索">
              <i class="jj-icon jj-icon-sousuo"></i>
            </button>
            <div class="search-history">
              <div class="search-history-head">
                <span class="search-history-head-title">搜索历史</span>
                <button type="button" class="search-history-clear-btn">清空</button>
              </div>
              <ul id="header-search-history" class="search-history-list" role="listbox" aria-label="搜索历史">
              </ul>
            </div>
          </form>
          <?php if ($this->user->hasLogin()): ?>
          <a class="header-article-btn" href="<?php echo getAdminUrl('write-post'); ?>" target="_self" title="写文章">写文章</a>
          <?php else: ?>
          <a class="header-article-btn login" href="javascript:;" target="_self" title="写文章">写文章</a>
          <?php endif;?>
        </div>
        <?php if ($this->user->hasLogin()): ?>
        <?php $commentsLink = getHidePage($pages, 'notification');?>
        <a class="header-comment" href="<?php echo $commentsLink['href']; ?>" target="_self" title="评论列表">
          <i class="jj-icon jj-icon-tongzhixiaoxi header-comment-icon"></i>
        </a>
        <?php endif;?>
        <?php if (!$this->user->hasLogin()): ?>
          <button class="header-login-btn">登录</button>
        <?php else: ?>
        <div class="header-menu-wrap">
          <div class="header-avatar">
            <?php $this->author->gravatar(80);?>
          </div>
          <div class="header-menu-body">
            <div class="header-menu-head">
              <div class="header-menu-avatar">
                <a href="http://cn.gravatar.org/" target="_blank" title="修改头像">
                  <?php $this->author->gravatar(100);?>
                </a>
              </div>
              <div class="header-menu-username"><?php $this->author();?></div>
            </div>
            <?php Typecho_Widget::widget('Widget_Stat')->to($stat);?>
            <div class="header-menu-count">
              <div class="header-menu-count-item">
                <div class="header-menu-count-item-num"><?php $stat->publishedPostsNum();?></div>
                <div class="header-menu-count-item-title">文章总数</div>
              </div>
              <div class="header-menu-count-item">
                <div class="header-menu-count-item-num"><?php $stat->publishedCommentsNum();?></div>
                <div class="header-menu-count-item-title">总评论数</div>
              </div>
              <div class="header-menu-count-item">
                <div class="header-menu-count-item-num"><?php $stat->categoriesNum();?></div>
                <div class="header-menu-count-item-title">分类数量</div>
              </div>
            </div>
            <div class="header-menu-list">
              <a class="header-menu-list-item" href="<?php echo getAdminUrl('write-page'); ?>" target="_self" title="新建分页">
                <i class="jj-icon jj-icon-file header-menu-list-item-icon"></i>
                <span class="header-menu-list-item-text">新建分页</span>
              </a>
              <a class="header-menu-list-item" href="<?php echo getAdminUrl('manage-pages'); ?>" target="_self" title="新建分页">
                <i class="jj-icon jj-icon-snippets header-menu-list-item-icon"></i>
                <span class="header-menu-list-item-text">分页管理</span>
              </a>
              <a class="header-menu-list-item" href="<?php echo getAdminUrl('category'); ?>" target="_self" title="分类管理">
                <i class="jj-icon jj-icon-control header-menu-list-item-icon"></i>
                <span class="header-menu-list-item-text">新建分类</span>
              </a>
              <a class="header-menu-list-item" href="<?php echo getAdminUrl('manage-categories'); ?>" target="_self" title="分类管理">
                <i class="jj-icon jj-icon-appstore header-menu-list-item-icon"></i>
                <span class="header-menu-list-item-text">分类管理</span>
              </a>
              <a class="header-menu-list-item" href="<?php echo getAdminUrl('manage-posts'); ?>" target="_self" title="文章管理">
                <i class="jj-icon jj-icon-file-text header-menu-list-item-icon"></i>
                <span class="header-menu-list-item-text">文章管理</span>
              </a>
              <a class="header-menu-list-item" href="<?php echo getAdminUrl('manage-comments'); ?>" target="_self" title="评论管理">
                <i class="jj-icon jj-icon-comment header-menu-list-item-icon"></i>
                <span class="header-menu-list-item-text">评论管理</span>
              </a>
              <a class="header-menu-list-item" href="<?php $this->options->profileUrl();?>" target="_self" title="我的主页">
                <i class="jj-icon jj-icon-user header-menu-list-item-icon"></i>
                <span class="header-menu-list-item-text">我的主页</span>
              </a>
              <a class="header-menu-list-item" href="<?php echo getAdminUrl(); ?>" target="_self" title="进入后台">
                <i class="jj-icon jj-icon-dashboard header-menu-list-item-icon"></i>
                <span class="header-menu-list-item-text">进入后台</span>
              </a>
            </div>
            <div class="header-menu-footer">
              <a class="header-menu-footer-btn" href="<?php echo getAdminUrl('options-theme'); ?>" target="_self" title="主题设置">主题设置</a>
              <a class="header-menu-footer-btn" href="<?php $this->options->logoutUrl();?>" target="_self" title="退出登录">退出登录</a>
            </div>
          </div>
        </div>
        <?php endif;?>
      </div>
    </div>
  </div>
</header>
<?php if (!$this->user->hasLogin()): ?>
<?php
// 登录配置是 PHP 与 Vue 的唯一数据契约；HEX 转义防止 URL 特殊字符破坏脚本内容。
$loginConfig = json_encode(
    [
        'action' => $this->options->loginAction,
        'referer' => $this->request->getRequestUrl(),
    ],
    JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT
);
?>
<script id="header-login-config" type="application/json"><?php echo $loginConfig; ?></script>
<?php endif;?>