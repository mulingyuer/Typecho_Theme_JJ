<?php
/**
 * Typecho 本地开发配置文件（占位模板）
 *
 * 首次使用前复制为 config.inc.php（bind mount 目标需预先存在）：
 *   Copy-Item config.inc.example.php config.inc.php
 *
 * 这是一个"最小可用"占位：定义核心常量、注册 autoloader，
 * 并包含与 docker-compose.yml 环境变量一致的数据库配置。
 * 首次启动后浏览器访问站点，install.php 会读取 TYPECHO_* 环境变量
 * 自动完成安装并覆写本文件（写入挂载的本地 config.inc.php）。
 *
 * 注意：config.inc.php 含数据库密码，已被 .gitignore 忽略，不会提交。
 */

// site root path
if (!defined('__TYPECHO_ROOT_DIR__')) {
    define('__TYPECHO_ROOT_DIR__', dirname(__FILE__));
}

// plugin directory (relative path)
if (!defined('__TYPECHO_PLUGIN_DIR__')) {
    define('__TYPECHO_PLUGIN_DIR__', '/usr/plugins');
}

// theme directory (relative path)
if (!defined('__TYPECHO_THEME_DIR__')) {
    define('__TYPECHO_THEME_DIR__', '/usr/themes');
}

// admin directory (relative path)
if (!defined('__TYPECHO_ADMIN_DIR__')) {
    define('__TYPECHO_ADMIN_DIR__', '/admin/');
}

// debug mode（开发环境开启，异常时显示详细堆栈）
define('__TYPECHO_DEBUG__', true);

// register autoload
require_once __TYPECHO_ROOT_DIR__ . '/var/Typecho/Common.php';

// init
\Typecho\Common::init();

/** 数据库配置（与 docker-compose.yml 中 TYPECHO_DB_* 环境变量保持一致） */
$db = new \Typecho\Db('Pdo_Mysql', 'typecho_');
$db->addServer([
    'host'      => 'mysql',
    'port'      => 3306,
    'user'      => 'root',
    'password'  => 'root',
    'charset'   => 'utf8mb4',
    'database'  => 'typecho',
    'engine'    => 'InnoDB',
], \Typecho\Db::READ | \Typecho\Db::WRITE);
\Typecho\Db::set($db);
