<?php
if (!defined('__TYPECHO_ROOT_DIR__')) {
    exit;
}

/**
 * @description: 子评论回复@
 * @param {*} $coid 评论id
 * @Date: 2023-03-24 13:36:10
 * @Author: mulingyuer
 */
function get_comment_at($coid)
{
    $db = Typecho_Db::get();
    $prow = $db->fetchRow($db->select('parent')->from('table.comments')
            ->where('coid = ? AND status = ?', $coid, 'approved')) ?? [];

    $parent = $prow['parent'] ?? '0';

    if ($parent !== '0') {
        $arow = $db->fetchRow($db->select('author')->from('table.comments')
                ->where('coid = ? AND status = ?', $parent, 'approved')) ?? [];
        $author = $arow['author'] ?? '';

        if ($author) {
            $href = '<a class="comment-list-item-relation" href="#comment-' . $parent . '">@' . $author . '</a>';
            echo $href;
        } else {
            echo '';
        }
    } else {
        echo '';
    }
}

/**
 * @description: 去除评论内容的p容器标签
 * @param {*} $content 评论内容
 * @Date: 2023-04-08 09:06:16
 * @Author: mulingyuer
 */
function remove_comment_p($content)
{
    $content = preg_replace("/^<p>(.*)<\/p>$/", '$1', $content);
    return $content;
}

/**
 * @description:  获取文章摘要
 * @param {*} $that 文章对象
 * @param {*} $maxLength 最大长度
 * @Date: 2023-03-25 00:12:20
 * @Author: mulingyuer
 */
function getArticleSummary($that, $maxLength = 80)
{
    $content = $that->excerpt;
    $abstract = Typecho_Common::fixHtml(Typecho_Common::subStr($content, 0, $maxLength, '...'));
    if (empty($abstract)) {
        $abstract = _t('暂无简介');
    }
    return urlencode(strip_tags($abstract));
}

/**
 * @description: 获取评论所属文章标题及链接
 * @param {*} $id
 * @Date: 2023-03-26 08:30:14
 * @Author: mulingyuer
 */
function getIdPosts($id)
{
    $permalink = '';
    $path = '';
    $title = '';

    if ($id) {
        $getid = explode(',', $id);
        $db = Typecho_Db::get();
        $result = $db->fetchAll($db->select()->from('table.contents')
                ->where('status = ?', 'publish')
                ->where('type = ?', 'post')
                ->where('cid in ?', $getid)
                ->order('cid', Typecho_Db::SORT_DESC)
        );
        if (!$result) {
            $result = $db->fetchAll($db->select()->from('table.contents')
                    ->where('status = ?', 'publish')
                    ->where('type = ?', 'page')
                    ->where('cid in ?', $getid)
                    ->order('cid', Typecho_Db::SORT_DESC)
            );
        }
        if ($result) {
            $i = 1;
            foreach ($result as $val) {
                // permalink/path 不是数据库字段，push() 返回的原始行数组里不存在，
                // 必须通过 widget 对象的魔术方法 __get 惰性计算（___permalink()/___path()）获取
                $contentWidget = Typecho_Widget::widget('Widget_Abstract_Contents');
                $val = $contentWidget->push($val);
                $title = htmlspecialchars($val['title']);
                $permalink = $contentWidget->permalink;
                $path = $contentWidget->path;
            }
        }
    }

    return array(
        'title' => $title,
        'permalink' => $permalink,
        'path' => $path,
    );
}

/**
 * @description: 计算评论在文章评论列表中的所在页码（复刻 Widget\Comments\Archive 分页规则）
 * @param {*} $cid 文章id
 * @param {*} $coid 评论id
 * @Date: 2026-10-10 22:20:00
 * @Author: mulingyuer
 */
