<?php //右边侧栏?>
<aside class="index-right">
  <!-- 最近评论 -->
  <div class="recent-comment">
    <div class="recent-head">
      <i class="icon icon-pinglunbeifen"></i>最近评论
    </div>
    <div class="recent-body">

      <?php $this->widget('Widget_Comments_Recent', 'pageSize=6')->to($comments); ?>
      <?php while ($comments->next()) : ?>
        <div class="item">
          <a class="link" href="<?php $comments->permalink(); ?>" target="_blank">
            <div class="comment-avatar">
              <?php $comments->gravatar(40); ?>
            </div>
            <div class="user-info">
              <h3 class="title"><?php $comments->author(false); ?></h3>
              <p class="subtitle"><?php $comments->excerpt(120); ?></p>
            </div>
          </a>
        </div>
      <?php endwhile; ?>

    </div>
    <div class="recent-footer">
      <a href="<?php $this->options->siteUrl(); ?>admin/manage-comments.php">管理评论<i class="icon icon-right"></i></a>
    </div>
  </div>
  <!-- 主题快捷工具 -->
  <div class="theme-tool">
    <div class="item">
      <a class="link" href="https://www.yuque.com/mulingyuer/ohl5ed" target="_blank">
        <div class="tool-pic">
          <img src="<?php themeUrl('common/images/tool/faq.png');?>" alt="faq">
        </div>
        <h3 class="title">FAQ主题使用指南</h3>
      </a>
    </div>
    <div class="item">
      <a class="link" href="<?php $this->options->feedUrl(); ?>" target="_blank">
        <div class="tool-pic">
          <img src="<?php themeUrl('common/images/tool/article-rss.png');?>" alt="文章RSS订阅">
        </div>
        <h3 class="title">博客文章RSS订阅</h3>
      </a>
    </div>
    <div class="item">
      <a class="link" href="<?php $this->options->commentsFeedUrl(); ?>" target="_blank">
        <div class="tool-pic">
          <img src="<?php themeUrl('common/images/tool/comments-rss.png');?>" alt="文章RSS订阅">
        </div>
        <h3 class="title">博客评论RSS订阅</h3>
      </a>
    </div>
  </div>
  <?php //footer?>
  <?php $this->need("components/footer.php");?>
  
</aside>