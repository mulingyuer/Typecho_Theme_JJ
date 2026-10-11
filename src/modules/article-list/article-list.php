<?php // 文章列表区模块：骨架屏 + 文章卡片 + 分页 ?>
<?php //是否有内容?>
<?php if ($this->have()): ?>
  <?php renderSkeleton([
  	'selector' => 'article-skeleton',
  	'item'     => ['type' => 'column', 'gap' => 16, 'children' => [
  		['type' => 'line', 'width' => '40%'],
  		['type' => 'line'],
  		['type' => 'line', 'width' => '80%'],
  		['type' => 'line', 'width' => '60%'],
  	]],
  ]);?>
  <?php $this->need('/modules/article-card/article-card.php');?>
<?php else: ?>
  <?php $this->need('/modules/article-empty/article-empty.php');?>
<?php endif;?>
<?php // hidden 仅用于首屏配合骨架屏；ajax 翻页片段需保持可见，
// 否则 PaginationLoader 拷贝片段 className 后分页容器 display:none，无限滚动停更
renderPagination($this, [
	'type'   => $this->options->paginationType === 'button' ? 'button' : 'infinite',
	'hidden' => !isAjax(),
]);?>
