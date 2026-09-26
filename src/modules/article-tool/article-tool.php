<div class="article-tool">
  <div class="article-tool-content">
    <div class="article-tool-item badge article-like-btn immersion-hide<?php if ( ! empty(getLikeCount($this))) {echo ' active';}?>" badge="<?php echo getLikeCount($this); ?>" title="点赞">
      <i class="jj-icon jj-icon-like-fill article-tool-item-icon"></i>
    </div>
    <a class="article-tool-item badge immersion-hide" href="#comments" target="_self" badge="<?php $this->commentsNum(_t('0'), _t('1'), _t('%d '));?>" title="评论">
      <i class="jj-icon jj-icon-message-fill article-tool-item-icon"></i>
    </a>
    <div class="article-tool-item share immersion-hide" title="分享">
      <i class="jj-icon jj-icon-fenxiang article-tool-item-icon"></i>
      <div class="article-tool-share">
        <div class="article-tool-share-item wx">
          <i class="jj-icon jj-icon-wechat-fill article-tool-share-item-icon"></i>
          <div class="article-tool-share-item-title">微信</div>
          <div class="article-tool-wx-qrcode">
            <img class="article-tool-wx-qrcode-img" src="" alt="微信分享">
            <div class="article-tool-wx-qrcode-info">微信扫码分享</div>
          </div>
        </div>
        <a class="article-tool-share-item" href="https://connect.qq.com/widget/shareqq/index.html?url=<?php seoUrl($this);?>&title=<?php echo urlencode($this->title); ?>&pics=<?php echo seoImage($this); ?>&summary=<?php echo getArticleSummary($this); ?>&site=<?php echo urlencode($this->options->title); ?>" target="_blank" title="QQ分享">
          <i class="jj-icon jj-icon-QQ article-tool-share-item-icon"></i>
          <div class="article-tool-share-item-title">QQ</div>
        </a>
        <a class="article-tool-share-item" href="https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=<?php seoUrl($this);?>&title=<?php echo urlencode($this->title); ?>&desc=<?php echo getArticleSummary($this); ?>&summary=&site=<?php $this->options->title();?>" target="_blank" title="QQ空间分享">
          <i class="jj-icon jj-icon-qqkongjian article-tool-share-item-icon"></i>
          <div class="article-tool-share-item-title">QQ空间</div>
        </a>
        <a class="article-tool-share-item" href="https://service.weibo.com/share/share.php?url=<?php seoUrl($this);?>&title=%E3%80%90<?php echo urlencode($this->title); ?>%E3%80%91<?php echo getArticleSummary($this); ?>&appkey=&pic=<?php seoUrl($this);?>&searchPic=true" target="_blank" title="新浪微博">
          <i class="jj-icon jj-icon-weibo article-tool-share-item-icon"></i>
          <div class="article-tool-share-item-title">新浪微博</div>
        </a>
      </div>
    </div>
    <div class="article-tool-dividing immersion-hide"></div>
    <div class="article-tool-item immersion-mode-btn" title="沉浸模式">
      <i class="jj-icon jj-icon-bg-fullscreen article-tool-item-icon"></i>
    </div>
  </div>
</div>