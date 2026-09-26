<?php
ob_start();
$this->theNext();
$next = ob_get_contents();
ob_end_clean();
if ($next):
?>
<?php preg_match_all('%<a href="(.*?)" title="(.*?)">(.*?)</a>%si', $next, $match);
$title = $match[2][0];
$href  = $match[1][0];
$text  = $match[3][0];?>
  <div class="next-article immersion-hide">
    <div class="next-article-content">
      <div class="next-article-head">
        <h3 class="next-article-title">下一篇</h3>
      </div>
      <div class="next-article-body">
        <a class="next-article-link" href="<?php echo $href; ?>" title="<?php echo $title; ?>"><?php echo $text; ?></a>
      </div>
    </div>
  </div>
<?php endif;?>