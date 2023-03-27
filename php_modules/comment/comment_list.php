<?php $this->comments()->to($comments);?>
<?php if ($comments->have()): ?>
  <div class="comment-list-wrapper">
    <h3 class="comments-list-title"><?php $this->commentsNum(_t('暂无评论'), _t('全部评论 1'), _t('全部评论 %d'));?></h3>
    <?php $this->need("/php_modules/comment/list-template.php");?>
    <?php $comments->listComments();?>
  </div>
  <div class="comment-pagination">
    <?php $comments->pageNav('&lt;', '&gt;');?>
  </div>
<?php endif;?>