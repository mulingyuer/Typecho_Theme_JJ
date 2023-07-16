<?php if ( ! defined('__TYPECHO_ROOT_DIR__')) {
    exit;
}
?>
<!DOCTYPE html>
<html lang="zh-CN">
  <?php $this->need('./php_modules/notes.php');?>
<head>
  <?php $this->need('./php_modules/default_head.php');?>
  <?php if ($this->options->errorType === 'chrome'): ?>
    <link href="<?php $this->options->themeUrl('/static/game/fonts.css');?>" rel="stylesheet" type="text/css">
    <link href="<?php $this->options->themeUrl('/static/game/game.css');?>" rel="stylesheet" type="text/css">
    <script src="<?php $this->options->themeUrl('/static/game/game.js');?>"></script>
  <?php endif;?>
  <?php $this->need('./dist/head/404.php');?>
  <?php //head标签底部插入代码 ?>
  <?php $this->options->headInsertCode();?>
</head>
<body class="<?php if ($this->options->errorType !== 'chrome') {echo 'juejin-error';}?>">
  <?php $this->need('./php_modules/header.php');?>
  <?php $this->need('./php_modules/nav.php');?>
  <main class="main" role="main">
    <div class="container">
      <div class="error-content">
        <?php if ($this->options->errorType === 'chrome'): ?>
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
        <?php else: ?>
          <div class="juejin-error-card">
            <div class="juejin-error-card-head">
              <img class="juejin-error-card-img" src="<?php $this->options->themeUrl('/static/images/404.svg');?>" alt="404">
            </div>
            <div class="juejin-error-card-footer">
              <a class="juejin-error-card-btn" href="<?php $this->options->siteUrl();?>" target="_self">返回首页</a>
            </div>
          </div>
        <?php endif;?>
      </div>
    </div>
  </main>
  <?php if ($this->options->errorType === 'chrome'): ?>
    <div id="t" class="offline">
      <?php $this->need('./php_modules/404/game.php');?>
    </div>
  <?php endif;?>
  <?php $this->need('./php_modules/fixed_tool.php');?>
  <?php //body标签底部插入代码 ?>
  <?php $this->options->bodyInsertCode();?>
  <?php //typecho 插件挂接点 ?>
  <?php $this->footer();?>
</body>
</html>
