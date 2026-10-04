<?php
/**
 * 掘金高仿版
 * ---------------------
 * 本主题仅供学习交流使用，严禁用于商业用途，请于24小时内删除
 *
 * @package JJ
 * @author 木灵鱼儿
 * @version 2.3.8
 * @link https://www.mulingyuer.com
 */
?>
<?php if ( ! defined('__TYPECHO_ROOT_DIR__')) {
    exit;
}
?>
<?php if ( ! isAjax()): ?>
<!DOCTYPE html>
<html lang="zh-CN">
  <?php $this->need('/modules/notes/notes.php');?>
<head>
  <?php $this->need('/modules/default-head/default-head.php');?>
  <!--VITE_HEAD_TAGS-->
  <?php //head标签底部插入代码 ?>
  <?php $this->options->headInsertCode();?>
</head>
<body>
  <h1 style="display:none;"><?php blogTitle($this);?></h1>
  <?php $this->need('/modules/header/header.php');?>
  <?php $this->need('/modules/nav/nav.php');?>
  <main class="main" role="main">
    <div class="container">
      <div class="main-content home-content">
        <div class="main-left">
          <?php $this->need('/modules/home/article-nav/nav.php');?>
<?php endif;?>
          <?php //是否有内容?>
          <?php if ($this->have()): ?>
            <?php $this->need('/modules/article-skeleton/article-skeleton.php');?>
            <?php $this->need('/modules/article-card/article-card.php');?>
          <?php else: ?>
            <?php $this->need('/modules/article-empty/article-empty.php');?>
          <?php endif;?>
          <?php $this->need('/modules/article-pagination/article-pagination.php');?>
<?php if ( ! isAjax()): ?>
        </div>
        <div class="main-right">
          <?php $this->need('/modules/home/recent-comments/recent-comments.php');?>
          <?php $this->need('/modules/home/recommended-article/recommended-article.php');?>
          <?php $this->need('/modules/home/theme-tool/theme-tool.php');?>
          <?php $this->need('/modules/footer/footer.php');?>
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
<?php endif;?>