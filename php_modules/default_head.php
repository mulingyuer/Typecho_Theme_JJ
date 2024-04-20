<meta charset="<?php $this->options->charset();?>">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="viewport"
content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no,shrink-to-fit=no,viewport-fit=cover">
<meta http-equiv="X-UA-Compatible" content="ie=edge">
<meta name="renderer" content="webkit">
<meta http-equiv="Window-target" content="_top">
<meta http-equiv="Cache-Control" content="no-transform">
<meta http-equiv="Cache-Control" content="no-siteapp">
<meta name="Author" content="<?php $this->author();?>">
<meta name="description" content="<?php blogDescription($this);?>">
<meta name="keywords" content="<?php blogKeywords($this);?>">
<meta name="title" content="<?php blogTitle($this);?>">
<meta name="path" content="<?php $this->options->themeUrl();?>">
<!-- RSS 订阅 -->
<?php $this->header('keywords=&description=&generator=&template=&pingback=&xmlrpc=&wlw=');?>

<title><?php blogTitle($this);?></title>

<!-- favicon -->
<link rel="apple-touch-icon" sizes="180x180" href="<?php $this->options->themeUrl('/static/images/favicon/apple-touch-icon.png');?>">
<link rel="icon" type="image/png" sizes="32x32" href="<?php $this->options->themeUrl('/static/images/favicon/favicon-32x32.png');?>">
<link rel="icon" type="image/png" sizes="16x16" href="<?php $this->options->themeUrl('/static/images/favicon/favicon-16x16.png');?>">
<link rel="manifest" href="<?php $this->options->themeUrl('/static/images/favicon/site.webmanifest');?>">
<link rel="mask-icon" href="<?php $this->options->themeUrl('/static/images/favicon/safari-pinned-tab.svg');?>" color="#5bbad5">
<link rel="shortcut icon" href="<?php $this->options->themeUrl('/static/images/favicon/favicon.ico');?>">
<meta name="msapplication-TileColor" content="#2d89ef">
<meta name="msapplication-config" content="<?php $this->options->themeUrl('/static/images/favicon/browserconfig.xml');?>">
<meta name="theme-color" content="#ffffff">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="<?php seoUrl($this);?>">
<meta property="og:title" content="<?php blogTitle($this);?>">
<meta property="og:description" content="<?php blogDescription($this);?>">
<meta property="og:image" content="<?php echo seoImage($this); ?>">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="<?php seoUrl($this);?>">
<meta property="twitter:title" content="<?php blogTitle($this);?>">
<meta property="twitter:description" content="<?php blogDescription($this);?>">
<meta property="twitter:image" content="<?php echo seoImage($this); ?>">

<!-- config -->
<meta name="theme-config" data-pagination-type="<?php $this->options->paginationType();?>" data-theme-path="<?php $this->options->themeUrl();?>" >

<!-- theme -->
<?php $random_number = rand() / getrandmax();?>
<link href="<?php $this->options->themeUrl('/static/css/theme/light.css?'.$random_number);?>" rel="stylesheet" type="text/css" title="light">
<link href="<?php $this->options->themeUrl('/static/css/theme/dark.css?'.$random_number);?>" rel="alternate stylesheet" type="text/css" title="dark">

<!-- globalError -->
<script src="<?php $this->options->themeUrl('/static/scripts/globalError.js');?>"></script>

<!-- DocSearch  -->
<?php if ($this->options->isOpenDocSearch === 'on'): ?>
  <link rel="preconnect" href="https://YOUR_APP_ID-dsn.algolia.net" crossorigin />
  <?php setDocSearchCookie();?>
<?php endif;?>



<!-- dist -->
