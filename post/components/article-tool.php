<?php //左侧文章工具?>
<div id="article-tool">
  <div class="top">
    <?php //点赞?>
    <div id="like-badge" class="badge <?php if(!empty(getLikeCount($this->cid))){echo 'active';} ?>" badge="<?php echo getLikeCount($this->cid); ?>" data-cid="<?php $this->cid();?>" data-like-href="<?php Typecho_Widget::widget("Widget_Security")->to($security); $security->index("?"); ?>">
      <i class="icon icon-like-fill"></i>   
    </div>
    <?php //评论?>
    <a class="badge" badge="<?php $this->commentsNum(_t('0'), _t('1'), _t('%d ')); ?>" href="#comments">
      <i class="icon icon-huifu"></i>
    </a>
  </div>
  <div class="bottom share">
    <div class="share-title">分享</div>
    <div class="share-content">
      <a class="share-item weibo" href="http://service.weibo.com/share/share.php?url=<?php $this->permalink() ?>&title=<?php $this->title() ?>@<?php $this->options->title(); ?>&appkey=1006020243&pic=<?php if ($this->fields->thumb) { echo $this->fields->thumb;} else {get_ArticleThumbnail($this);};?>&searchPic=true" target="_blank">
        <i class="icon icon-weibo"></i>
      </a>
      <a class="share-item qq" href="http://connect.qq.com/widget/shareqq/index.html?url=<?php $this->permalink() ?>&title=<?php $this->title() ?>&pics=<?php if ($this->fields->thumb) { echo $this->fields->thumb;} else {get_ArticleThumbnail($this);};?>&site=<?php $this->options->title(); ?>" target="_blank">
        <i class="icon icon-QQ"></i>
      </a>
      <a class="share-item qq-kj" href="https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=<?php $this->permalink() ?>&title=<?php $this->title() ?>&site=<?php $this->options->title(); ?>&pics=<?php if ($this->fields->thumb) { echo $this->fields->thumb;} else {get_ArticleThumbnail($this);};?>" target="_blank">
        <i class="icon icon-qqkongjian"></i>
      </a>
      <a class="share-item wx" href="javascript:;" data-link="<?php $this->permalink();?>">
        <i class="icon icon-wechat-fill"></i>
        <div class="wx-qrcode"></div>
      </a>
    </div>
  </div>
</div>