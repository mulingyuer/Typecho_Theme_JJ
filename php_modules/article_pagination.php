<div class="article-pagination">
  <div class="article-pagination-content">
    <?php $this->pageLink("上一页", 'prev');?>
    <?php $this->pageLink("下一页", 'next');?>
    <img class="article-pagination-loading" src="<?php $this->options->themeUrl('/static/images/article-loading.gif');?>" alt="加载中">
    <span class="article-pagination-no-more">没有更多了</span>
  </div>
</div>