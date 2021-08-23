<?php
/**
 * notification
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
    <?php $this->need("dist/css/notification.php");?>
    
  <?php endif; ?>
</head>
<body>
  <?php if(!is_ajax()): ?>
    <?php $this->need("components/default/header.php");?>
  <?php endif; ?>
   
  <main id="main">
    <div class="container">
      <div class="content">
        <?php $this->widget('Widget_Comments_Recent', 'pageSize=50&ignoreAuthor=true')->to($comments); ?>
        <?php if($comments->have()): ?>
          <div class="row">
          <?php while ($comments->next()) : ?>
            <div class="col">
              <div class="card">
                <div class="card-head">
                  <div class="left">
                    <div class="card-img">
                      <?php $comments->gravatar(40); ?>
                    </div>
                    <div class="card-title">
                      <h2 class="title"><?php $comments->author(); ?></h2>
                      <p class="subtitle">
                        <time class="time" datetime="<?php $comments->date('c'); ?>" itemprop="datePublished">
                          <?php timesince($comments->created);?>
                        </time>
                      </p>
                    </div>
                  </div>
                  <div class="right">
                    <?php if($this->user->hasLogin()): ?> 
                    <a class="btn" href="<?php $this->options->adminUrl(); ?>manage-comments.php?cid=<?php echo $comments->cid;?>">管理</a>
                    <?php endif; ?>
                  </div>
                </div>
                <div class="card-body">
                  <p class="card-text"><?php $comments->excerpt(120); ?></p>
                </div>
                <div class="card-footer">
                  <a href="<?php $comments->permalink(); ?>"><i class="icon icon-like"></i>点赞</a>
                  <a href="<?php $comments->permalink(); ?>"><i class="icon icon-share"></i>分享</a>
                  <a href="<?php $comments->permalink(); ?>"><i class="icon icon-message"></i>回复</a>
                </div>
              </div>
            </div>
          <?php endwhile; ?>
          </div>
        <?php else: ?>
          <div class="placeholder">
           <div class="placeholder-content">
              <div class="img-warp">
                <img src="<?php themeUrl('static/images/notification/placeholder.svg');?>" alt="暂无消息">
              </div>
              <p class="text">暂无消息</p>
           </div>
          </div>
        <?php endif;?>
      </div>
    </div>
  </main>
  

  <?php //登录弹窗?>
  <?php $this->need("components/default/login-dialog.php");?>
  <?php //搜索抽屉?>
  <?php $this->need("components/default/drawer-search.php");?>
  <?php //悬浮工具?>
  <?php $this->need("components/default/fixed-tool.php");?>
  <?php //脚本?>
  <?php $this->need("dist/script/notification.php");?>
</body>
</html>