<?php if (!defined('__TYPECHO_ROOT_DIR__')) exit; ?>
<meta charset="<?php $this->options->charset(); ?>">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="viewport"
content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no,shrink-to-fit=no,viewport-fit=cover">
<meta http-equiv="X-UA-Compatible" content="ie=edge">
<meta name="renderer" content="webkit">
<meta http-equiv="Window-target" content="_top">
<meta http-equiv="Cache-Control" content="no-transform">
<meta http-equiv="Cache-Control" content="no-siteapp">
<meta name="Author" content="<?php $this->author(); ?>">
<meta data-n-head="true" name="description" content="<?php $this->options->description() ?>">
<?php if ($this->is('index')) : ?>
<meta data-n-head="true" name="keywords" content="<?php $this->options->keywords() ?>">
<?php else : ?>
<meta data-n-head="true" name="keywords"
content="<?php $this->category(',', false); ?>,<?php $this->tags(',', false); ?>">
<?php endif; ?>
<!-- 通过自有函数输出HTML头部信息 -->
<?php $this->header('keywords=&description=&generator=&template=&pingback=&xmlrpc=&wlw='); ?>
<title><?php $this->archiveTitle(array(
      'category'  =>  _t('分类 %s 下的文章'),
      'search'    =>  _t('包含关键字 %s 的文章'),
      'tag'       =>  _t('标签 %s 下的文章'),
      'author'    =>  _t('%s 发布的文章')
    ), '', ' - '); ?><?php $this->options->title(); ?></title>
<?php //加载favicon?>
<link rel="apple-touch-icon" sizes="180x180" href="<?php themeUrl('static/images/favicon/apple-touch-icon.png');?>">
<link rel="icon" type="image/png" sizes="32x32" href="<?php themeUrl('static/images/favicon/favicon-32x32.png');?>">
<link rel="icon" type="image/png" sizes="16x16" href="<?php themeUrl('static/images/favicon/favicon-16x16.png');?>">
<link rel="manifest" href="<?php themeUrl('static/images/favicon/site.webmanifest');?>">
<link rel="mask-icon" href="<?php themeUrl('static/images/favicon/safari-pinned-tab.svg');?>" color="#5bbad5">
<meta name="msapplication-TileColor" content="#2b90ff">
<meta name="theme-color" content="#ffffff">
<?php //seo-og?>
<?php $this->need("components/default/og.php");?>
<?php //加载css?>
<link rel="stylesheet" href="<?php themeUrl('static/css/fonts.css'); ?>">
<?php //加载js?>
<script>window.$theme_path="<?php echo $this->options->themeUrl;?>";</script>
<?php //统计代码?>
<?php $this->options->statisticalCode();?>
