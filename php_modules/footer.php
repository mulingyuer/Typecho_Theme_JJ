<footer class="footer">
  <div class="footer-content">
    <div class="footer-item">
      <a href="<?php echo getHidePage($page, 'about'); ?>" target="_self" title="关于">关于</a>
      <a href="<?php echo getHidePage($page, 'links'); ?>" target="_self" title="友情链接">友情链接</a>
      <a href="<?php $this->options->siteUrl();?>sitemap.xml" target="_blank" title="站点地图">站点地图</a>
    </div>
    <div class="footer-item">
      版权所有：<?php $this->options->title();?>
    </div>
    <div class="footer-item">
      联系地址：东之国中远离人里的边境之地
    </div>
    <div class="footer-item">
      <span>联系邮箱：</span><a href="mailto:<?php $this->author->mail();?>" target="_self"><?php $this->author->mail();?></a>
    </div>
    <div class="footer-item">
      <a href="<?php $this->options->siteUrl();?>" target="_self" title="<?php $this->options->title();?>">&copy;2021 <?php $this->options->title();?></a>
    </div>
    <div class="footer-item">
      <a href="https://ourl.co/icp" target="_blank" rel="noopener nofollow">浙ICP备19001095号-11</a>
    </div>
    <div class="footer-item">
      Blog By <a href="http://typecho.org" target="_blank" title="Typecho">Typecho</a>
    </div>
  </div>
</footer>