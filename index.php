<?php

/**
 * 掘金高仿版
 * ---------------------
 * 本主题仅供学习交流使用，严禁用于商业用途，请于24小时内删除
 * 
 * @package JJ V2.0
 * @author 木灵鱼儿
 * @version 1.0 Beta
 * @link https://www.mulingyuer.com
 */
if (!defined('__TYPECHO_ROOT_DIR__')) exit; ?>
<!DOCTYPE html>
<html lang="zh-CN">

<head>
  <?php $this->need("php_components/head/index.php"); ?>
  <?php $this->need("dist/head/home.php"); ?>

</head>

<body>
  <header id="header" class="header">
    <div class="header-container">
      <div class="header-left">
        <a class="header-logo" href="<?php $this->options->siteUrl(); ?>">
          <img class="header-pc-logo" src="<?php themeUrl('dist/images/header/pc-logo.png'); ?>" alt="pc端logo">
          <img class="header-mobile-logo" src="<?php themeUrl('dist/images/header/mobile-logo.png'); ?>" alt="移动端logo">
        </a>
        <nav class="header-nav">
          <div class="header-mobile-menu">
            <span>首页</span>
            <img src="<?php themeUrl('dist/images/header/header-mobile-menu-arrow.svg'); ?>">
          </div>

        </nav>
      </div>
      <div class="header-right"></div>
    </div>
  </header>

</body>

</html>