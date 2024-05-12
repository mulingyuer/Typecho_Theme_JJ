<?php $isArticleInfinite = $this->options->paginationType === 'infinite';?>
<?php $ArticleTarget = "_self";if ($isArticleInfinite) {$ArticleTarget = "_blank";}?>
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
        <?php $categories = $this->categories;?>
        <?php if (!empty($categories)): ?>
          <?php foreach ($categories as $category): ?>
            <a class="article-card-category-link" target="<?php echo $ArticleTarget; ?>" href="<?php echo $category['permalink']; ?>" title="<?php echo $category['name']; ?>">
              <?php echo $category['name']; ?>
            </a>
          <?php endforeach;?>
        <?php else: ?>
          <span class="article-card-category-separator">·</span>
        <?php endif;?>
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
            <a class="article-card-footer-item comments" href="<?php $this->permalink()?>#comments" target="<?php echo $ArticleTarget; ?>" title="文章评论">
              <i class="jj-icon jj-icon-message article-card-footer-item-icon"></i>
              <span><?php echo numUnitConversion($this->commentsNum); ?></span>
            </a>
          </div>
          <?php $articleTags = array_slice($this->tags, 0, 3);?>
          <?php if (count($articleTags) > 0): ?>
          <div class="article-card-footer-right">
            <?php foreach ($articleTags as $tag): ?>
              <a class="article-card-tag" href="<?php echo $tag['url']; ?>" target="<?php echo $ArticleTarget; ?>" title="<?php echo $tag['name']; ?>"><?php echo $tag['name']; ?></a>
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
