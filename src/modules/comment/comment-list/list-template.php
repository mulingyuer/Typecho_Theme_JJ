<?php //回复列表模板?>
<?php function threadedComments($comments, $options)
{
    $commentClass = '';
    if ($comments->authorId) {
        if ($comments->authorId == $comments->ownerId) {
            $commentClass .= ' comment-by-author'; //如果是文章作者的评论添加 .comment-by-author 样式
        } else {
            $commentClass .= ' comment-by-user'; //如果是评论作者的添加 .comment-by-user 样式
        }
    }
    $commentLevelClass = $comments->levels > 0 ? 'comment-child' : 'comment-parent'; //评论层数大于0为子级，否则是父级
    ?>

  <?php //具体模板代码?>
  <li id="li-<?php $comments->theId();?>" class="comment-list-item <?php echo $commentLevelClass; ?>">
    <div id="<?php $comments->theId();?>" class="comment-list-media-wrapper">
      <div class="comment-list-media">
        <div class="comment-list-media-avatar">
          <?php $comments->gravatar('40', '');?>
        </div>
        <div class="comment-list-media-content">
          <div class="comment-list-media-head">
            <div class="comment-list-media-head-left">
              <h5 class="comment-list-item-author"><?php $comments->author();?></h5>
              <span class="comment-list-item-browser"><?php getBrowser($comments->agent);?></span>
              <span class="comment-list-item-system"><?php getOs($comments->agent);?></span>
            </div>
            <div class="comment-list-media-head-right">
              <time class="comment-list-item-time" datetime="<?php $comments->date('c');?>" itemprop="datePublished">
                <?php timeFormatting($comments->created);?>
              </time>
            </div>
          </div>
          <div class="comment-list-media-body">
            <div class="comment-list-item-comment">
              <?php get_comment_at($comments->coid);?><?php echo remove_comment_p($comments->content); ?>
              <?php if ('waiting' == $comments->status): ?>
                <div class="comment-list-item-check">╮(╯▽╰)╭ <?php $options->commentStatus();?></div>
              <?php endif;?>
            </div>
            <div class="comment-list-item-outer">
              <div class="comment-list-item-reply"><?php $comments->reply('<i class="jj-icon jj-icon-message comment-list-item-reply-icon"></i>回复');?></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </li>
  <?php if ($comments->children): ?>
    <div class="comment-children">
      <?php $comments->threadedComments($options);?>
    </div>
  <?php endif;?>


<?php }?>