<?php //og富媒体对象?>
<meta property="og:url" content="<?php echo curPageURL();?>"/>
<meta property="og:site_name" content="<?php $this->options->title(); ?>">
<meta property="og:title" content="<?php $this->options->title(); ?>"/>
<meta property="og:image" content="<?php themeUrl('common/images/favicon/favicon.ico');?>"/>
<meta property="og:description" content="<?php $this->options->description() ?>">
<meta name="applicable-device" content="pc,mobile" />
<meta http-equiv="Cache-Control" content="no-transform" />
<link rel="shortcut icon" href="<?php themeUrl('common/images/favicon/favicon.ico');?>" />
<?php if($this->is('post')) : ?>
  <meta property="article:published_time" content="<?php $this->date('c'); ?>"/>
  <meta property="article:author" content="<?php $this->author(); ?>" />
  <meta property="article:published_first" content="<?php $this->options->title() ?>, <?php $this->permalink() ?>" />
<?php endif;?>


