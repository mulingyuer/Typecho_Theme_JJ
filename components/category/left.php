<div class="left">
  <nav class="head category-title">
    <h3 class="title">
      <?php $this->archiveTitle(array('category'  =>  _t('分类：<strong>%s</strong>')), '', ''); ?>
    </h3>
  </nav>
  <?php $this->need("components/index/skeleton.php");?>
  <div id="article-list-wrap" class="hide">
    <?php while ($this->next()) : ?>
      <?php $this->need("components/default/mini-article-card.php");?>
    <?php endwhile; ?>
  </div>
  <div class="auto-load <?php if (!$this->have()) echo 'show'; ?>">
    <?php $this->pageLink("上一页",'prev');?>
    <?php $this->pageLink("下一页",'next');?>
    <img src="<?php themeUrl('static/images/tool/section-loading.gif');?>" alt="加载中">
  </div>
  
</div>