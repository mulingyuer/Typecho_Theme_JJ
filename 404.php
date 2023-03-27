<?php if (!defined('__TYPECHO_ROOT_DIR__')) {
    exit;
}
?>
<!DOCTYPE html>
<html lang="zh-CN">
  <?php $this->need("./php_modules/notes.php");?>
<head>
  <?php $this->need("./php_modules/default_head.php");?>
  <link href="<?php $this->options->themeUrl('/static/game/fonts.css');?>" rel="stylesheet" type="text/css">
  <link href="<?php $this->options->themeUrl('/static/game/game.css');?>" rel="stylesheet" type="text/css">
  <script src="<?php $this->options->themeUrl('/static/game/game.js');?>"></script>
  <?php $this->need("./dist/head/404.php");?>
</head>
<body>
  <?php $this->need("./php_modules/header.php");?>
  <?php $this->need("./php_modules/nav.php");?>
  <main class="main" role="main">
    <div class="container">
      <div class="error-content">
        <div class="error-card">
          <div class="error-card-head">
            <div class="error-card-logo-wrap">
              <img class="error-card-logo" src="<?php $this->options->themeUrl('/static/images/header/mobile-logo.png');?>" alt="<?php $this->options->title();?>">
            </div>
          </div>
          <div class="error-card-body">
            <div class="error-title">
              <strong>404.</strong>出现了一个错误。
            </div>
            <div class="error-desc">也许可以尝试一下其他方式（空格 || 触摸）</div>
          </div>
        </div>
      </div>
    </div>
  </main>
  <div id="t" class="offline">
    <?php $this->need("./php_modules/404/game.php");?>
  </div>
  <?php $this->need("./php_modules/fixed_tool.php");?>
  <?php //自定义脚本 ?>
  <?php $this->options->customScript();?>
</body>
</html>
