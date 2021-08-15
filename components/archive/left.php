<div class="left">
  <nav class="head archive-title">
    <h3 class="title">
      <?php $this->archiveTitle(array(
      'category'  =>  _t('分类：<strong>%s</strong>'),
      'search'    =>  _t('包含关键字：<strong>%s</strong>'),
      'tag'       =>  _t('标签：<strong>%s</strong>'),
      'author'    =>  _t('发布者：<strong>%s</strong>')
      ), '', ''); ?>
    </h3>
  </nav>
  <?php $this->need("components/index/skeleton.php");?>
  <div id="article-list-wrap" class="hide">
    <?php //是否存在内容?>
    <?php if ($this->have()): ?>
      <?php while ($this->next()) : ?>
        <?php $this->need("components/default/mini-article-card.php");?>
      <?php endwhile; ?>
    <?php else: ?>
      <div class="archive-placeholder">
        <img src="<?php themeUrl('static/images/tool/placeholder.svg');?>" alt="暂无内容">
      </div>
    <?php endif; ?>
  </div>
  <div class="auto-load <?php if (!$this->have()) echo 'show'; ?>">
    <?php $this->pageLink("上一页",'prev');?>
    <?php $this->pageLink("下一页",'next');?>
    <img src="<?php themeUrl('static/images/tool/section-loading.gif');?>" alt="加载中">
  </div>
  
</div>