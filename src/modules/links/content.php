<div class="links-page-wrapper">
  <div class="links-page-content">
    <div class="links-page-head">
      <h1 class="links-page-title"><?php $this->title()?><?php if ($this->user->hasLogin()): ?><?php $editPage = $this->is('post') ? 'post' : 'page'; ?><a href="<?php echo $this->options->adminUrl(); ?>write-<?php echo $editPage; ?>.php?cid=<?php echo $this->cid; ?>" class="links-edit-btn" target="_self" title="编辑">编辑</a><?php endif;?></h1>
    </div>
    <div class="links-page-body markdown-body" data-markdown-root data-enable-code-block="true" data-enable-image-zoom="true" data-enable-optional-enhancements="false">
      <?php $this->need('/modules/markdown/markdown.php');?>
    </div>
  </div>
</div>