function getCommentPageNum($cid, $coid)
{
    $options = Typecho_Widget::widget('Widget_Options');

    // 未开启评论分页，固定第 1 页
    if (empty($options->commentsPageBreak)) {
        return 1;
    }

    $db = Typecho_Db::get();
    $select = $db->select('coid', 'parent')->from('table.comments')
        ->where('cid = ?', $cid)
        ->where('status = ?', 'approved')
        ->order('coid', Typecho_Db::SORT_ASC);

    // 与官方评论组件保持一致：仅评论、排除 trackback/pingback
    if (!empty($options->commentsShowCommentOnly)) {
        $select->where('type = ?', 'comment');
    }

    $rows = $db->fetchAll($select);

    // 官方分页规则：楼中楼回复挂在父评论下，只有顶层评论参与分页
    $topLevelCoids = array();
    foreach ($rows as $row) {
        if (empty($row['parent'])) {
            $topLevelCoids[] = intval($row['coid']);
        }
    }

    // 评论列表倒序显示时，新评论在第 1 页
    if ('DESC' === $options->commentsOrder) {
        $topLevelCoids = array_reverse($topLevelCoids);
    }

    // 定位评论：回复评论跟随其顶层父评论定位
    $coid = intval($coid);
    $position = array_search($coid, $topLevelCoids, true);
    if (false === $position) {
        $topMap = array();
        foreach ($rows as $row) {
            $topMap[intval($row['coid'])] = intval($row['parent']);
        }
        while (!empty($topMap[$coid])) {
            $coid = $topMap[$coid];
        }
        $position = array_search($coid, $topLevelCoids, true);
    }

    // 找不到（评论已删除/未过审）时兜底第 1 页
    if (false === $position) {
        return 1;
    }

    $pageSize = max(1, intval($options->commentsPageSize));
    return intval(floor($position / $pageSize)) + 1;
}

/**
 * @description: 评论所在页是否为文章默认页（无 comment-page 分段时显示的页）
 * 复刻 Widget\Comments\Archive 规则：commentsPageDisplay=last 时默认显示最后一页，否则第 1 页
 * @param {*} $pageNum 评论所在页码
 * @param {*} $cid 文章id
 * @Date: 2026-10-10 23:10:00
 * @Author: mulingyuer
 */
function isCommentDefaultPage($pageNum, $cid)
{
    $options = Typecho_Widget::widget('Widget_Options');

    if ('last' !== $options->commentsPageDisplay) {
        return 1 === $pageNum;
    }

    // 默认显示最后一页：总页数 = ceil(顶层评论数 / 每页条数)
    $db = Typecho_Db::get();
    $select = $db->select(array('COUNT(coid)' => 'num'))->from('table.comments')
        ->where('cid = ?', $cid)
        ->where('status = ?', 'approved')
        ->where('parent = ?', 0);
    if (!empty($options->commentsShowCommentOnly)) {
        $select->where('type = ?', 'comment');
    }
    $topCount = intval($db->fetchObject($select)->num);

    $pageSize = max(1, intval($options->commentsPageSize));
    $lastPage = max(1, intval(ceil($topCount / $pageSize)));
    return $pageNum === $lastPage;
}

/**
 * @description: 生成跳转评论的完整链接（含评论分页段），如 .../archives/1116/comment-page-2#comment-6130
 * @param {*} $permalink 文章链接
 * @param {*} $path 文章路径（不含域名，如 /index.php/archives/1116/）
 * @param {*} $cid 文章id
 * @param {*} $coid 评论id
 * @Date: 2026-10-10 22:20:00
 * @Author: mulingyuer
 */
function getCommentReplyUrl($permalink, $path, $cid, $coid)
{
    if (empty($permalink)) {
        return '#comment-' . intval($coid);
    }

    $options = Typecho_Widget::widget('Widget_Options');
    $pageNum = getCommentPageNum($cid, $coid);
    $base = $permalink;

    // 评论不在默认页时，才需要拼 comment-page-N 分段
    if (!empty($path) && !isCommentDefaultPage($pageNum, $cid)) {
        // 与官方评论分页一致，走 comment_page 路由生成 .../comment-page-N
        $base = Typecho_Router::url('comment_page', array(
            'permalink' => $path,
            'commentPage' => $pageNum,
        ), $options->index);
    }

    return $base . '#comment-' . intval($coid);
}

