<?php
/**
 * notification
 *
 * @package custom
 */
if ( ! defined('__TYPECHO_ROOT_DIR__')) {
    exit;
}
?>
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
  <main class="main no-nav" role="main">
    <div class="container">
      <div class="main-content notification-content">
        <div class="main-left">
          <?php $this->need('./php_modules/notification/list.php');?>
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
