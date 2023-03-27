<div class="notification-list">
  <?php $this->need("/php_modules/notification/list_skeleton.php");?>
  <div class="notification-list-content hidden">
    <?php $this->widget('Widget_Comments_Recent', 'pageSize=50&ignoreAuthor=true')->to($comments);?>
    <?php if ($comments->have()): ?>
      <?php while ($comments->next()): ?>
        <?php $other = getIdPosts($comments->cid);?>
        <div class="notification-list-item">
          <div class="notification-list-item-avatar">
            <?php $comments->gravatar(40);?>
          </div>
          <div class="notification-list-item-content">
            <div class="notification-list-item-title"><strong><?php $comments->author();?></strong> 回复了你的 <a class="notification-list-item-link" href="<?php echo $other['permalink']; ?>" target="_blank" title="<?php echo $other['permalink']; ?>"><?php echo $other['title']; ?></a></div>
            <div class="notification-list-item-msg"><?php $comments->excerpt(120);?></div>
            <div class="notification-list-item-footer">
              <div class="notification-list-item-footer-left">
                <time class="notification-list-item-time" datetime="<?php $comments->date('c');?>" itemprop="datePublished">
                  <?php timeFormatting($comments->created);?>
                </time>
              </div>
              <div class="notification-list-item-footer-right">
                <?php if ($this->user->hasLogin()): ?>
                  <a class="notification-list-item-manage" href="<?php $this->options->adminUrl();?>manage-comments.php?cid=<?php echo $comments->cid; ?>">
                  <i class="jj-icon jj-icon-setting notification-list-item-manage-icon"></i>
                  <span>管理</span>
                </a>
                <?php endif;?>
                <a class="notification-list-item-comment" href="<?php $comments->permalink();?>" target="_self" title="回复">
                  <i class="jj-icon jj-icon-message notification-list-item-comment-icon"></i>
                  <span>回复</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      <?php endwhile;?>
    <?php else: ?>
      <div class="notification-list-empty">暂无消息</div>
    <?php endif;?>
  </div>
</div>