<div class="article-card-wrap hidden">
  <?php while ($this->next()): ?>
  <article class="article-card" data-link="<?php $this->permalink();?>" itemscope itemtype="http://schema.org/BlogPosting">
    <a class="article-card-hidden-a" href="<?php $this->permalink();?>" itemprop="url"><?php $this->title();?></a>
    <div class="article-card-head">
      <span class="article-card-user" itemprop="author">
        <span itemprop="name" rel="author"><?php $this->author();?></span>
      </span>
      <time class="article-card-time" datetime="<?php $this->date('c');?>" itemprop="datePublished"><?php timeFormatting($this->created);?></time>
      <span class="article-card-category">
        <?php $this->category('<span class="article-card-category-separator">·</span>');?>
      </span>
    </div>
    <div class="article-card-body">
      <div class="article-card-main">
        <h2 class="article-card-title" itemprop="name headline"><?php $this->sticky();?><?php $this->title();?></h2>
        <p class="article-card-desc" itemprop="articleBody"><?php $this->excerpt(300);?></p>
        <div class="article-card-footer" >
          <div class="article-card-footer-left" itemprop="interactionCount">
            <span class="article-card-footer-item">
              <i class="jj-icon jj-icon-eye article-card-footer-item-icon"></i>
              <span><?php echo numUnitConversion(articleViews($this)); ?></span>
            </span>
            <span class="article-card-footer-item">
              <i class="jj-icon jj-icon-like article-card-footer-item-icon"></i>
              <span><?php echo numUnitConversion(getLikeCount($this)); ?></span>
            </span>
            <a class="article-card-footer-item comments" href="<?php $this->permalink()?>#comments" target="_self" title="文章评论">
              <i class="jj-icon jj-icon-message article-card-footer-item-icon"></i>
              <span><?php echo numUnitConversion($this->commentsNum); ?></span>
            </a>
          </div>
          <?php $articleTags = array_slice($this->tags, 0, 3);?>
          <?php if (count($articleTags) > 0): ?>
          <div class="article-card-footer-right">
            <?php foreach ($articleTags as $tag): ?>
              <a class="article-card-tag" href="<?php echo $tag['url']; ?>"><?php echo $tag['name']; ?></a>
            <?php endforeach;?>
          </div>
          <?php endif;?>
        </div>
      </div>
      <?php $thumbnail = articleThumbnail($this);?>
      <?php if ($thumbnail !== ''): ?>
      <div class="article-card-thumb">
        <img class="article-card-thumb-img" src="<?php $this->options->themeUrl('/static/images/loading.gif');?>" data-src="<?php echo $thumbnail; ?>" data-error="<?php $this->options->themeUrl('/static/images/loading_error.gif');?>" alt="<?php $this->title()?>">
      </div>
      <?php endif;?>
    </div>
  </article>
  <?php endwhile;?>
</div>
