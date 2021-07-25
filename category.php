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
    <?php $this->need("dist/css/category.php");?>
    
  <?php endif; ?>
</head>
<body>
  <?php if(!is_ajax()): ?>
    <?php $this->need("components/default/header.php");?>
    <?php $this->need("components/default/nav.php");?>
  <?php endif; ?>
   
  <main id="main">
    <div class="container">
      <?php //菜单?>
      <?php $this->need("components/category/nav-children.php");?>
      <div class="content">
        <?php $this->need("components/category/left.php");?>
        <?php $this->need("components/index/right.php");?>
      </div>
    </div>
  </main>
  

   
  <?php //脚本?>
  <?php $this->need("dist/script/category.php");?>
</body>
</html>