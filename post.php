<?php if (!defined('__TYPECHO_ROOT_DIR__')) {
    exit;
}
?>
<!DOCTYPE html>
<html lang="zh-CN">
  <?php $this->need("./php_modules/notes.php");?>
<head>
  <?php $this->need("./php_modules/default_head.php");?>
  <link href="<?php $this->options->themeUrl('/static/css/markdown/base.css');?>" rel="stylesheet">
  <link href="<?php $this->options->themeUrl('/static/css/markdown/' . getArticleTheme($this) . '.css');?>" rel="stylesheet">
  <?php $this->need("./dist/head/post.php");?>
</head>
<body>
  <?php $this->need("./php_modules/header.php");?>
  <main class="main no-nav" role="main">
    <div class="container">
      <div class="main-content post-content">
        <div class="main-left">
          <?php $this->need("./php_modules/article_content.php");?>
        </div>
        <div class="main-right">

        </div>
      </div>
    </div>
  </main>
  <?php $this->need("./php_modules/fixed_tool.php");?>
  <?php //自定义脚本 ?>
  <?php $this->options->customScript();?>
</body>
</html>
