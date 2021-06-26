<div class="page-right">
  <?php //关于作者?>
  <div class="about-author">
    <div class="head">
      <h2 class="title">页面信息</h2>
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
          <i class="icon icon-eye-fill"></i>页面被阅读 <?php views($this); ?>
        </div>
      </div>
    </div>
  </div>
 
  <?php //footer?>
  <?php $this->need("components/footer.php");?>
</div>