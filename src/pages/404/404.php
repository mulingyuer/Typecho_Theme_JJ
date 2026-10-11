<?php if ( ! defined('__TYPECHO_ROOT_DIR__')) {
    exit;
}
?>
<!DOCTYPE html>
<html lang="zh-CN">
  <?php $this->need('/modules/notes/notes.php');?>
<head>
  <?php $this->need('/modules/default-head/default-head.php');?>
  <!--VITE_HEAD_TAGS-->
  <?php //head标签底部插入代码 ?>
  <?php $this->options->headInsertCode();?>
</head>
<body class="juejin-error">
  <?php $this->need('/modules/header/header.php');?>
  <?php $this->need('/modules/nav/nav.php');?>
  <main class="main" role="main">
    <div class="container">
      <div class="error-content">
        <div class="juejin-error-card">
          <div class="juejin-error-card-head">
            <img class="juejin-error-card-img" src="<?php $this->options->themeUrl('/images/404.svg');?>" alt="404">
          </div>
          <div class="juejin-error-card-footer">
            <a class="juejin-error-card-btn" href="<?php $this->options->siteUrl();?>" target="_self">返回首页</a>
          </div>
        </div>
      </div>
    </div>
  </main>
  <?php $this->need('/modules/fixed-tool/fixed-tool.php');?>
  <?php //body标签底部插入代码 ?>
  <?php $this->options->bodyInsertCode();?>
  <?php //typecho 插件挂接点 ?>
  <?php $this->footer();?>
</body>
</html>
