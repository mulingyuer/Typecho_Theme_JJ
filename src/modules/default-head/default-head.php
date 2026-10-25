<?php
$headTitle = blogTitle($this);
$headDescription = blogDescription($this);
$headUrl = seoUrl($this);
$headImage = seoImage($this);
?>
<meta charset="<?php echo headEscape($this->options->charset); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<meta name="renderer" content="webkit">
<meta name="Author" content="<?php echo headEscape($this->author->screenName); ?>">
<meta name="description" content="<?php echo headEscape($headDescription); ?>">
<meta name="keywords" content="<?php echo headEscape(blogKeywords($this)); ?>">
<meta name="path" content="<?php echo headEscape(themeResourceUrl()); ?>">
<!-- RSS 订阅 -->
<?php
ob_start();
$this->header('keywords=&description=&generator=&template=&pingback=&xmlrpc=&wlw=&social=&commentReply=&antiSpam=');
$typechoHeader = ob_get_clean();
echo preg_replace('/^\s*<link\s+rel=["\']canonical["\'][^>]*>\s*/i', '', $typechoHeader, 1);
?>

<title><?php echo headEscape($headTitle); ?></title>

<!-- favicon -->
<link rel="icon" type="image/png" href="<?php echo headEscape(themeResourceUrl('/images/favicon/favicon-96x96.png')); ?>" sizes="96x96" />
<link rel="icon" type="image/svg+xml" href="<?php echo headEscape(themeResourceUrl('/images/favicon/favicon.svg')); ?>" />
<link rel="shortcut icon" href="<?php echo headEscape(themeResourceUrl('/images/favicon/favicon.ico')); ?>" />
<link rel="apple-touch-icon" sizes="180x180" href="<?php echo headEscape(themeResourceUrl('/images/favicon/apple-touch-icon.png')); ?>" />
<meta name="apple-mobile-web-app-title" content="<?php echo headEscape($this->options->title); ?>" />
<link rel="manifest" href="<?php echo headEscape(themeResourceUrl('/images/favicon/site.webmanifest')); ?>" />
<meta name="theme-color" content="#ffffff">

<link rel="canonical" href="<?php echo headEscape($headUrl); ?>">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="<?php echo $this->is('post') ? 'article' : 'website'; ?>">
<meta property="og:title" content="<?php echo headEscape($headTitle); ?>">
<meta property="og:description" content="<?php echo headEscape($headDescription); ?>">
<meta property="og:image" content="<?php echo headEscape($headImage); ?>">
<meta property="og:url" content="<?php echo headEscape($headUrl); ?>">

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="<?php echo headEscape($headTitle); ?>">
<meta name="twitter:description" content="<?php echo headEscape($headDescription); ?>">
<meta name="twitter:image" content="<?php echo headEscape($headImage); ?>">
<meta name="twitter:url" content="<?php echo headEscape($headUrl); ?>">

<!-- config -->
<meta name="theme-config" data-pagination-type="<?php echo headEscape($this->options->paginationType); ?>" data-notification-pagination-type="<?php echo headEscape($this->options->notificationPaginationType); ?>" data-theme-path="<?php echo headEscape(themeResourceUrl()); ?>">

<!-- iconfont -->
<link href="<?php echo headEscape(themeResourceUrl('/fonts/iconfont.css')); ?>" rel="stylesheet" type="text/css">

<!-- globalError -->
<script src="<?php echo headEscape(themeResourceUrl('/scripts/globalError.js')); ?>"></script>

<!-- DocSearch  -->
<?php if ($this->options->isOpenDocSearch === 'on'): ?>
  <?php $docSearchAppId = trim((string) $this->options->docSearchAppId); ?>
  <?php if ($docSearchAppId !== '' && preg_match('/^[a-z0-9]+$/i', $docSearchAppId)): ?>
    <link rel="preconnect" href="https://<?php echo headEscape(strtolower($docSearchAppId)); ?>-dsn.algolia.net" crossorigin />
  <?php endif; ?>
  <?php setDocSearchCookie(); ?>
<?php endif; ?>



<!-- dist -->