<?php //回复列表模板?>
<?php function threadedComments($comments, $options) {
  $commentClass = '';
  if ($comments->authorId) {
    if ($comments->authorId == $comments->ownerId) {
      $commentClass .= ' comment-by-author';  //如果是文章作者的评论添加 .comment-by-author 样式
    } else {
      $commentClass .= ' comment-by-user';  //如果是评论作者的添加 .comment-by-user 样式
    }
  }
  $commentLevelClass = $comments->levels > 0 ? 'comment-child' : 'comment-parent';  //评论层数大于0为子级，否则是父级
?>

  <?php //具体模板代码?>
  <li id="li-<?php $comments->theId(); ?>" class="comment-body <?php echo $commentLevelClass;?>">
    <div id="<?php $comments->theId(); ?>" class="media">
      <div class="media-img">
        <?php $comments->gravatar('40', ''); ?>
      </div>
      <div class="media-body">
        <div class="media-body-head">
          <h5 class="author-name"><?php $comments->author(); ?></h5>
          <span class="author-browser"><?php getBrowser($comments->agent); ?></span>
          <span class="author-system"><?php getOs($comments->agent); ?></span>
        </div>
        <div class="author-comment">
          <?php get_comment_at($comments->coid); ?><?php $comments->content(); ?>
          <?php if ('waiting' == $comments->status): ?>
            <div class="comment-check">╮(╯▽╰)╭ <?php $options->commentStatus(); ?></div>
          <?php endif;?>
        </div>
        <div class="comment-outher">
          <time class="left comment-time" datetime="<?php $comments->date('c'); ?>" itemprop="datePublished">
            <?php timesince($comments->created);?>
          </time>
          <div class="right">
            <span class="comment-reply"><?php $comments->reply('<i class="icon icon-message"></i>回复'); ?></span>
          </div>
        </div>
      </div>
    </div>
    <?php if($comments->children && $comments->levels > 0): ?>
    <div class="comment-dividing"></div>
    <?php endif;?>
  </li>
  <?php if ($comments->children): ?>
    <div class="comment-children">
      <?php $comments->threadedComments($options); ?>
    </div>
  <?php else: ?>
    <div class="comment-dividing"></div>
  <?php endif;?>

   
<?php } ?>