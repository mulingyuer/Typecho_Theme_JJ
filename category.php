<?php if (!defined('__TYPECHO_ROOT_DIR__')) {
    exit;
}
?>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <?php $this->need("./php_modules/default_head.php");?>
  <?php $this->need("./dist/head/category.php");?>
</head>
<body>
  <?php $this->need("./php_modules/header.php");?>
  <?php $this->need("./php_modules/nav.php");?>
  <main class="main">
    <?php $this->need("./php_modules/secondary_nav.php");?>
    <div style="height:5000px;">
      <span class="jj-icon jj-icon-tongzhixiaoxi"></span>
    </div>
  </main>
</body>
</html>