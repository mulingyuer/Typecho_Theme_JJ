<?php
if (!defined('__TYPECHO_ROOT_DIR__')) {
    exit;
}

            $zhUserGroup = '访客';
    }

    if (empty($zhUserGroup)) {
        $zhUserGroup = '未知用户';
    }
    return $zhUserGroup;
}

/**
 * @description: 给文章内容标题添加锚点
 * @param {*} $content 文章内容
 * @Date: 2023-03-23 20:43:02
 * @Author: mulingyuer
 */
function addAnchorPoint($content)
{
    global $catalog;
    global $catalog_count;
    $catalog = array();
    $catalog_count = 0;
    $content = preg_replace_callback('/<h([1-6])(.*?)>(.*?)<\/h\1>/i', function ($content) {
        global $catalog;
        global $catalog_count;
        $catalog_count++;
        $catalog[] = array('text' => trim(strip_tags($content[3])), 'depth' => $content[1], 'count' => $catalog_count);
        return '<h' . $content[1] . $content[2] . ' id="heading-' . $catalog_count . '">' . $content[3] . '</h' . $content[1] . '>';
    }, $content);
    return $content;
}

/**
 * @description: 获取文章目录树
 * @Date: 2023-03-23 20:36:47
 * @Author: mulingyuer
 */
function getDirectoryTree()
{
    global $catalog;
    $index = '';
    if ($catalog) {
        $index = '<ul class="directory-tree-list">' . "\n";
        $prev_depth = '';
        $to_depth = 0;
        foreach ($catalog as $catalog_item) {
            $catalog_depth = $catalog_item['depth'];
            if ($prev_depth) {
                if ($catalog_depth == $prev_depth) {
                    $index .= '' . "\n";
                } elseif ($catalog_depth > $prev_depth) {
                    $to_depth++;
                    $index .= '<ul class="directory-tree-sub-list">' . "\n";
                } else {
                    $to_depth2 = ($to_depth > ($prev_depth - $catalog_depth)) ? ($prev_depth - $catalog_depth) : $to_depth;
                    if ($to_depth2) {
                        for ($i = 0; $i < $to_depth2; $i++) {
                            $index .= '' . "\n" . '</ul>' . "\n";
                            $to_depth--;
                        }
                    }
                    $index .= '';
                }
            }
            $index .= '<li class="directory-tree-list-item"><div class="directory-tree-list-item-container"><a class="directory-tree-list-item-link" href="#heading-' . $catalog_item['count'] . '" data-scroll="#heading-' . $catalog_item['count'] . '" title="' . $catalog_item['text'] . '"><i class="jj-icon jj-icon-send directory-tree-list-item-icon"></i>' . $catalog_item['text'] . '</a></div>';
            $prev_depth = $catalog_item['depth'];
        }
        for ($i = 0; $i <= $to_depth; $i++) {
            $index .= '' . "\n" . '</li></ul>' . "\n";
        }
        // $index = '<div id="toc-container">'."\n".'<div id="toc">'."\n".'<strong>文章目录</strong>'."\n".$index.'</div>'."\n".'</div>'."\n";
    }
    if (!$index) {
        echo '<ul class="directory-tree-list"><div class="directory-tree-list-empty">暂无目录</div></ul>';
    } else {
        echo $index;
    }
}

/**
 * @description: 获取目录树
 * @param {*} $maxDirectory 最大层级
 * @Date: 2023-06-03 22:30:49
 * @Author: mulingyuer
 */
function getJJDirectoryTree($maxDirectory = 3)
{
    global $catalog;
    $treeList = generateTreeList(array_replace_recursive(array(), $catalog));
    echo generateTreeTemplate($treeList, $maxDirectory);
}

/**
 * @description: 将扁平化目录树数组转成结构化目录树数组
 * @param {*} $list 目录树数组
 * @param {*} $depth  最大层级
 * @Date: 2023-06-03 15:42:21
 * @Author: mulingyuer
 */
function generateTreeList($list, $depth = 6)
{
    if (count($list) <= 0 || $depth <= 1) {
        return $list;
    }

    for ($i = count($list) - 1; $i >= 0; $i--) {
        $item = $list[$i];
        if ($item['depth'] == $depth) {
            $parentIndex = $i - 1;
            while ($parentIndex >= 0) {
                $parent = &$list[$parentIndex];
                if ($parent['depth'] < $depth) {
                    break;
                }
                $parentIndex--;
            }

            if ($parentIndex < 0) {
                break;
            }

            if (!isset($parent['children'])) {
                $parent['children'] = array();
            }

            array_unshift($parent['children'], $item);
            array_splice($list, $i, 1);
        }
    }

    $list = array_values($list);
    return generateTreeList($list, $depth - 1);
}

/**
 * @description: 删除目录树数组指定层级children
 * @param {*} $list 目录树数组
 * @param {*} $depth  最大层级
 * @param {*} $currentDepth 当前层级
 * @Date: 2023-06-03 15:49:03
 * @Author: mulingyuer
 */
function removeChildren($list, $depth, $currentDepth = 0)
{
    foreach ($list as &$item) {
        if (isset($item['children']) && count($item['children']) > 0) {
            if ($currentDepth < $depth - 1) {
                $item['children'] = removeChildren($item['children'], $depth, $currentDepth + 1);
            } else {
                unset($item['children']);
            }
        }
    }
    return $list;
}

/**
 * @description: 生成目录树html
 * @param {*} $arr 目录树数组
 * @param {*} $depth  最大层级
 * @param {*} $currentDepth 当前层级
 * @param {*} $isChildren 是否是子级
 * @Date: 2023-06-03 16:48:54
 * @Author: mulingyuer
 */
function generateTreeTemplate($arr, $depth, $currentDepth = 1, $isChildren = false)
{
    if (count($arr) <= 0) {
        return '<div class="directory-tree-list-empty">暂无目录</div>';
    }
    if ($currentDepth > $depth) {
        return '';
    }
    $output = !$isChildren ? '<ul class="directory-tree-list">' : '';
    foreach ($arr as $item) {
        $output .= '<li class="directory-tree-list-item depth-' . $currentDepth . '"><div class="directory-tree-list-item-link-wrapper"><a class="directory-tree-list-item-link" href="#heading-' . $item['count'] . '" title="' . $item['text'] . '">' . $item['text'] . '</a></div>';
        if (!empty($item['children']) && $currentDepth < $depth) {
            $output .= '<ul class="directory-tree-sub-list">';
            $output .= generateTreeTemplate($item['children'], $depth, $currentDepth + 1, true);
            $output .= '</ul>';
        }
        $output .= '</li>';
    }
    $output .= !$isChildren ? '</ul>' : '';
    return $output;
}

/**
 * 增加浏览次数
 * 使用方法: 在<code>themeInit</code>函数中添加代码
 * <pre>if($archive->is('single') || $archive->is('page')){ viewsCounter($archive);}</pre>
 *
 * @param Widget_Archive $widget
 * @return boolean
 */

function viewsCounter($widget, $field = 'views')
{
