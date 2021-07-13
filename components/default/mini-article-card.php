<section class="min-article-card" data-link="<?php $this->permalink() ?>">
  <div class="content-box">
    <div class="info-box">
      <div class="info-top">
        <a href="<?php $this->author->permalink(); ?>" class="author"><?php $this->author(); ?></a>
        <span class="time"><?php timesince($this->created);?></span>
        <?php $this->category('<span class="classify-cut"></span>'); ?>
      </div>
      <div class="info-center">
        <a class="title" href="<?php $this->permalink() ?>" title="<?php $this->title() ?>">
          <h2><?php $this->title() ?></h2>
        </a>
        <p class="description"><?php $this->excerpt(300); ?></p>
      </div>
      <div class="info-bottom">
        <div class="btn"><i class="icon icon-like-fill"></i><?php echo getLikeCount($this->cid); ?></div>
        <div class="btn comment" data-link="<?php $this->permalink() ?>#comments"><i class="icon icon-huifu"></i><?php $this->commentsNum(_t('0'), _t('1'), _t('%d ')); ?></div>
        <div class="btn share" data-link="<?php $this->permalink() ?>" title="手机扫一扫"><i class="icon icon-share"></i>
          <div class="share-panel hide">
            <div class="qr-code-tooltip">
              <div class="qr-code-head"><i class="icon icon-saoyisao"></i>手机扫一扫</div>
              <div class="qr-code-body"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <?php $thumbnail = get_ArticleThumbnail($this);?>
  <?php if($thumbnail !== ""): ?>
  <div class="entry-img">
    <img data-src="<?php echo $thumbnail;?>" src="<?php themeUrl('static/images/tool/img-loading.gif');?>" alt="<?php $this->title() ?>">
  </div>
  <?php endif;?>
</section>