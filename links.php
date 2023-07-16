<?php
/**
 * links
 *
 * @package custom
 */
if ( ! defined('__TYPECHO_ROOT_DIR__')) {
    exit;
}
?>
<!DOCTYPE html>
<html lang="zh-CN">
  <?php $this->need('./php_modules/notes.php');?>
<head>
  <?php $this->need('./php_modules/default_head.php');?>
  <?php $this->need('./dist/head/links.php');?>
  <?php //head标签底部插入代码 ?>
  <?php $this->options->headInsertCode();?>
  <script>

  </script>
</head>
<body>
  <?php $this->need('./php_modules/header.php');?>
  <main class="main no-nav" role="main">
    <div class="container">
      <div class="main-content links-content">
        <div class="main-left">
          <?php $this->need('./php_modules/links/content.php');?>
          <?php $this->need('./php_modules/comment/comment.php');?>
        </div>
      </div>
    </div>
  </main>
  <?php $this->need('./php_modules/fixed_tool.php');?>
  <?php //body标签底部插入代码 ?>
  <?php $this->options->bodyInsertCode();?>
  <?php //typecho 插件挂接点 ?>
  <?php $this->footer();?>
</body>
</html>
