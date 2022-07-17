 <header id="header" class="header">
   <div class="header-top">
     <div class="header-container">
       <div class="header-left">
         <a class="header-logo" href="<?php $this->options->siteUrl(); ?>">
           <img class="header-pc-logo" src="<?php themeUrl('dist/images/header/pc-logo.png'); ?>" alt="<?php $this->options->title() ?>">
           <img class="header-mobile-logo" src="<?php themeUrl('dist/images/header/mobile-logo.png'); ?>" alt="<?php $this->options->title() ?>">
         </a>
         <nav class="header-nav">
           <div class="header-mobile-menu-wrap">
             <div class="header-mobile-menu">
               <span>首页</span>
               <svg class="header-mobile-arrow" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <path d="M2.45025 4.82431C2.17422 4.49957 2.40501 4.00049 2.83122 4.00049H9.16878C9.59498 4.00049 9.82578 4.49957 9.54975 4.82431L6.38097 8.55229C6.1813 8.78719 5.8187 8.78719 5.61903 8.55229L2.45025 4.82431Z"></path>
               </svg>
             </div>
           </div>
           <ul class="header-mobile-nav">
             <li class="nav-item<?php if ($this->is('index')) : ?> active<?php endif; ?>">
               <a href="<?php $this->options->siteUrl(); ?>" title="首页">
                 <span>首页</span>
               </a>
             </li>
             <?php $this->widget('Widget_Contents_Page_List')->to($pages); ?>
             <?php while ($pages->next()) : ?>
               <li class="nav-item<?php if ($this->is('page', $pages->slug)) : ?> active<?php endif; ?>">
                 <a href="<?php $pages->permalink(); ?>" title="<?php $pages->title(); ?>">
                   <span><?php $pages->title(); ?></span>
                 </a>
               </li>
             <?php endwhile; ?>
           </ul>
         </nav>
       </div>
       <div class="header-right">
         <div class="header-search-wrap">
           <form class="header-search-form" method="post" action="<?php $this->options->siteUrl(); ?>" role="search">
             <div class="header-search-input-wrap">
               <input id="s" name="s" type="search" placeholder="请输入搜索关键词" autocomplete="off" />
               <div class="header-search-history">
                 <div class="header-search-history-head">
                   <span>搜索历史</span>
                   <button class="header-search-history-clear" type="button">清空</button>
                 </div>
                 <div class="header-search-history-body">
                   <div class="header-search-history-item" data-value="">xxx</div>
                   <div class="header-search-history-item" data-value="">xxx</div>
                   <div class="header-search-history-item" data-value="">xxx</div>
                   <div class="header-search-history-item" data-value="">xxx</div>
                   <div class="header-search-history-item" data-value="">xxx</div>
                   <div class="header-search-history-item" data-value="">xxx</div>
                 </div>
               </div>
             </div>
             <button type="submit">
               <i class="jj-icon jj-icon-sousuo"></i>
             </button>
           </form>
           <?php if ($this->user->hasLogin()) : ?>
             <button type="button" class="header-write-btn">
               <a href="<?php $this->options->siteUrl(); ?>admin/write-post.php" target="_parent">
                 写文章
               </a>
             </button>
           <?php else : ?>
             <button type="button" class="header-login-btn">
               <a href="<?php $this->options->adminUrl(); ?>" target="_parent">
                 登录
               </a>
             </button>
           <?php endif; ?>
         </div>
         <!-- <a class="header-notification" href="/">
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="notification-icon" data-v-46191c10="">
             <path d="M6.01132 10.2856C6.28115 6.54234 8.68619 4.28564 11.9999 4.28564C15.3136 4.28564 17.7186 6.54234 17.9885 10.2856C18.1219 12.1363 18.4093 13.708 19.9473 15.8848C20.1889 16.2267 19.953 16.7142 19.5343 16.7142H4.46546C4.04679 16.7142 3.81092 16.2267 4.05252 15.8848C5.59053 13.708 5.87793 12.1363 6.01132 10.2856Z" stroke-width="1.5" stroke-linecap="round" data-v-46191c10=""></path>
             <path d="M11.9573 3.21436V4.28578" stroke-width="3" stroke-linecap="round" data-v-46191c10=""></path>
             <path d="M9.57495 18.8569C9.92795 19.8557 10.8804 20.5712 12.0001 20.5712C13.1197 20.5712 14.0722 19.8557 14.4252 18.8569H9.57495Z" stroke-linecap="round" stroke-linejoin="round" data-v-46191c10=""></path>
           </svg>
         </a>
         <div class="header-theme-menu">
           <div class="theme-menu-toggle">
             <img src="https://p26-passport.byteacctimg.com/img/user-avatar/5732c0540ca2e0cc7ad344b12c431e2c~300x300.image" alt="mulingyuer">
           </div>
           <div class="theme-menu-dropdown-list-wrap">
             <ul class="theme-menu-dropdown-list">
               <li class="menu-item">
                 <a href="/">
                   <i class=""></i>
                   写文章
                 </a>
               </li>
               <li class="menu-item">
                 <a href="/">
                   <i class=""></i>
                   写文章
                 </a>
               </li>
               <hr class="menu-divider" />
               <li class="menu-item">
                 <a href="/">
                   <i class=""></i>
                   写文章
                 </a>
               </li>
               <li class="menu-item">
                 <a href="/">
                   <i class=""></i>
                   写文章
                 </a>
               </li>
             </ul>
           </div>
         </div> -->
       </div>
     </div>
   </div>
   <div class="header-bottom">
     <div class="header-container">
       xx
     </div>
   </div>
 </header>