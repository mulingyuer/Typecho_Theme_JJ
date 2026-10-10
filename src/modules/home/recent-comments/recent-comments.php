<div class="recent-comments">
  <div class="recent-comments-content">
    <div class="recent-comments-head">
      <i class="jj-icon jj-icon-comment recent-comments-head-icon"></i>
      <h3 class="recent-comments-title">最近评论</h3>
    </div>
    <div class="recent-comments-body">
      <?php renderSkeleton([
      	'selector' => 'recent-comments-skeleton',
      	'count'    => 3,
      	'item'     => ['type' => 'row', 'gap' => 10, 'children' => [
      		['type' => 'avatar', 'size' => 36],
      		['type' => 'column', 'gap' => 4, 'children' => [
      			['type' => 'line', 'width' => '40%'],
      			['type' => 'line'],
      		]],
      	]],
      ]);?>
      <div class="recent-comments-list hidden">
        <?php $this->widget('Widget_Comments_Recent', 'pageSize=6')->to($comments);?>
        <?php if (!$comments->have()): ?>
          <div class="recent-comments-list-placeholder">暂无评论</div>
        <?php else: ?>
          <?php while ($comments->next()): ?>
          <a class="recent-comments-list-item" href="<?php $comments->permalink();?>" target="_self" title="<?php $comments->author(false);?>">
            <div class="recent-comments-list-item-avatar">
              <?php $comments->gravatar(40);?>
            </div>
            <div class="recent-comments-list-item-content">
              <div class="recent-comments-list-item-title"><?php $comments->author(false);?></div>
              <div class="recent-comments-list-item-msg"><?php $comments->excerpt(120);?></div>
            </div>
          </a>
          <?php endwhile;?>
        <?php endif;?>
      </div>
    </div>
    <?php if ($this->user->hasLogin()): ?>
    <div class="recent-comments-footer">
      <a class="recent-comments-management-btn" href="<?php echo getAdminUrl('manage-comments'); ?>" target="_self">
        <span>管理评论</span>
        <i class="jj-icon jj-icon-right recent-comments-management-btn-icon"></i>
      </a>
    </div>
    <?php endif;?>
  </div>
</div>