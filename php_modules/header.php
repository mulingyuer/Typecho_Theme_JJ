<header id="header" class="header">
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
            <input id="header-search-input" class="header-search-input" type="text" id="s" name="s" maxlength="40" placeholder="<?php _e('输入关键字搜索');?>" autocomplete="off">
            <label for="header-search-input" class="header-search-btn" tabindex="0">
              <i class="jj-icon jj-icon-sousuo"></i>
            </label>
            <div class="search-history">
              <div class="search-history-head">
                <span class="search-history-head-title">搜索历史</span>
                <span class="search-history-clear-btn">清空</span>
              </div>
              <div class="search-history-list">
              </div>
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
<div class="mobile-search">
  <div class="mobile-search-mask"></div>
  <div class="mobile-search-content">
    <div class="mobile-search-close">
      <i class="jj-icon jj-icon-guanbi mobile-search-close-icon"></i>
    </div>
    <div class="mobile-search-body"></div>
  </div>
</div>
<?php if (!$this->user->hasLogin()): ?>
<div class="login-dialog">
  <div class="login-dialog-content-wrap">
    <div class="login-dialog-mask"></div>
    <div class="login-dialog-content">
      <div class="login-dialog-close">
        <i class="jj-icon jj-icon-guanbi login-dialog-close-icon"></i>
      </div>
      <div class="login-dialog-head">
        <h2 class="login-dialog-title">登录</h2>
      </div>
      <div class="login-dialog-body">
        <div class="login-dialog-body-left">
          <div class="login-dialog-body-left-title">账号密码登录</div>
          <form class="login-dialog-form" action="<?php $this->options->loginAction()?>" method="post" name="login" rold="form">
            <input type="hidden" name="referer" value="<?php echo $this->request->getRequestUrl(); ?>" required>
            <div class="login-dialog-input-group username">
              <input type="text" name="name" placeholder="请输入账号" required pattern="\S+.*">
              <img class="panfish-img greeting" src="<?php $this->options->themeUrl('/static/images/login/greeting.png');?>">
            </div>
            <div class="login-dialog-input-group password">
              <input type="password" name="password" placeholder="请输入密码" autocomplete="off" required pattern="\S+.*">
              <img class="panfish-img blindfold" src="<?php $this->options->themeUrl('/static/images/login/blindfold.png');?>">
            </div>
            <div class="login-dialog-input-group remember">
              <label class="remember-label" for="remember">
                <input type="checkbox" name="remember" class="checkbox" value="1" id="remember">
                <span class="login-dialog-input-checkbox">
                  <i class="jj-icon jj-icon-check login-dialog-input-checkbox-icon"></i>
                </span>
                <span class="login-dialog-input-checkbox-text">记住账号</span>
              </label>
            </div>
            <div class="login-dialog-input-group submit">
              <button class="login-dialog-form-btn">登录</button>
            </div>
            <img class="panfish-img normal" src="<?php $this->options->themeUrl('/static/images/login/normal.png');?>">
          </form>
        </div>
        <div class="login-dialog-body-right">
          <div class="login-dialog-qrcode-title">扫码登录</div>
          <div class="login-dialog-qrcode">
            <img class="login-dialog-qrcode-img" src="<?php $this->options->themeUrl('/static/images/login/login_dialog_qrcode.png');?>" alt="扫码登录">
          </div>
          <div class="login-dialog-qrcode-tips">请使用手机扫码登录</div>
        </div>
      </div>
      <div class="login-dialog-footer">
        注册登录即表示同意<a class="login-dialog-link" href="javascript:;" title="用户协议">用户协议</a>和<a class="login-dialog-link" href="javascript:;" title="隐私政策">隐私政策</a>
      </div>
    </div>
  </div>
</div>
<?php endif;?>