<?php //通用（分类、搜索、标签、作者）页面文件?>
<?php if ( ! defined('__TYPECHO_ROOT_DIR__')) {
    exit;
}
?>
<?php if ( ! isAjax()): ?>
<!DOCTYPE html>
<html lang="zh-CN">
  <?php $this->need('/modules/notes/notes.php');?>
<head>
  <?php $this->need('/modules/default-head/default-head.php');?>
  <!--VITE_HEAD_TAGS-->
  <?php //head标签底部插入代码 ?>
  <?php $this->options->headInsertCode();?>
</head>
<body>
  <?php $this->need('/modules/header/header.php');?>
  <?php $this->need('/modules/nav/nav.php');?>
  <main class="main" role="main">
    <div class="container">
      <div class="main-content archive-content">
        <div class="main-left">
          <?php $this->need('/modules/archive/tips.php');?>
<?php endif;?>
          <?php //是否有内容?>
          <?php if ($this->have()): ?>
            <?php $this->need('/modules/article-skeleton/article-skeleton.php');?>
            <?php $this->need('/modules/article-card/article-card.php');?>
          <?php else: ?>
            <?php $this->need('/modules/article-empty/article-empty.php');?>
          <?php endif;?>
          <?php $this->need('/modules/article-pagination/article-pagination.php');?>
<?php if ( ! isAjax()): ?>
        </div>
        <div class="main-right">
          <?php $this->need('/modules/home/recent-comments/recent-comments.php');?>
          <?php $this->need('/modules/home/theme-tool/theme-tool.php');?>
          <?php $this->need('/modules/footer/footer.php');?>
        </div>
      </div>
    </div>
  </main>
  <?php $this->need('/modules/fixed-tool/fixed-tool.php');?>
  <?php //body标签底部插入代码 ?>
  <?php $this->options->bodyInsertCode();?>
  <?php //typecho 插件挂接点 ?>
  <?php $this->footer();?>
</body>
</html>
<?php endif;?>