<div class="page-left"">
  <div class="content">
    <?php //骨架?>
    <?php $this->need("post/components/post-skeleton.php");?>
    <div class="content-warp">
      <div class="page-head">
        <a class="avatar" href="<?php $this->author->permalink(); ?>" >
          <?php $this->author->gravatar(80); ?> 
        </a>
        <div class="info">
          <h3 class="title">
            <a href="<?php $this->author->permalink(); ?>"><?php $this->author(); ?></a>
          </h3>
        <p class="subtitle">
          <time datetime="<?php $this->date('c'); ?>" itemprop="datePublished"><?php $this->date("Y年m月d日"); ?></time>
          <span>阅读：<?php views($this); ?></span>
        </p>
        </div>
        <?php if ($this->user->hasLogin()) : ?>
          <a class="edit" href="<?php $this->options->adminUrl(); ?>write-<?php if ($this->is('post')) : ?>post<?php else : ?>page<?php endif; ?>.php?cid=<?php echo $this->cid; ?>" target="_self">编辑</a>
        <?php endif; ?>
      </div>
      <div class="page-end-time">
        最后更新：<?php echo date('Y/m/d/ G:i:s' , $this->modified); ?>
      </div>
      <div class="page-content">
        <h1 class="page-title" itemprop="name headline"><?php $this->title() ?></h1>
        <div id="markdown">
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
            //灯箱
            $content = preg_replace_callback('%<img src="(.*?)" alt="(.*?)" title="(.*?)">%sm',function($match){
            return '<a class="gallery" href="'.urldecode($match[1]).'" data-src="'.urldecode($match[1]).'"><img src="'.urldecode($match[1]).'" alt="'.$match[2].'" title="'.$match[3].'"></a>';
            },$content);
            //todo
            $content = preg_replace('/\[x\]/sm', '<i class="icon icon-check-square todo"></i> ', $content);
            $content = preg_replace('/\[\s\]/sm', '<i class="icon icon-border todo"></i> ', $content);
            //代码高亮
            $content = preg_replace('%<pre>(.*?)</pre>%sm', '<pre class="line-numbers">$1</pre>', $content);
            //表格
            $content = preg_replace('/<table>(.*?)<\/table>/sm', '<div class="table-responsive"><table>$1</table></div>', $content);
            //回复可见
            if ($this->user->hasLogin() || $result) {
              $content = preg_replace("/\[hide\](<br>)?(.*?)\[\/hide\]/sm", '<fieldset class="respond-view"><legend>隐藏的内容</legend><div class="layui-field-box">$2</div></fieldset>', $content);
            } else {
              $content = preg_replace("/\[hide\](.*?)\[\/hide\]/sm", '<div class="respond-visible">此处内容已隐藏<a  href="#comments">回复</a>后方可阅读。</div>', $content);
            }
            echo $content
          ?>
        </div>
      </div>
      <div class="page-declaration">
        <h3 class="title">版权申明</h3>
        <p class="subtitle">本文系作者 <a href="<?php $this->author->permalink(); ?>">@<?php $this->author(); ?></a> 原创发布在<?php $this->options->title(); ?>站点。未经许可，禁止转载。</p>     
      </div>
      <div class="page-footer">
      <?php $this->need("components/comments/index.php");?>     
      </div>
    </div>
  </div>
</div>