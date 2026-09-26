<?php // markdown内容 ?>

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
$content = todoListFormatted($content);
//回复可见
if ($this->user->hasLogin() || $result) {
    $content = preg_replace("/\[hide\](<br>)?(.*?)\[\/hide\]/sm", '$2', $content);
} else {
    $content = preg_replace("/\[hide\](.*?)\[\/hide\]/sm", '<div class="respond-visible">此处内容已隐藏<a  href="#comments">回复</a>后方可阅读。</div>', $content);
}

echo $content;
?>