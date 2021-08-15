<?php if (!defined('__TYPECHO_ROOT_DIR__')) exit; ?>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <?php if(!is_ajax()): ?>
    <?php $this->need("components/default/head.php");?>
    <?php //样式?>
    <?php $this->need("dist/css/post.php");?>
    
  <?php endif; ?>
</head>
<body>
  <?php if(!is_ajax()): ?>
    <?php $this->need("components/default/header.php");?>
    <?php //$this->need("components/default/nav.php");?>
  <?php endif; ?>
   
  <main id="main">
    <div class="container">
      <div class="post-content">
        <?php $this->need("components/post/article-tool.php");?>
        <?php $this->need("components/post/left.php");?>
        <?php $this->need("components/post/right.php");?>
      </div>
    </div>
  </main>
  

  <?php //登录弹窗?>
  <?php $this->need("components/default/login-dialog.php");?>
  <?php //悬浮工具?>
  <?php $this->need("components/default/fixed-tool.php");?>
  <?php //脚本?>
  <?php $this->need("dist/script/post.php");?>
</body>
</html>