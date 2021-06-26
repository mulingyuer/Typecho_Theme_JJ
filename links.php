<?php
/**
 * links
 *
 * @package custom
 */
if (!defined('__TYPECHO_ROOT_DIR__')) exit; ?>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <?php if(!is_ajax()): ?>
    <?php $this->need("components/head.php");?>
    <link rel="stylesheet" href="<?php themeUrl('common/css/links/index.css'); ?>">
    <script src="<?php themeUrl('links/js/index.js'); ?>"></script>


  <?php endif; ?>
</head>
<body>
  <?php if(!is_ajax()): ?>
    <?php $this->need("components/header.php");?>
  <?php endif; ?>
  
  <main id="links-main">
    <div class="container">
      <div class="links-warp">
        <?php $this->need("links/components/content.php");?>
      </div>
    </div>
  </main>

  <?php //登录弹窗?>
  <?php if(!is_ajax()): ?>
    <?php $this->need("components/login-dialog.php");?>
  <?php endif; ?>
  <?php //浮动工具?>
  <?php if(!is_ajax()): ?>
    <?php $this->need("components/fixed-tool.php");?>
  <?php endif; ?>
</body>
</html>