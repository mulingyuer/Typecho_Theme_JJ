<?php
/**
 * 通用分页组件模板
 * ---------------------
 * 由 renderPagination() 调用，配置挂到 Archive 对象属性上传递
 * （need() 在 Widget 方法调用栈内 include，读不到函数局部变量）：
 * @var Widget_Archive $this  归档对象，$this->paginationOptions 为分页配置（默认值已合并）
 *
 * 使用文档见同目录 README.md
 */
$paginationOptions = $this->paginationOptions ?? null;
if (!is_array($paginationOptions)) {
    return;
}
// pageNav() 必须走评论 Widget（$this->comments()）：文章页/独立页中 $this 是
// Widget\Archive，其 $countSql 未初始化（Typed property 未赋值），调 pageNav() 会
// 抛 Error。renderPagination() 可通过 $options['navWidget'] 传入正确的 Widget。
$archive = $this;
if (isset($paginationOptions['navWidget']) && is_object($paginationOptions['navWidget'])) {
    $archive = $paginationOptions['navWidget'];
}

$type = $paginationOptions['type'] === 'button' ? 'button' : 'infinite';
$prevText = $paginationOptions['prevText'];
$nextText = $paginationOptions['nextText'];
$noMoreText = $paginationOptions['noMoreText'];
$nextUrl = $paginationOptions['nextUrl'];
$prevUrl = $paginationOptions['prevUrl'];
$hasMore = $paginationOptions['hasMore'];
$hiddenClass = $paginationOptions['hidden'] ? ' hidden' : '';
?>

<?php if ($type === 'infinite'): ?>
  <?php
// infinite 模式：隐藏的 prev/next 链接供 JS 读取地址，loading/no-more 由 class 控制显隐。
// nextUrl 为空时退化为 no-more 首屏态（无下一页），与 notification 旧实现一致。
$isManual = is_string($nextUrl) || is_string($prevUrl);
$manualNoMore = $isManual && $hasMore === false;
?>
  <div class="jj-pagination jj-pagination--infinite<?php echo $hiddenClass;
echo $manualNoMore ? ' no-more' : ''; ?>">
    <div class="jj-pagination-content">
      <?php if ($isManual): ?>
        <?php if ($prevText !== null && $prevText !== false && is_string($prevUrl) && $prevUrl !== ''): ?>
          <a class="prev" href="<?php echo htmlspecialchars($prevUrl, ENT_QUOTES, 'UTF-8'); ?>"><?php echo $prevText; ?></a>
        <?php endif;?>
        <?php if ($nextText !== null && $nextText !== false && is_string($nextUrl) && $nextUrl !== '' && $hasMore !== false): ?>
          <a class="next" href="<?php echo htmlspecialchars($nextUrl, ENT_QUOTES, 'UTF-8'); ?>"><?php echo $nextText; ?></a>
        <?php endif;?>
      <?php else: ?>
        <?php if ($prevText !== null && $prevText !== false): ?>
          <?php $archive->pageLink($prevText, 'prev');?>
        <?php endif;?>
        <?php if ($nextText !== null && $nextText !== false): ?>
          <?php $archive->pageLink($nextText, 'next');?>
        <?php endif;?>
      <?php endif;?>
      <img class="jj-pagination-loading" src="<?php $archive->options->themeUrl($paginationOptions['loadingImg']);?>" alt="<?php echo _t('加载中'); ?>">
      <span class="jj-pagination-no-more"><?php echo $noMoreText; ?></span>
    </div>
  </div>
<?php else: ?>
  <?php
// button 模式
$isManual = is_string($nextUrl) || is_string($prevUrl);
if ($isManual) {
    // 手工模式：无法使用 pageNav() 的场景（如独立页无 page_page 路由），仅输出 prev/next 两个链接
    $hasPrev = $prevText !== null && $prevText !== false && is_string($prevUrl) && $prevUrl !== '';
    $hasNext = $nextText !== null && $nextText !== false && is_string($nextUrl) && $nextUrl !== '' && $hasMore !== false;
    if ($hasPrev || $hasNext) {
        echo '<ul class="jj-pagination-button' . $hiddenClass . '">';
        if ($hasPrev) {
            echo '<li class="prev"><a href="' . htmlspecialchars($prevUrl, ENT_QUOTES, 'UTF-8') . '">' . $prevText . '</a></li>';
        }
        if ($hasNext) {
            echo '<li class="next"><a href="' . htmlspecialchars($nextUrl, ENT_QUOTES, 'UTF-8') . '">' . $nextText . '</a></li>';
        }
        echo '</ul>';
    } else {
        echo '<div class="jj-pagination-button-no-more' . $hiddenClass . '">' . $noMoreText . '</div>';
    }
} else {
    // pageNav() 无内容输出时（仅一页）显示 no-more；与旧 article-pagination 实现一致：
    // pageNav 对当前页/省略项输出 <li><span>...</span></li>，这里剔除只保留可点击链接
    $prev = $prevText === null || $prevText === false ? '' : $prevText;
    $next = $nextText === null || $nextText === false ? '' : $nextText;
    ob_start();
    $archive->pageNav($prev, $next, $paginationOptions['pageSize'], '...', array(
        'wrapTag'      => 'ul',
        'wrapClass'    => 'jj-pagination-button' . $hiddenClass,
        'itemTag'      => 'li',
        'textTag'      => 'span',
        'currentClass' => 'active',
        'prevClass'    => 'prev',
        'nextClass'    => 'next',
    ));
    $pageNavContent = ob_get_contents();
    ob_end_clean();

    if (empty($pageNavContent)) {
        // 仅骨架屏场景（hidden）输出 no-more 兜底；非骨架场景（如评论分页）与
        // Typecho 原生行为一致：不足一页时什么都不输出
        if ($paginationOptions['hidden']) {
            echo '<div class="jj-pagination-button-no-more' . $hiddenClass . '">' . $noMoreText . '</div>';
        }
    } else {
        $pageNavContent = preg_replace("/<li><span>(.*?)<\/span><\/li>/sm", '', $pageNavContent);
        echo $pageNavContent;
    }
}
?>
<?php endif;?>
