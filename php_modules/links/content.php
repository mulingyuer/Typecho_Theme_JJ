<div class="links-page-wrapper">
  <div class="links-page-content">
    <div class="links-page-head">
      <h1 class="links-page-title"><?php $this->title()?><?php if ($this->user->hasLogin()): ?><a href="<?php $this->options->adminUrl();?>write-<?php if ($this->is('post')): ?>post<?php else: ?>page<?php endif;?>.php?cid=<?php echo $this->cid; ?>" class="links-edit-btn" target="_self" title="编辑">编辑</a><?php endif;?></h1>
    </div>
    <div class="links-page-body">
      <?php $this->need('./php_modules/markdown.php');?>
    </div>
  </div>
</div>