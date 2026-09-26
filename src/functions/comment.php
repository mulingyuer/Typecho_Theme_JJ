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
                $val = Typecho_Widget::widget('Widget_Abstract_Contents')->push($val);
                $title = htmlspecialchars($val['title']);
                $permalink = $val['permalink'];
            }
        }
    }

    return array(
        'title' => $title,
        'permalink' => $permalink,
    );
}

