<?php
// 通知列表分页：数据准备 + 到底 404 约定，实际渲染走通用分页组件
// $pagedComments 由 list.php 查询后挂到 $this（Archive 对象）共享，
// 因为 need() 引入的各文件运行在独立方法调用栈，局部变量无法跨文件读取
$pagedComments = $this->pagedComments ?? array('list' => array(), 'hasMore' => false);
$hasMore = $pagedComments['hasMore'] ?? false;
$currentPage = max(1, intval($this->currentPage));

// 已翻页但当前页没有数据（超出最后一页）：返回 404 + no-more 片段，
// 供 request 拦截器识别为 NoMoreError（与文章分页的到底约定一致）
if ($currentPage > 1 && !$hasMore && empty($pagedComments['list'])) {
    $this->response->setStatus(404);
}

// 独立页没有 page_page 路由（路由表仅 page => /[slug].html），
// 无法用 pageLink()（其内部 Router::url('page_page') 会返回 '#'）。
// Archive::execute() 对任意 Archive 都会用 request 的 page 参数初始化 currentPage，
// 因此用 ?page=N 查询参数传页码（官方后台评论分页 Widget\Comments\Admin::pageNav() 同款写法），
// 不受伪静态开关影响：index.php/notification.html?page=N 与 rewrite 后 notification.html?page=N 均生效。
$nextPageUrl = $this->request->makeUriByRequest('page=' . ($currentPage + 1));
$prevPageUrl = $currentPage > 1 ? $this->request->makeUriByRequest('page=' . ($currentPage - 1)) : null;

// 外包一层 div 便于通知页单独做布局/样式；内部仍是通用分页组件输出的
// .jj-pagination / .jj-pagination-button，JS 选择器按类名全局查找不受影响
?>
<div class="notification-pagination-wrap">
<?php
renderPagination($this, array(
    'type'    => $this->options->notificationPaginationType === 'button' ? 'button' : 'infinite',
    'nextUrl' => $nextPageUrl,
    'prevUrl' => $prevPageUrl,
    'hasMore' => $hasMore,
    'hidden'  => false,
));
?>
</div>
