<?php
/**
 * notification
 *
 * @package custom
 */
if (!defined('__TYPECHO_ROOT_DIR__')) {
    exit;
}
?>
<!DOCTYPE html>
<html lang="zh-CN">
  <?php $this->need("./php_modules/notes.php");?>
<head>
  <?php $this->need("./php_modules/default_head.php");?>
  <?php $this->need("./dist/head/notification.php");?>
</head>
<body>
  <?php $this->need("./php_modules/header.php");?>
  <main class="main no-nav" role="main">
    <div class="container">
      <div class="main-content notification-content">
        <div class="main-left">
          <?php $this->need("./php_modules/notification/list.php");?>
        </div>
      </div>
    </div>
  </main>
  <?php $this->need("./php_modules/fixed_tool.php");?>
  <?php //自定义脚本 ?>
  <?php $this->options->customScript();?>
</body>
</html>
