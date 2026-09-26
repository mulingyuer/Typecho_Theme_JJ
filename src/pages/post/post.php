<?php if (!defined('__TYPECHO_ROOT_DIR__')) {
    exit;
}
?>
<!DOCTYPE html>
<html lang="zh-CN">
  <?php $this->need('./php_modules/notes/notes.php');?>
<head>
  <?php $this->need('./php_modules/default-head/default-head.php');?>
  <?php $this->need('./php_modules/head/markdown_theme.php');?>
  <!--VITE_HEAD_TAGS-->
  <?php //head标签底部插入代码 ?>
  <?php $this->options->headInsertCode();?>
</head>
<body>
  <?php $this->need('./php_modules/header/header.php');?>
  <main class="main no-nav" role="main">
    <div class="container">
      <div class="main-content post-content">
        <div class="main-left">
          <?php $this->need('./php_modules/article-tool/article-tool.php');?>
          <div class="article-content-wrapper">
            <?php $this->need('./php_modules/article-content/article-content.php');?>
            <?php $this->need('./php_modules/article-relevant-info/article-relevant-info.php');?>
            <?php $this->need('./php_modules/copyright/copyright.php');?>
          </div>
          <?php $this->need('./php_modules/comment/comment.php');?>
          <?php $this->need('./php_modules/post/articles-related/articles-related.php');?>
        </div>
        <div class="main-right">
          <?php $this->need('./php_modules/article-author/article-author.php');?>
          <?php $this->need('./php_modules/post/latest-posts/latest-posts.php');?>
          <div class="post-right-sticky">
          <?php $this->need('./php_modules/post/directory-tree/directory-tree.php');?>
          <?php $this->need('./php_modules/post/next-article/next-article.php');?>
          <?php $this->need('./php_modules/post/article-detail-recommended/article-detail-recommended.php');?>
          </div>
        </div>
      </div>
    </div>
  </main>
  <?php $this->need('./php_modules/fixed-tool/fixed-tool.php');?>
  <?php $this->need('./php_modules/post/mobile-directory-tree/mobile-directory-tree.php');?>
  <?php //body标签底部插入代码 ?>
  <?php $this->options->bodyInsertCode();?>
  <?php //typecho 插件挂接点 ?>
  <?php $this->footer();?>
</body>
</html>
