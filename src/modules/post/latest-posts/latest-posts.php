<div class="latest-posts immersion-hide" role="complementary">
  <div class="latest-posts-content">
    <div class="latest-posts-head">
      <h3 class="latest-posts-title">最新文章</h3>
    </div>
    <div class="latest-posts-body">
      <?php $this->widget('Widget_Contents_Post_Recent', 'pageSize=5')->to($posts);?>
      <?php if ($posts->have()): ?>
        <?php while ($posts->next()): ?>
          <a class="latest-posts-item" href="<?php $posts->permalink();?>" target="_self" title="<?php $posts->title();?>">
          <div class="latest-posts-item-title"><?php $posts->title();?></div>
          <div class="latest-posts-item-other">
            <span class="latest-posts-item-other-item"><?php echo getLikeCount($posts); ?>点赞</span>
            <span> · </span>
            <span class="latest-posts-item-other-item"><?php $posts->commentsNum(_t('0'), _t('1'), _t('%d'));?>评论</span>
          </div>
          <span> </span>
          </a>
        <?php endwhile;?>
      <?php else: ?>
        <div class="latest-posts-empty">暂无文章</div>
      <?php endif;?>
    </div>
  </div>
</div>