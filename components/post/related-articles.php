<?php //相关文章 ?>
<?php $this->related(10,NULL)->to($relatedPosts); ?> 
<?php if ($relatedPosts->have()): ?> 
  <div id="related-articles">
    <div class="head">
      <h2 class="title">相关推荐</h2>
    </div>
    <div class="content">
      <?php while ($relatedPosts->next()): ?>
        <div class="related-item" data-link="<?php $relatedPosts->permalink(); ?>">
          <div class="item-head">
            <div class="head-left">
              <a class="user" href="<?php $relatedPosts->author->permalink(); ?>" target="_blank">
                <?php $relatedPosts->author(); ?>
              </a>
              <span class="dividing"></span>
              <time class="date" datetime="<?php $relatedPosts->date('c'); ?>" itemprop="datePublished"><?php timesince($relatedPosts->created);?></time>
            </div>
            <div class="head-right">
              <?php $relatedPosts->category(""); ?>
            </div>
          </div>
          <div class="item-body">
            <div class="item-body-left">
              <h2 class="title"><?php $relatedPosts->title(); ?></h2>
              <p class="subtitle">
                <?php $relatedPosts->excerpt(80, '...'); ?>
              </p>
              <div class="info">
                <div class="info-item like"><i class="icon icon-like"></i><?php echo getLikeCount($relatedPosts->cid); ?></div>
                <div class="info-item"><i class="icon icon-message"></i><?php $relatedPosts->commentsNum(_t('0'), _t('1'), _t('%d ')); ?></div>
                <div class="info-item share" data-link="<?php $relatedPosts->permalink() ?>" title="手机扫一扫">
                  <i class="icon icon-share"></i>分享
                  <div class="share-panel hide">
                    <div class="qr-code-tooltip">
                      <div class="qr-code-head"><i class="icon icon-saoyisao"></i>手机扫一扫</div>
                      <div class="qr-code-body"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <?php $thumbnail = get_ArticleThumbnail($relatedPosts);?>
            <?php if($thumbnail !== ""): ?>
            <div class="item-body-right">
              <img data-src="<?php echo $thumbnail;?>" src="<?php themeUrl('static/images/tool/img-loading.gif');?>" alt="<?php $relatedPosts->title() ?>">
            </div>
            <?php endif;?>
          </div>
        </div>
      <?php endwhile; ?>  
    </div>
  </div> 
<?php endif; ?>