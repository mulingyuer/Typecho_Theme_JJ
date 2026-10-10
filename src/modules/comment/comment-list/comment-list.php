<?php $this->comments()->to($comments);?>
<?php if ($comments->have()): ?>
  <div class="comment-list-wrapper">
    <h3 class="comments-list-title"><?php $this->commentsNum(_t('暂无评论'), _t('全部评论 1'), _t('全部评论 %d'));?></h3>
    <?php $this->need('/modules/comment/comment-list/list-template.php');?>
    <?php $comments->listComments();?>
  </div>
  <div class="comment-pagination">
    <?php // 评论固定 button 翻页（楼中楼嵌套结构不支持无限滚动，见 modules/pagination/README.md）；
    // pageNav 必须传评论 Widget，Archive 的 $countSql 未初始化会直接 pageNav 抛 Error?>
    <?php renderPagination($this, array('type' => 'button', 'prevText' => '&lt;', 'nextText' => '&gt;', 'hidden' => false, 'navWidget' => $comments));?>
  </div>
<?php else: ?>
  <div class="comment-list-empty">
    <img class="comment-list-empty-img" src="<?php $this->options->themeUrl('/images/comment/comment_list_empty.png');?>" alt="<?php echo _t('暂无评论数据'); ?>">
    <p class="comment-list-empty-text"><?php echo _t('暂无评论数据'); ?></p>
  </div>
<?php endif;?>