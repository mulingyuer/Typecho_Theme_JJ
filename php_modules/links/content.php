<div class="links-page-wrapper">
  <div class="links-page-content">
    <div class="links-page-head">
      <h1 class="links-page-title"><?php $this->title()?><?php if ($this->user->hasLogin()): ?><a href="<?php $this->options->adminUrl();?>write-<?php if ($this->is('post')): ?>post<?php else: ?>page<?php endif;?>.php?cid=<?php echo $this->cid; ?>" class="links-edit-btn" target="_self" title="编辑">编辑</a><?php endif;?></h1>
    </div>
    <div class="links-page-body">
        <?php
$db = Typecho_Db::get();
$sql = $db->select()->from('table.comments')
    ->where('cid = ?', $this->cid)
    ->where('mail = ?', $this->remember('mail', true))
    ->where('status = ?', 'approved')
//只有通过审核的评论才能看回复可见内容
    ->limit(1);
$result = $db->fetchAll($sql);
$content = $this->content;
//a链接增加_blank
$content = preg_replace('/<a href=\"(.*?)\">(.*?)<\/a>/sm', '<a href="$1" target="_blank">$2</a>', $content);
echo $content
?>
    </div>
  </div>
</div>