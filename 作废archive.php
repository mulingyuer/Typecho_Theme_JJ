<?php
if (!defined('__TYPECHO_ROOT_DIR__')) exit; ?>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <?php if(!is_ajax()): ?>
    <?php $this->need("components/head.php");?>
    <link rel="stylesheet" href="<?php themeUrl('common/css/index/index.css'); ?>">
    <link rel="stylesheet" href="<?php themeUrl('common/css/category/index.css'); ?>">
    <link rel="stylesheet" href="<?php themeUrl('common/css/archive/index.css'); ?>">
    <script src="<?php themeUrl('category/js/index.js'); ?>"></script>
  <?php endif; ?>
</head>
<body>
  <?php if(!is_ajax()): ?>
    <?php $this->need("components/header.php");?>
  <?php endif; ?>
  
   <main id="index-main">
    <?php if(!is_ajax()): ?>
    <nav id="index-main-nav">
      <div class="container">
        <?php $this->need("index/components/nav.php");?>
      </div>
    </nav>
    <?php endif; ?>
    <section id="index-content">
      <div class="index-container">
        <?php $this->need("category/components/nav-children.php");?>
        <div id="category-nav-placeholder"></div>
        <div class="content">
          <div class="index-left">
            <nav class="category-left-nav">
              <h3 class="title"><?php $this->archiveTitle(array(
                'category'  =>  _t('分类：<strong>%s</strong>'),
                'search'    =>  _t('包含关键字：<strong>%s</strong>'),
                'tag'       =>  _t('标签：<strong>%s</strong>'),
                'author'    =>  _t('发布者：<strong>%s</strong>')
                ), '', ''); ?></h3>
            </nav>
            <?php $this->need("components/index-skeleton.php");?>
            <div class="entry-list-wrap hide">
              <?php if ($this->have()): ?>
              <?php while ($this->next()) : ?>
                <?php $this->need("components/index-section.php");?>
              <?php endwhile; ?>
              <?php else: ?>
                <div class="entry-placeholder">
                  <img src="<?php themeUrl('common/images/tool/placeholder.svg');?>" alt="暂无内容">
                </div>
              <?php endif; ?>
            </div>
            <div class="auto-load">
              <?php $this->pageLink("上一页",'prev');?>
              <?php $this->pageLink("下一页",'next');?>
              <img src="<?php themeUrl('common/images/tool/section-loading.gif');?>" alt="加载中">
            </div>
          </div>
          <?php if(!is_ajax()): ?>
          <?php $this->need("index/components/aside.php");?>
          <?php endif; ?>
        </div>
      </div>
    </section>
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