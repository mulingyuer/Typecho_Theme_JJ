<?php
if (!defined('__TYPECHO_ROOT_DIR__')) {
    exit;
}

/**
 * 给文章内容标题添加锚点
 *
 * 通过正则回调为文章中的 h1-h6 标题注入 id="heading-N" 锚点，
 * 同时把标题文本、层级、序号收集到全局 $catalog 数组中，
 * 供后续生成目录树使用。
 *
 * @param string $content 文章 HTML 内容
 * @return string 注入锚点后的 HTML 内容
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
 * 输出文章目录树 HTML
 *
 * 无标题时也输出外层 .directory-tree-list 容器，
 * 移动端目录树模块会把该列表整体搬到弹层中，依赖它存在。
 *
 * @param int $maxDirectory 最大展示的目录层级，默认 3
 * @return void
 */
function getJJDirectoryTree($maxDirectory = 3)
{
    global $catalog;
    if (empty($catalog)) {
        echo '<ul class="directory-tree-list"><div class="directory-tree-list-empty">暂无目录</div></ul>';
        return;
    }
    echo generateTreeTemplate(generateTreeList($catalog), $maxDirectory);
}

/**
 * 将扁平标题数组（文档顺序）构建成嵌套目录树
 *
 * 方案：单次遍历 + 栈，时间复杂度 O(n)，全程没有数组搬迁。
 * 栈中保存的每一项都是"当前层级路径上某个节点的引用"（栈顶为最近一个节点）：
 * - 遇到新节点时，先弹出所有层级不低于它的节点，剩下的栈顶即为其父节点；
 * - 有父节点则通过引用直接追加到父节点的 children 中（自然保持文档顺序）；
 * - 没有父节点（如文章以 h3 开头）则作为根节点。
 *
 * @param array $list 扁平目录数组，每项含 text/depth/count
 * @return array 嵌套目录树数组，子节点挂在 children 键下
 */
function generateTreeList($list)
{
    if (count($list) <= 0) {
        return $list;
    }

    $tree = array();
    // 引用栈：栈中每一项都指向 $tree 中对应节点的数组，可直接修改
    $stack = array();

    foreach ($list as $item) {
        $depth = (int) $item['depth'];
        $node = array('text' => $item['text'], 'depth' => $depth, 'count' => $item['count']);

        // 弹出所有层级不低于当前节点的节点，使栈顶成为当前节点的父节点（若存在）
        while (!empty($stack) && $stack[count($stack) - 1]['depth'] >= $depth) {
            array_pop($stack);
        }

        if (empty($stack)) {
            // 没有更浅层的前序节点，作为根节点
            $tree[] = $node;
            $stack[] = &$tree[count($tree) - 1];
        } else {
            // 取栈顶节点的引用，把当前节点挂到它的 children 末尾
            $parent = &$stack[count($stack) - 1];
            if (!isset($parent['children'])) {
                $parent['children'] = array();
            }
            $parent['children'][] = $node;
            $stack[] = &$parent['children'][count($parent['children']) - 1];
            unset($parent);
        }
    }

    return $tree;
}

/**
 * 根据嵌套树结构生成目录树 HTML
 *
 * 使用数组收集片段最后 implode，避免循环中大量字符串 .= 拼接的开销。
 * 超过 $depth 的层级会被截断不输出。
 *
 * @param array $arr          嵌套目录树数组（generateTreeList 的输出）
 * @param int   $depth        最大展示层级
 * @param int   $currentDepth 当前递归层级（内部使用）
 * @param bool  $isChildren   当前是否为子级调用（内部使用）
 * @return string 目录树 HTML
 */
function generateTreeTemplate($arr, $depth, $currentDepth = 1, $isChildren = false)
{
    if (count($arr) <= 0) {
        return '<div class="directory-tree-list-empty">暂无目录</div>';
    }
    if ($currentDepth > $depth) {
        return '';
    }

    $parts = array();
    if (!$isChildren) {
        $parts[] = '<ul class="directory-tree-list">';
    }
    foreach ($arr as $item) {
        $parts[] = '<li class="directory-tree-list-item depth-' . $currentDepth . '"><div class="directory-tree-list-item-link-wrapper"><a class="directory-tree-list-item-link" href="#heading-' . $item['count'] . '" title="' . $item['text'] . '">' . $item['text'] . '</a></div>';
        if (!empty($item['children']) && $currentDepth < $depth) {
            $parts[] = '<ul class="directory-tree-sub-list">';
            $parts[] = generateTreeTemplate($item['children'], $depth, $currentDepth + 1, true);
            $parts[] = '</ul>';
        }
        $parts[] = '</li>';
    }
    if (!$isChildren) {
        $parts[] = '</ul>';
    }
    return implode("\n", $parts);
}
