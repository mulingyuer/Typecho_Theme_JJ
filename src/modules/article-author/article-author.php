<div class="article-author immersion-hide">
  <div class="article-author-content" itemscope itemtype="http://schema.org/Person">
    <a class="article-author-head" href="<?php $this->author->permalink();?>" target="_self" rel="author">
      <div class="article-author-avatar">
        <?php $this->author->gravatar(80);?>
      </div>
      <div class="article-author-info">
        <div class="article-author-name" itemprop="name"><?php $this->author();?></div>
        <div class="article-author-group"><?php echo chineseUserGroup($this->author->uid); ?></div>
      </div>
    </a>
    <div class="article-author-body">
      <div class="article-author-item">
        <i class="jj-icon jj-icon-like-fill article-author-item-icon"></i>
        <span class="article-author-item-text">获得点赞 <?php echo numFormatSeparator(getLikeCount($this)); ?></span>
      </div>
      <div class="article-author-item">
        <i class="jj-icon jj-icon-eye-fill article-author-item-icon"></i>
        <span class="article-author-item-text">文章被阅读 <?php echo numFormatSeparator(articleViews($this)); ?></span>
      </div>
      <div class="article-author-item">
        <i class="jj-icon jj-icon-sync article-author-item-icon"></i>
        <span class="article-author-item-text">最后更新 <?php echo date('y-m-d G:i:s', $this->modified); ?></span>
      </div>
    </div>
  </div>
</div>