<section class="min-article-card" data-link="<?php $this->permalink() ?>">
  <div class="article-info">
    <a href="<?php $this->author->permalink(); ?>" class="author"><?php $this->author(); ?></a>
    <span class="time"><?php timesince($this->created);?></span>
    <?php $this->category('<span class="classify-cut"></span>'); ?>
  </div>
  <div class="article-card-content">
    <div class="info-box">
      <div class="info-center">
        <a class="title" href="<?php $this->permalink() ?>" title="<?php $this->title() ?>">
          <h2><?php $this->title() ?></h2>
        </a>
        <p class="description"><?php $this->excerpt(300); ?></p>
      </div>
      <div class="info-bottom">
        <a class="btn" href="javascript:;"><i class="icon icon-eye"></i><?php views($this); ?></a>
        <a class="btn" href="javascript:;"><i class="icon icon-like"></i><?php echo getLikeCount($this->cid); ?></a>
        <a class="btn comment" href="<?php $this->permalink() ?>#comments"><i class="icon icon-message"></i><?php $this->commentsNum(_t('0'), _t('1'), _t('%d ')); ?></a>
      </div>
    </div>
    <?php $thumbnail = get_ArticleThumbnail($this);?>
    <?php if($thumbnail !== ""): ?>
    <div class="entry-img">
      <img data-src="<?php echo $thumbnail;?>" src="<?php themeUrl('static/images/tool/img-loading.gif');?>" alt="<?php $this->title() ?>">
    </div>
    <?php endif;?>
  </div>
</section>