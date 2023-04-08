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
  <?php //head标签底部插入代码 ?>
  <?php $this->options->headInsertCode();?>
</head>
<body>
  <?php $this->need("./php_modules/header.php");?>
  <main class="main no-nav" role="main">
    <div class="container">
      <div class="main-content post-content">
        <div class="main-left">
          <?php $this->need("./php_modules/article_tool.php");?>
          <div class="article-content-wrapper">
            <?php $this->need("./php_modules/article_content.php");?>
            <?php $this->need("./php_modules/article_relevant_info.php");?>
            <?php $this->need("./php_modules/copyright.php");?>
          </div>
          <?php $this->need("./php_modules/comment/comment.php");?>
          <?php $this->need("./php_modules/post/articles_related.php");?>
        </div>
        <div class="main-right">
          <?php $this->need("./php_modules/article_author.php");?>
          <?php $this->need("./php_modules/post/latest_posts.php");?>
          <?php $this->need("./php_modules/post/directory_tree.php");?>
        </div>
      </div>
    </div>
  </main>
  <?php $this->need("./php_modules/fixed_tool.php");?>
  <?php //body标签底部插入代码 ?>
  <?php $this->options->bodyInsertCode();?>
</body>
</html>
