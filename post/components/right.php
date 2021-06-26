<div class="post-right">
  <?php //关于作者?>
  <div class="about-author">
    <div class="head">
      <h2 class="title">关于作者</h2>
    </div>
    <div class="body">
      <div class="user-info">
        <div class="avatar">
           <?php $this->author->gravatar(80); ?> 
        </div>
        <div class="info">
          <h3 class="name"> <a href="<?php $this->author->permalink(); ?>"><?php $this->author(); ?></a></h3>
          <div class="description" title="<?php $this->options->description() ?>"><?php $this->options->description() ?></div>
        </div>
      </div>
      <div class="stat-warp">
        <div class="stat-item">
          <i class="icon icon-line-medalxunzhang-01"></i>站点职位 <?php zhGroup($this->author->uid);?>
        </div>
        <div class="stat-item">
          <i class="icon icon-like-fill"></i>获得点赞 <?php echo getLikeCount($this->cid); ?>
        </div>
        <div class="stat-item">
          <i class="icon icon-eye-fill"></i>文章被阅读 <?php views($this); ?>
        </div>
      </div>
    </div>
  </div>
  <?php //相关文章?>
  <?php $this->related(5,"author")->to($authorArticle); ?> 
  <?php if ($authorArticle->have()): ?> 
  <div class="author-article">
    <div class="head">
      <h2 class="title">相关文章</h2>
    </div>
    <div class="body">
      <?php while ($authorArticle->next()): ?>
        <div class="item">
          <a href="<?php $authorArticle->permalink(); ?>"><?php $authorArticle->title(); ?><?php $authorArticle->title(); ?></a>
        </div>
      <?php endwhile; ?> 
    </div>
  </div>
  <?php endif; ?>
  <?php //目录树?>
  <div id="catalog-tree">
    <div class="head">
      <h2 class="title">目录树</h2>
    </div>
    <div class="body">
      <?php getCatalog(); ?>
    </div>
  </div>
</div>