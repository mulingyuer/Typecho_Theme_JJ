<?php
/**
 * links
 *
 * @package custom
 */
if (!defined('__TYPECHO_ROOT_DIR__')) exit; ?>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <?php if(!is_ajax()): ?>
    <?php $this->need("components/default/head.php");?>
    <?php //样式?>
    <?php $this->need("dist/css/links.php");?>
    
  <?php endif; ?>
</head>
<body>
  <?php if(!is_ajax()): ?>
    <?php $this->need("components/default/header.php");?>
    <?php $this->need("components/default/nav.php");?>
  <?php endif; ?>
   
  <main id="main">
    <div class="container">
      <div class="links-content">
        <div class="links-head">
          <h1 class="title"><?php $this->title() ?><?php if ($this->user->hasLogin()) : ?><a href="<?php $this->options->adminUrl(); ?>write-<?php if ($this->is('post')) : ?>post<?php else : ?>page<?php endif; ?>.php?cid=<?php echo $this->cid; ?>" class="icon icon-edit" target="_blank"></a><?php endif; ?></h1>
        </div>
        <div class="links-body">
          <?php
            $db = Typecho_Db::get();
            $sql = $db->select()->from('table.comments')
              ->where('cid = ?', $this->cid)
              ->where('mail = ?', $this->remember('mail', true))
              ->where('status = ?', 'approved')
              //只有通过审核的评论才能看回复可见内容
              ->limit(1);
            $result = $db->fetchAll($sql);
            $content = $this->content;
            //a链接增加_blank                
            $content = preg_replace('/<a href=\"(.*?)\">(.*?)<\/a>/sm', '<a href="$1" target="_blank">$2</a>', $content);
            echo $content
            ?>
        </div>
        <div class="links-declaration">
          <div class="left">
            <i class="icon icon-warning-circle-fill"></i>
          </div>
          <div class="right">
            <h2 class="title">友链声明</h2>
            <p class="subtitle">寻求志同道合的技术博主，我们的目标是星辰大海！</p>
            <p class="subtitle">要求：技术博客、长期稳定</p>
          </div>
        </div>
        <div class="links-footer">
          <?php $this->need("components/comments/index.php");?>
        </div>
      </div>
    </div>
  </main>
  

   
  <?php //脚本?>
  <?php $this->need("dist/script/links.php");?>
</body>
</html>