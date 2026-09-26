<div class="copyright">
  <div class="copyright-content">
    <div class="copyright-title">版权申明</div>
    <?php $customCopyright = $this->options->customCopyright;?>
    <?php if (empty($customCopyright)): ?>
      <p class="copyright-desc">本文系作者 <a href="<?php $this->author->permalink();?>">@<?php $this->author();?></a> 原创发布在<?php $this->options->title();?>站点。未经许可，禁止转载。</p>
    <?php else: ?>
      <p class="copyright-desc"><?php echo $customCopyright; ?></p>
    <?php endif;?>
  </div>
</div>