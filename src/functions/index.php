<?php
if (!defined('__TYPECHO_ROOT_DIR__')) {
    exit;
}

require_once __DIR__ . '/theme-config.php';
require_once __DIR__ . '/seo.php';
require_once __DIR__ . '/directory-tree.php';
require_once __DIR__ . '/comment.php';
require_once __DIR__ . '/utils.php';

// 在任何模板渲染前应用头像源常量（系统 config.inc.php 已定义时自动跳过）
applyGravatarPrefix();
