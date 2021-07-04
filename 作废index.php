<?php
/**
 * 掘金高仿版
 * ---------------------
 * 本主题仅供学习交流使用，严禁用于商业用途，请于24小时内删除
 * 
 * @package JJ V1.0 Beta
 * @author 木灵鱼儿
 * @version 1.0 Beta
 * @link https://www.mulingyuer.com
 */

if (!defined('__TYPECHO_ROOT_DIR__')) exit; ?>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <?php if(!is_ajax()): ?>
    <?php $this->need("components/default/head.php");?>
    <?php //样式?>
    <?php $this->need("dist/index/css.php");?>
    
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
        <div class="content">
          <div class="index-left">
            <nav class="head head-nav">
              <a href="#" class="nav-item active">热门</a>
              <a href="#" class="nav-item">最新</a>
              <a href="#" class="nav-item">热榜</a>
            </nav>
            <?php $this->need("components/index-skeleton.php");?>
            <div class="entry-list-wrap hide">
              <?php while ($this->next()) : ?>
                <?php $this->need("components/index-section.php");?>
              <?php endwhile; ?>
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

   
  <?php //脚本?>
  <?php $this->need("dist/index/script.php");?>
</body>
</html>