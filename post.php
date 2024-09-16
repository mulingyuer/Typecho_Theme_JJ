<?php if (!defined('__TYPECHO_ROOT_DIR__')) {
    exit;
}
?>
<!DOCTYPE html>
<html lang="zh-CN">
  <?php $this->need('./php_modules/notes.php');?>
<head>
  <?php $this->need('./php_modules/default_head.php');?>
  <?php $this->need('./php_modules/head/markdown_theme.php');?>
  <?php $this->need('./dist/head/post.php');?>
  <?php //head标签底部插入代码 ?>
  <?php $this->options->headInsertCode();?>
</head>
<body>
  <?php $this->need('./php_modules/header.php');?>
  <main class="main no-nav" role="main">
    <div class="container">
      <div class="main-content post-content">
        <div class="main-left">
          <?php $this->need('./php_modules/article_tool.php');?>
          <div class="article-content-wrapper">
            <?php $this->need('./php_modules/article_content.php');?>
            <?php $this->need('./php_modules/article_relevant_info.php');?>
            <?php $this->need('./php_modules/copyright.php');?>
          </div>
          <?php $this->need('./php_modules/comment/comment.php');?>
          <?php $this->need('./php_modules/post/articles_related.php');?>
        </div>
        <div class="main-right">
          <?php $this->need('./php_modules/article_author.php');?>
          <?php $this->need('./php_modules/post/latest_posts.php');?>
          <div class="post-right-sticky">
          <?php $this->need('./php_modules/post/directory_tree.php');?>
          <?php $this->need('./php_modules/post/next-article.php');?>
          <?php $this->need('./php_modules/post/article_detail_recommended.php');?>
          </div>
        </div>
      </div>
    </div>
  </main>
  <?php $this->need('./php_modules/fixed_tool.php');?>
  <?php $this->need('./php_modules/mobile_directory_tree.php');?>
  <?php //body标签底部插入代码 ?>
  <?php $this->options->bodyInsertCode();?>
  <?php //typecho 插件挂接点 ?>
  <?php $this->footer();?>
</body>
</html>
