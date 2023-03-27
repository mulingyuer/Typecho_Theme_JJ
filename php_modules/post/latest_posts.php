<div class="latest-posts immersion-hide" role="complementary">
  <div class="latest-posts-content">
    <div class="latest-posts-head">
      <h3 class="latest-posts-title">最新文章</h3>
    </div>
    <div class="latest-posts-body">
      <?php \Widget\Contents\Post\Recent::alloc()->to($posts);?>
      <?php if ($posts->have()): ?>
        <?php while ($posts->next()): ?>
          <a class="latest-posts-item" href="<?php $posts->permalink();?>" target="_self" title="<?php $posts->title();?>">
          <span class="latest-posts-item-icon1">✧</span>
          <span class="latest-posts-item-icon2">✦</span>
          <span class="latest-posts-item-title"><?php $posts->title();?></span>
          </a>
        <?php endwhile;?>
      <?php else: ?>
        <div class="latest-posts-empty">暂无文章</div>
      <?php endif;?>
    </div>
  </div>
</div>