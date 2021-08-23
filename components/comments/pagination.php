<?php //评论分页?>
<div id="comment-pagination">
  <?php $this->comments()->to($comments); ?>
  <?php
  ob_start(); 
  $comments->pageNav('&laquo;','&raquo;', 1, '', array('wrapTag' => 'ul', 'wrapClass' => '', 'itemTag' => '', 'textTag' => '', 'currentClass' => 'active', 'prevClass' => '', 'nextClass' => ''));
  $content = ob_get_contents();
  ob_end_clean();
  $content = preg_replace("%<ul>(.*?)<\/ul>%sm", '<div class="pagination-list">$1</div>', $content);
  echo $content;
?>
</div>