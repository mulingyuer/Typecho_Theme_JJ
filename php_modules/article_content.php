<article class="article-content" itemscope itemtype="http://schema.org/BlogPosting">
  <div class="article-content-card">
    <div class="article-content-card-head" itemprop="author" itemscope itemtype="http://schema.org/Person">
      <h1 class="article-content-title"><?php $this->title()?></h1>
      <div class="article-content-author">
        <a class="article-content-author-name"  href="<?php $this->author->permalink();?>" target="_self" itemprop="url" itemprop="name" rel="author"><?php $this->author();?></a>
        <time class="article-content-time" datetime="<?php $this->date('c');?>" itemprop="datePublished"><?php $this->date('Y-m-d H:i');?></time>
        <span class="article-content-views">
          <i class="jj-icon jj-icon-eye article-content-views-icon"></i><?php echo articleViews($this); ?>
        </span>
        <?php if ($this->user->hasLogin()): ?>
        <a class="article-content-edit-btn" href="<?php $this->options->adminUrl();?>write-<?php if ($this->is('post')): ?>post<?php else: ?>page<?php endif;?>.php?cid=<?php echo $this->cid; ?>" target="_self">编辑</a>
        <?php endif;?>
      </div>
    </div>
    <div class="article-content-card-body">
      <?php $titleImg = getArticleTitleImg($this);?>
      <?php if ($titleImg): ?>
        <img class="article-content-title-img" src="<?php echo $titleImg; ?>" alt="<?php $this->title()?>">
      <?php endif;?>
      <div id="markdown" class="article-content-markdown markdown-body">
        <?php
$db  = Typecho_Db::get();
$sql = $db->select()->from('table.comments')
    ->where('cid = ?', $this->cid)
    ->where('mail = ?', $this->remember('mail', true))
    ->where('status = ?', 'approved')
    ->limit(1);
//只有通过审核的评论才能看回复可见内容
$result  = $db->fetchAll($sql);
$content = $this->content;
//a链接增加_blank
$content = preg_replace('/<a href=\"(.*?)\">(.*?)<\/a>/sm', '<a href="$1" target="_blank">$2</a>', $content);
//todo
$content = preg_replace('/\[x\]/sm', '<i class="jj-icon jj-icon-check-square todo"></i> ', $content);
$content = preg_replace('/\[\s\]/sm', '<i class="jj-icon jj-icon-border todo"></i> ', $content);
//回复可见
if ($this->user->hasLogin() || $result) {
    $content = preg_replace("/\[hide\](<br>)?(.*?)\[\/hide\]/sm", '$2', $content);
} else {
    $content = preg_replace("/\[hide\](.*?)\[\/hide\]/sm", '<div class="respond-visible">此处内容已隐藏<a  href="#comments">回复</a>后方可阅读。</div>', $content);
}
echo $content;
?>
      </div>
    </div>
  </div>
</article>