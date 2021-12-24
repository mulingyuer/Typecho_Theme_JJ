<?php //抽屉搜索?>
<div id="drawer-search">
  <div class="drawer-search-content">
    <form class="search-form" method="post" action="<?php $this->options->siteUrl(); ?>" role="search">
      <input class="search-input" type="text" id="s2" name="s" placeholder="<?php _e('输入关键字搜索'); ?>" autocomplete="off">
      <div class="search-btn">
        <i class="icon icon-sousuo" tabindex="0"></i>
      </div>
      <div class="typehead">
        <div class="title">
          <span>搜索历史</span>
          <span class="clear">清空</span>
        </div>
        <div class="list">
          <div>暂无搜索记录</div>
        </div>
      </div>
    </form>
  </div>
</div>