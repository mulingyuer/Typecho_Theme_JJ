<?php if (!defined('__TYPECHO_ROOT_DIR__')) {
    exit;
}
?>
<?php if (!isAjax()): ?>
<!DOCTYPE html>
<html lang="zh-CN">
  <?php $this->need("./php_modules/notes.php");?>
<head>
  <?php $this->need("./php_modules/default_head.php");?>
  <?php $this->need("./dist/head/category.php");?>
</head>
<body>
  <?php $this->need("./php_modules/header.php");?>
  <?php $this->need("./php_modules/nav.php");?>
  <main class="main" role="main">
    <div class="container">
      <?php $this->need("./php_modules/secondary_nav.php");?>
      <div class="main-content category-content">
        <div class="main-left">
          <?php $this->need("./php_modules/category/tips.php");?>
<?php endif;?>
          <?php //是否有内容?>
          <?php if ($this->have()): ?>
            <?php $this->need("./php_modules/article_skeleton.php");?>
            <?php $this->need("./php_modules/article_card.php");?>
          <?php else: ?>
            <?php $this->need("./php_modules/article_empty.php");?>
          <?php endif;?>
          <?php $this->need("./php_modules/article_pagination.php");?>
<?php if (!isAjax()): ?>
        </div>
        <div class="main-right">
          <?php $this->need("./php_modules/home/recent_comments.php");?>
          <?php $this->need("./php_modules/home/theme_tool.php");?>
          <?php $this->need("./php_modules/footer.php");?>
        </div>
      </div>
    </div>
  </main>
  <?php $this->need("./php_modules/fixed_tool.php");?>
  <?php //自定义脚本 ?>
  <?php $this->options->customScript();?>
</body>
</html>
<?php endif;?>