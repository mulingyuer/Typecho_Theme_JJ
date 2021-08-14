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
    <?php $this->need("components/head.php");?>
    <link rel="stylesheet" href="<?php themeUrl('common/css/notification/index.css'); ?>">
    <script src="<?php themeUrl('notification/js/index.js'); ?>"></script>


  <?php endif; ?>
</head>
<body>
  <?php if(!is_ajax()): ?>
    <?php $this->need("components/header.php");?>
  <?php endif; ?>
  
  <main id="notification-main">
    <div class="container">
      <div class="notification-warp">
        <div class="row">
        <?php $this->widget('Widget_Comments_Recent', 'pageSize=30&ignoreAuthor=true')->to($comments); ?>
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
      </div>
    </div>
  </main>

  <?php //登录弹窗?>
  <?php if(!is_ajax()): ?>
    <?php $this->need("components/login-dialog.php");?>
  <?php endif; ?>
  <?php //浮动工具?>
  <?php if(!is_ajax()): ?>
    <?php $this->need("components/fixed-tool.php");?>
  <?php endif; ?>
</body>
</html>