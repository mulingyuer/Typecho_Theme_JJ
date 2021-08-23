<?php //相关文章 ?>
<?php $this->related(10,NULL)->to($relatedPosts); ?> 
<?php if ($relatedPosts->have()): ?> 
  <div id="related-articles">
    <div class="head">
      <h2 class="title">相关推荐</h2>
    </div>
    <div class="content">
      <?php while ($relatedPosts->next()): ?>
        <section class="related-item" data-link="<?php $relatedPosts->permalink() ?>">
          <div class="article-info">
            <a href="<?php $relatedPosts->author->permalink(); ?>" class="author"><?php $relatedPosts->author(); ?></a>
            <span class="time"><?php timesince($relatedPosts->created);?></span>
            <?php $relatedPosts->category('<span class="classify-cut"></span>'); ?>
          </div>
          <div class="article-card-content">
            <div class="info-box">
              <div class="info-center">
                <a class="title" href="<?php $relatedPosts->permalink() ?>" title="<?php $relatedPosts->title() ?>">
                  <h2><?php $relatedPosts->title() ?></h2>
                </a>
                <p class="description"><?php $relatedPosts->excerpt(300); ?></p>
              </div>
              <div class="info-bottom">
                <a class="btn" href="javascript:;"><i class="icon icon-eye"></i><?php views($relatedPosts); ?></a>
                <a class="btn" href="javascript:;"><i class="icon icon-like"></i><?php echo getLikeCount($relatedPosts->cid); ?></a>
                <a class="btn comment" href="<?php $relatedPosts->permalink() ?>#comments"><i class="icon icon-message"></i><?php $relatedPosts->commentsNum(_t('0'), _t('1'), _t('%d ')); ?></a>
              </div>
            </div>
            <?php $thumbnail = get_ArticleThumbnail($relatedPosts);?>
            <?php if($thumbnail !== ""): ?>
            <div class="entry-img">
              <img data-src="<?php echo $thumbnail;?>" src="<?php themeUrl('static/images/tool/img-loading.gif');?>" alt="<?php $relatedPosts->title() ?>">
            </div>
            <?php endif;?>
          </div>
        </section>
      <?php endwhile; ?>  
    </div>
  </div> 
<?php endif; ?>