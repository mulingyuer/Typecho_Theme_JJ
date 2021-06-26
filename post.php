<?php if (!defined('__TYPECHO_ROOT_DIR__')) exit; ?>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <?php if(!is_ajax()): ?>
    <?php $this->need("components/head.php");?>
    <link rel="stylesheet" href="<?php themeUrl('common/css/post/index.css'); ?>">
    <script src="<?php themeUrl('post/js/index.js'); ?>"></script>


  <?php endif; ?>
</head>
<body>
  <?php if(!is_ajax()): ?>
    <?php $this->need("components/header.php");?>
  <?php endif; ?>
  
  <main id="post-main">
    <div class="container">
      <div class="post-warp">
        <?php $this->need("post/components/article-tool.php");?>
        <?php $this->need("post/components/left.php");?>
        <?php $this->need("post/components/right.php");?>
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