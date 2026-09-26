<?php //通用（分类、搜索、标签、作者）页面文件?>
<?php if ( ! defined('__TYPECHO_ROOT_DIR__')) {
    exit;
}
?>
<?php if ( ! isAjax()): ?>
<!DOCTYPE html>
<html lang="zh-CN">
  <?php $this->need('./php_modules/notes/notes.php');?>
<head>
  <?php $this->need('./php_modules/default-head/default-head.php');?>
  <!--VITE_HEAD_TAGS-->
  <?php //head标签底部插入代码 ?>
  <?php $this->options->headInsertCode();?>
</head>
<body>
  <?php $this->need('./php_modules/header/header.php');?>
  <?php $this->need('./php_modules/nav/nav.php');?>
  <main class="main" role="main">
    <div class="container">
      <div class="main-content archive-content">
        <div class="main-left">
          <?php $this->need('./php_modules/archive/tips.php');?>
<?php endif;?>
          <?php //是否有内容?>
          <?php if ($this->have()): ?>
            <?php $this->need('./php_modules/article-skeleton/article-skeleton.php');?>
            <?php $this->need('./php_modules/article-card/article-card.php');?>
          <?php else: ?>
            <?php $this->need('./php_modules/article-empty/article-empty.php');?>
          <?php endif;?>
          <?php $this->need('./php_modules/article-pagination/article-pagination.php');?>
<?php if ( ! isAjax()): ?>
        </div>
        <div class="main-right">
          <?php $this->need('./php_modules/home/recent-comments/recent-comments.php');?>
          <?php $this->need('./php_modules/home/theme-tool/theme-tool.php');?>
          <?php $this->need('./php_modules/footer/footer.php');?>
        </div>
      </div>
    </div>
  </main>
  <?php $this->need('./php_modules/fixed-tool/fixed-tool.php');?>
  <?php //body标签底部插入代码 ?>
  <?php $this->options->bodyInsertCode();?>
  <?php //typecho 插件挂接点 ?>
  <?php $this->footer();?>
</body>
</html>
<?php endif;?>