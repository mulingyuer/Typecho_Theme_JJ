<article class="article-content" itemscope itemtype="http://schema.org/BlogPosting">
  <div class="article-content-card">
    <div class="article-content-card-head" itemprop="author" itemscope itemtype="http://schema.org/Person">
      <h1 class="article-content-title"><?php $this->title()?></h1>
      <div class="article-content-author">
        <a class="article-content-author-name"  href="<?php $this->author->permalink();?>" target="_self" itemprop="url" itemprop="name" rel="author"><?php $this->author();?></a>
        <time class="article-content-time" datetime="<?php $this->date('c');?>" itemprop="datePublished"><?php $this->date('Y-m-d H:i');?></time>
        <span class="article-content-views">
          <i class="jj-icon jj-icon-eye article-content-views-icon"></i><?php echo articleViews($this); ?>
        </span>
        <span class="article-content-reading-time">
        <i class="jj-icon jj-icon-time-circle article-content-reading-time-icon"></i><?php echo articleReadingTime($this->content); ?>
        </span>
        <?php if ($this->user->hasLogin()): ?>
        <a class="article-content-edit-btn" href="<?php $this->options->adminUrl();?>write-<?php if ($this->is('post')): ?>post<?php else: ?>page<?php endif;?>.php?cid=<?php echo $this->cid; ?>" target="_self">编辑</a>
        <?php endif;?>
      </div>
    </div>
    <div class="article-content-card-body">
      <?php $titleImg = getArticleTitleImg($this);?>
      <?php if ($titleImg): ?>
        <img class="article-content-title-img" src="<?php echo $titleImg; ?>" alt="<?php $this->title()?>">
      <?php endif;?>
      <div id="markdown" class="article-content-markdown markdown-body">
        <?php $this->need('./php_modules/markdown.php');?>
      </div>
    </div>
  </div>
</article>