<?php $paginationType = $this->options->paginationType;?>
<?php if ($paginationType === 'infinite'): ?>
  <div class="article-pagination hidden">
    <div class="article-pagination-content">
      <?php $this->pageLink('上一页', 'prev');?>
      <?php $this->pageLink('下一页', 'next');?>
      <img class="article-pagination-loading" src="<?php $this->options->themeUrl('/static/images/article-loading.gif');?>" alt="加载中">
      <span class="article-pagination-no-more">没有更多了</span>
    </div>
  </div>
<?php elseif ($paginationType === 'button'): ?>
  <?php
ob_start();
$this->pageNav('上一页', '下一页', 1, '...', array('wrapTag' => 'ul', 'wrapClass' => 'pagination-button hidden', 'itemTag' => 'li', 'textTag' => 'span', 'currentClass' => 'active', 'prevClass' => 'prev', 'nextClass' => 'next'));
$content = ob_get_contents();
ob_end_clean();

if (empty($content)) {
    echo '<div class="pagination-button-no-more hidden">没有更多了</div>';
} else {
    $content = preg_replace("/<li><span>(.*?)<\/span><\/li>/sm", '', $content);
    echo $content;
}

?>

<?php endif;?>