<?php $list = getHomeRecommendedArticleList();?>
<?php if (!empty($list)): ?>
  <div class="recommended-article">
    <div class="recommended-article-content">
      <?php foreach ($list as $item): ?>
        <a class="recommended-article-item-link" href="<?php echo $item['permalink']; ?>" itemprop="url" target="_blank" title="<?php echo $item['title']; ?>">
          <div class="recommended-article-item">
            <?php if (!empty($item['thumb'])): ?>
              <img class="recommended-article-item-img" src="<?php $this->options->themeUrl('/static/images/home_recommended_article_loading.gif');?>" data-src="<?php echo $item['thumb']; ?>" data-error="<?php $this->options->themeUrl('/static/images/loading_error.gif');?>" alt="<?php echo $item['title']; ?>">
            <?php else: ?>
              <img class="recommended-article-item-img" src="<?php $this->options->themeUrl('/static/images/home_recommended_article_loading.gif');?>" data-src="<?php $this->options->themeUrl('/static/images/home_recommended_article_empty.jpg');?>" alt="<?php echo $item['title']; ?>">
            <?php endif;?>
            <span class="recommended-article-item-tag">
              <?php $this->options->homeRecommendedArticleTag();?>
            </span>
          </div>
        </a>
      <?php endforeach;?>
    </div>
  </div>
<?php endif;?>