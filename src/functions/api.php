<?php
if (!defined('__TYPECHO_ROOT_DIR__')) {
    exit;
}

/**
 * @description: 主题数据接口/数据查询函数集
 * 本次及以后类似的分页查询、AJAX 数据函数统一放这里，
 * 与 utils.php（模板小助手）、comment.php（评论渲染逻辑）区分开。
 * 涉及数据库的查询一律使用 Typecho_Db 构造器，零手写 SQL，三库通用。
 */

/** 通知页每页评论条数 */
define('NOTIFICATION_PAGE_SIZE', 20);

/**
 * @description: 分页查询评论（用于通知页）
 * 参照 Widget\Comments\Admin::execute() 的构造器写法，
 * 多取 1 条用于探测 hasMore，避免额外 COUNT 查询。
 * @param {int} $page 当前页码（从 1 开始）
 * @param {int} $pageSize 每页条数
 * @param {bool} $ignoreAuthor 是否忽略作者自己的评论（同 Widget_Comments_Recent 的 ignoreAuthor）
 * @return {array} ['list' => array, 'hasMore' => bool]
 */
function getPagedComments($page = 1, $pageSize = NOTIFICATION_PAGE_SIZE, $ignoreAuthor = true)
{
    $db = Typecho_Db::get();
    $page = max(1, intval($page));
    $pageSize = max(1, intval($pageSize));

    $select = $db->select()->from('table.comments')
        ->where('table.comments.status = ?', 'approved');

    // 忽略作者评论（沿用 Widget\Comments\Recent 官方写法，数字列比较，三库一致）
    if ($ignoreAuthor) {
        $select->where('table.comments.ownerId <> table.comments.authorId');
    }

    // 全限定名字段排序（PG 对未加引号标识符转小写，勿裸写 coid）
    // 多取 1 条探测是否还有下一页：limit 用 pageSize+1，但 offset 必须用 pageSize 计算，
    // 不能用 ->page($page, $pageSize+1)（它 limit/offset 共用同一个值，会导致页间 offset 错位）
    $select->order('table.comments.coid', Typecho_Db::SORT_DESC)
        ->offset(($page - 1) * $pageSize)
        ->limit($pageSize + 1);

    $rows = $db->fetchAll($select);

    $hasMore = count($rows) > $pageSize;
    if ($hasMore) {
        $rows = array_slice($rows, 0, $pageSize);
    }

    // 数值字段归一化：mysqli 取回 int，pgsql pg_fetch_assoc 取回 string，统一 intval 屏蔽差异
    $list = array_map(function ($row) {
        $row['coid'] = intval($row['coid']);
        $row['cid'] = intval($row['cid']);
        $row['created'] = intval($row['created']);
        $row['authorId'] = intval($row['authorId']);
        $row['ownerId'] = intval($row['ownerId']);
        $row['parent'] = intval($row['parent']);
        return $row;
    }, $rows);

    return array(
        'list' => $list,
        'hasMore' => $hasMore,
    );
}
