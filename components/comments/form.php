<?php //评论表单?>
<?php $this->comments()->to($comments); ?>
<div class="comment-form" id="<?php $this->respondId(); ?>">
  <?php //头像 ?>
  <div class="form-left">
    <div class="avatar">
      <?php //已登录?>
      <?php if ($this->user->hasLogin()) : ?>
        <?php $this->author->gravatar(); ?>
      <?php else : ?>
      <?php //未登录?>
        <?php $email=$this->remember('mail',true);if(!empty($email)) : ?>
          <img src="https://gravatar.loli.net/avatar/<?php echo md5($email);?>">
        <?php else : ?>
          <img src="<?php themeUrl('common/images/comments/akari.jpg'); ?>">
        <?php endif; ?>
      <?php endif;?>
    </div>
    <?php //未登录?>
    <?php if ($this->user->hasLogin()): ?>
    <div class="user-info">
      <a class="logout-btn" href="<?php $this->options->logoutUrl(); ?>" alt="退出登录" title="退出登录"><i class="icon icon-poweroff"></i></a>
    </div>
    <?php endif;?>
  </div>
  <form class="form" method="post" action="<?php $this->commentUrl() ?>"  role="form">
    <?php //未登录?>
    <?php if (!$this->user->hasLogin()): ?>
    <div class="form-top">
      <div class="row">
        <?php //用户名?>
        <div class="col item">
          <input type="text" name="author" id="author"  required pattern="\S+.*"  placeholder="昵称" class="layui-input" value="<?php $this->remember('author'); ?>"/>
        </div>
        <?php //邮箱?>
        <div class="col item">
          <input type="email" name="mail" id="mail" placeholder="邮箱" value="<?php $this->remember('mail'); ?>"<?php if ($this->options->commentsRequireMail): ?> required<?php endif; ?> />
        </div>
        <?php //网址?>
        <div class="col item">
          <input type="url" name="url" id="url" class="text" placeholder="<?php _e('http://'); ?>" value="<?php $this->remember('url'); ?>"<?php if ($this->options->commentsRequireURL): ?> required<?php endif; ?> />
        </div>
      </div>
    </div>
    <?php endif;?>
    <div class="form-bottom">
      <?php //评论内容?>
      <div class="textarea-warp">
        <textarea name="text" id="textarea" placeholder="请填写真实邮箱方便站长联系，并回复有效的内容！（Don't use water）"  required lang="zh"><?php $this->remember('text'); ?></textarea>
      </div>
      <?php //评论工具?>
      <div class="form-tool">
        <div class="tool-left">
          <?php $this->need("components/comments/face.php");?>
        </div>
        <div class="tool-right">
          <span class="reply-btn">
            <?php $comments->cancelReply('<button class="form-btn">放弃</button>'); ?>
          </span>
          <button type="submit" class="form-btn submit"><?php _e('评论'); ?></button>
        </div>
      </div>
    </div>
  </form>
</div>