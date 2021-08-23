<?php //登录弹窗?>
<?php if(!$this->user->hasLogin()): ?>
  <div id="login-dialog">
    <div class="login-content">
      <div class="login-form-warp">
        <form class="auth-form" action="<?php $this->options->loginAction() ?>" method="post" name="login" rold="form">
          <input type="hidden" name="referer" value="<?php echo curPageURL(); ?>" required>
          <i class="icon icon-guanbi close"></i>
          <div class="form-panel">
            <h2 class="form-title">账密登录</h2>
            <div class="input-group username">
              <input type="text" name="name" placeholder="请输入账号" required pattern="\S+.*">
              <img class="panfish-img greeting" src="<?php themeUrl('static/images/login/greeting.png');?>">
            </div>
            <div class="input-group password">
              <input type="password" name="password" placeholder="请输入密码" autocomplete="off" required pattern="\S+.*">
              <img class="panfish-img blindfold" src="<?php themeUrl('static/images/login/blindfold.png');?>">
            </div>
            <div class="input-group">
              <button class="btn">登录</button>
            </div>
            <img class="panfish-img normal" src="<?php themeUrl('static/images/login/normal.png');?>">
          </div>
          <div class="form-prompt">
            <a href="javascript:;">手机登录</a>
            <a href="javascript:;">忘记密码</a>
          </div>
          <div class="form-agreement">
            注册登录即表示同意&nbsp;
            <a href="javascript:;" target="_blank">用户协议</a>、
            <a href="javascript:;" target="_blank">隐私政策</a>
          </div>
        </form>
      </div>
    </div>
  </div>
<?php endif; ?>