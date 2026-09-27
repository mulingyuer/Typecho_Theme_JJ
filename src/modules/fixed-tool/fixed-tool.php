<div class="fixed-tool">
  <div class="fixed-tool-content">
    <div class="fixed-tool-item back-to-top">
      <i class="jj-icon jj-icon-arrow_up_fill fixed-tool-item-icon"></i>
    </div>
    <?php if ($this->options->isOpenDocSearch === 'on'): ?>
    <div class="fixed-tool-item docsearch-wrapper"></div>
    <?php endif;?>
    <?php if ($this->is('post') || $this->is('page')): ?>
    <div class="fixed-tool-item mobile-directory-tree-toggle">
      <i class="jj-icon jj-icon-unorderedlist fixed-tool-item-icon"></i>
    </div>
    <?php endif;?>
  </div>
</div>