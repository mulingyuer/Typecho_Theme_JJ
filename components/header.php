<header id="header" class="visible">
    <div class="container">
      <div class="header-content">
        <a class="logo" href="<?php $this->options->siteUrl(); ?>">
          <img class="pc-logo" src="<?php themeUrl('common/images/header/pc-logo.png'); ?>" alt="pc端logo">
          <img class="mobile-logo" src="<?php themeUrl('common/images/header/mobile-logo.png'); ?>" alt="移动端logo">
        </a>
        <nav id="header-nav">
          <ul class="nav-list">
            <li class="main-nav-list">
              <div class="mobile-show-menu">
                <span>首页</span>
                <i class="icon icon-caret-down"></i>
              </div>
              <ul class="mobile-hide">
                <li class="nav-item <?php if($this->is('index')){echo 'active';}; ?>">
                  <a href="<?php $this->options->siteUrl(); ?>">首页</a>
                </li>
                <?php $this->widget('Widget_Contents_Page_List')->to($pages); ?>
                <?php while ($pages->next()) : ?>
                  <li class="nav-item <?php if($this->is('page',$pages->slug)){echo 'active';}; ?>">
                    <a href="<?php $pages->permalink(); ?>"><?php $pages->title(); ?></a>
                  </li>
                <?php endwhile; ?>
              </ul>
            </li>
            <li class="nav-item search">
              <form class="search-form" method="post" action="<?php $this->options->siteUrl(); ?>" role="search">
                <input class="search-input" type="text" id="s" name="s" placeholder="<?php _e('输入关键字搜索'); ?>" autocomplete="off">
                <i class="icon icon-search search-btn" tabindex="0"></i>
                <div class="typehead">
                  <div class="title">
                    <span>搜索历史</span>
                    <span class="clear">清空</span>
                  </div>
                  <div class="list"></div>
                </div>
              </form>
            </li>
            <?php if(!$this->user->hasLogin()): ?> 
              <!-- 未登录 -->
              <li class="nav-item notification">
                <a href="<?php echo getHidePage($page,'notification');?>"><i class="icon icon-bell-fill"></i></a>
              </li>
              <li class="nav-item add login-add">
                <a class="add-btn" href="javascript:;">写文章</a>
              </li>
              <li class="nav-item login">
                <a class="login-btn" href="#">登录</a>
              </li>
            <?php else: ?>
              <!-- 已登录 -->
              <li class="nav-item add">
                <a class="add-btn" href="<?php $this->options->siteUrl(); ?>admin/write-post.php">写文章</a>
              </li>
              <li class="nav-item notification">
                <a href="<?php echo getHidePage($page,'notification');?>"><i class="icon icon-bell-fill"></i></a>
              </li>
              <li class="nav-item menu">
                <div class="avatar">
                  <?php $this->author->gravatar(80);?> 
                </div>
                <ul class="nav-menu">
                  <div class="nav-menu-item-group">
                    <li class="nav-menu-item">
                      <a href="<?php $this->options->siteUrl(); ?>admin/write-post.php"><i class="icon icon-edit-fill"></i>写文章</a>
                    </li>
                    <li class="nav-menu-item">
                      <a href="<?php $this->options->siteUrl(); ?>admin/manage-posts.php?status=draft"><i class="icon icon-file-text-fill"></i>草稿</a>
                    </li>
                    <li class="nav-menu-item">
                      <a href="<?php $this->options->siteUrl(); ?>admin/write-page.php"><i class="icon icon-file-fill"></i>新建分页</a>
                    </li>
                  </div>
                  <div class="nav-menu-item-group">
                    <li class="nav-menu-item">
                      <a href="<?php $this->options->profileUrl(); ?>"><i class="icon icon-LC_icon_user_fill_1"></i>我的主页</a>
                    </li>
                    <li class="nav-menu-item">
                      <a href="<?php $this->options->siteUrl(); ?>admin/manage-posts.php"><i class="icon icon-file-text-fill"></i>文章管理</a>
                    </li>
                    <li class="nav-menu-item">
                      <a href="<?php $this->options->siteUrl(); ?>admin/manage-comments.php"><i class="icon icon-message-fill"></i>评论管理</a>
                    </li>
                     <li class="nav-menu-item">
                      <a href="<?php $this->options->siteUrl(); ?>admin/manage-categories.php"><i class="icon icon-appstore-fill"></i>分类管理</a>
                    </li>
                  </div>
                  <div class="nav-menu-item-group">
                    <li class="nav-menu-item">
                      <a href="<?php $this->options->siteUrl(); ?>admin"><i class="icon icon-dashboard-fill"></i>控制台</a>
                    </li>
                    <li class="nav-menu-item">
                      <a href="<?php $this->options->siteUrl(); ?>admin/options-general.php"><i class="icon icon-setting-fill"></i>设置</a>
                    </li>
                    <li class="nav-menu-item">
                      <a href="#"><i class="icon icon-info-circle-fill"></i>关于</a>
                    </li>
                  </div>
                  <div class="nav-menu-item-group">
                    <li class="nav-menu-item">
                      <a href="<?php $this->options->logoutUrl(); ?>"><i class="icon icon-poweroff"></i>登出</a>
                    </li>
                  </div>
                </ul>
              </li>
            <?php endif; ?>
          </ul>
        </nav>
      </div>
    </div>
  </header>