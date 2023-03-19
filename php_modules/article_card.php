<div class="article-card-wrap">
  <?php while ($this->next()): ?>
  <article class="article-card" data-link="<?php $this->permalink();?>" itemscope itemtype="http://schema.org/BlogPosting">
    <a class="article-card-hidden-a" href="<?php $this->permalink();?>" itemprop="url"><?php $this->title();?></a>
    <div class="article-card-head">
      <span class="article-card-user" itemprop="author">
        <span itemprop="name" rel="author"><?php $this->author();?></span>
      </span>
      <time class="article-card-time" datetime="<?php $this->date('c');?>" itemprop="datePublished"><?php articleTime($this->created);?></time>
      <span class="article-card-tag">
        <?php $this->category('<span class="article-card-tag-separator">·</span>');?>
      </span>
    </div>
    <div class="article-card-body">
      <div class="article-card-main">
        <h2 class="article-card-title" itemprop="name headline"><?php $this->title()?></h2>
        <p class="article-card-desc" itemprop="articleBody"><?php $this->excerpt(300);?></p>
        <div class="article-card-footer" itemprop="interactionCount">
          <span class="article-card-footer-item">
            <i class="jj-icon jj-icon-eye article-card-footer-item-icon"></i>
            <span><?php articleViews($this);?></span>
          </span>
          <span class="article-card-footer-item">
            <i class="jj-icon jj-icon-like article-card-footer-item-icon"></i>
            <span><?php echo articleLike($this->cid); ?></span>
          </span>
          <a class="article-card-footer-item" href="<?php $this->permalink()?>#comments" target="_self" title="文章评论">
            <i class="jj-icon jj-icon-message article-card-footer-item-icon"></i>
            <span><?php $this->commentsNum(_t('0'), _t('1'), _t('%d '));?></span>
          </a>
        </div>
      </div>
      <?php $thumbnail = articleThumbnail($this);?>
      <?php if ($thumbnail !== ""): ?>
      <div class="article-card-thumb">
        <img class="article-card-thumb-img" src="<?php echo $thumbnail; ?>" alt="<?php $this->title()?>">
      </div>
      <?php endif;?>
    </div>
  </article>
  <?php endwhile;?>
</div>
