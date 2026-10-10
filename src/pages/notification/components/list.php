<?php
// 分页查询当前页评论（页码由 request 的 ?page=N 解析）
// 挂到 $this 上：need() 引入的各文件运行在独立方法调用栈，
// 局部变量无法跨文件共享，挂到 Archive 对象供 pagination.php 读取
$this->pagedComments = getPagedComments($this->currentPage, NOTIFICATION_PAGE_SIZE, true);
$pagedComments = $this->pagedComments;
$commentList = $pagedComments['list'];
?>
<div class="notification-list">
  <?php renderSkeleton([
  	'selector' => 'list-skeleton',
  	'count'    => 3,
  	'item'     => ['type' => 'row', 'gap' => 24, 'children' => [
  		['type' => 'avatar', 'size' => 45],
  		['type' => 'column', 'gap' => 10, 'children' => [
  			['type' => 'line', 'width' => '10%'],
  			['type' => 'line', 'width' => '10%'],
  			['type' => 'line', 'width' => '100%'],
  		]],
  	]],
  ]);?>
  <div class="notification-list-content hidden">
    <?php if (!empty($commentList)): ?>
      <?php foreach ($commentList as $comment): ?>
        <?php $other = getIdPosts($comment['cid']);?>
        <div class="notification-list-item">
          <div class="notification-list-item-avatar">
            <img src="<?php echo \Typecho\Common::gravatarUrl($comment['mail'], 40); ?>" alt="<?php echo htmlspecialchars($comment['author']); ?>">
          </div>
          <div class="notification-list-item-content">
            <div class="notification-list-item-title"><strong><?php echo htmlspecialchars($comment['author']); ?></strong> 回复了你的 <a class="notification-list-item-link" href="<?php echo $other['permalink']; ?>" target="_blank" title="<?php echo $other['permalink']; ?>"><?php echo $other['title']; ?></a></div>
            <div class="notification-list-item-msg"><?php echo Typecho_Common::subStr(strip_tags($comment['text']), 0, 120, '...'); ?></div>
            <div class="notification-list-item-footer">
              <div class="notification-list-item-footer-left">
                <time class="notification-list-item-time" datetime="<?php echo date('c', $comment['created']); ?>" itemprop="datePublished">
                  <?php timeFormatting($comment['created']);?>
                </time>
              </div>
              <div class="notification-list-item-footer-right">
                <?php if ($this->user->pass('contributor', true)): ?>
                  <a class="notification-list-item-manage" href="<?php echo getAdminUrl('manage-comments'); ?>?cid=<?php echo intval($comment['cid']); ?>">
                  <i class="jj-icon jj-icon-setting notification-list-item-manage-icon"></i>
                  <span>管理</span>
                </a>
                <?php endif;?>
                <a class="notification-list-item-comment" href="<?php echo getCommentReplyUrl($other['permalink'], $other['path'], $comment['cid'], $comment['coid']); ?>" target="_self" title="回复">
                  <i class="jj-icon jj-icon-message notification-list-item-comment-icon"></i>
                  <span>回复</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      <?php endforeach;?>
    <?php else: ?>
      <div class="notification-list-empty">暂无消息</div>
    <?php endif;?>
  </div>
</div>