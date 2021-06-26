<footer id="footer">
  <div class="footer-list">
    <a class="item" href="<?php echo getHidePage($page,'about');?>">关于</a>
    <a class="item" href="<?php echo getHidePage($page,'links');?>">友情链接</a>
    <a class="item" href="<?php $this->options->siteUrl(); ?>sitemap.xml" target="_blank">地图</a>
  </div>
  <?php if(!empty($this->options->record)) : ?>
  <div class="footer-list">
    <a href="><?php $this->options->recordLink();?>" target="_blank"><?php $this->options->recordNumber();?></a>
  </div>
  <?php endif; ?>
  <div class="footer-list">版权所有：<?php $this->options->title(); ?></div>
  <div class="footer-list">联系地址：东之国中远离人里的边境之地</div>
  <div class="footer-list">
    <span>联系邮箱：</span>
    <a href="mailto:<?php $this->author->mail();?>" target="_blank"><?php $this->author->mail();?></a>
  </div>
  <div class="footer-list">
    <div>
      <a href="<?php $this->options->siteUrl(); ?>">&copy;2021 <?php $this->options->title(); ?></a>
    </div>
    <div>
      Blog By <a href="http://typecho.org">Typecho</a>
    </div>
  </div>
</footer>