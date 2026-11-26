<?php
if (!defined('__TYPECHO_ROOT_DIR__')) {
    exit;
}

/**
 * @description: 生成相对于当前主题目录的资源 URL
 * @param string $path 资源路径，例如 /images/favicon/favicon.svg
 * @return string
 */
function themeResourceUrl($path = '')
{
    $themeUrl = rtrim((string) Helper::options()->themeUrl, '/');
    $path = ltrim((string) $path, '/');

    return $path === '' ? $themeUrl : $themeUrl . '/' . $path;
}

/**
 * @description: 转义头部模板中的动态 HTML 文本或属性值
 * @param mixed $value
 * @return string
 */
function headEscape($value)
{
    return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');
}

/**
 * @description: 兼容解析文章自定义字段。
 * Typecho 1.3 起 $archive->fields 为对象，旧版本为 serialize 字符串，统一转为数组返回。
 * @param {*} $fields 原始 fields 值（对象或字符串）
 * @return array
 */
function parseFields($fields)
{
    if (is_array($fields)) {
        return $fields;
    }
    if (is_object($fields)) {
        // Typecho\Config 实现了 ArrayAccess，get_object_vars() 读不到其内部数组，优先 toArray()
        if (method_exists($fields, 'toArray')) {
            return (array) $fields->toArray();
        }
        return get_object_vars($fields);
    }
    if (is_string($fields) && $fields !== '') {
        $parsed = @unserialize($fields);
        if (is_array($parsed)) {
            return $parsed;
        }
    }
    return array();
}

/**
 * @description: 应用主题设置中的 Gravatar 头像源，define __TYPECHO_GRAVATAR_PREFIX__ 常量。
 * 系统 config.inc.php 已定义时不覆盖（系统配置优先）。
 * 必须在任何模板渲染前调用（functions/index.php 顶部）。
 * @return void
 */
function applyGravatarPrefix()
{
    if (defined('__TYPECHO_GRAVATAR_PREFIX__')) {
        return;
    }
    $source = Helper::options()->gravatarSource;
    if (!is_string($source) || $source === '') {
        return;
    }
    if ($source === 'custom') {
        $custom = trim((string)Helper::options()->gravatarSourceCustom);
        if ($custom !== '') {
            define('__TYPECHO_GRAVATAR_PREFIX__', rtrim($custom, '/') . '/');
        }
        return;
    }
    define('__TYPECHO_GRAVATAR_PREFIX__', $source);
}

/**
 * @description: 获取当前生效的 Gravatar 头像源前缀（含已 define 的常量或官方默认）
 * @return string
 */
function getGravatarPrefix()
{
    if (defined('__TYPECHO_GRAVATAR_PREFIX__')) {
        return __TYPECHO_GRAVATAR_PREFIX__;
    }
    return 'https://secure.gravatar.com/avatar/';
}

/**
 * @description: 文章发布时间
 * @param {*} $time 原文章发布时间
 * @Date: 2023-03-19 16:58:25
 * @Author: mulingyuer
 */
function timeFormatting($time)
{
    if ($time == 'no') {
        return;
    }
    $chunks = array(
        array(31536000, '年'),
        array(2592000, '月'),
        array(604800, '周'),
        array(86400, '天'),
        array(3600, '小时'),
        array(60, '分钟'),
        array(1, '秒'),
    );
    $newer_date = time();
    $since = abs($newer_date - $time);

    for ($i = 0, $j = count($chunks); $i < $j; $i++) {
        $seconds = $chunks[$i][0];
        $name = $chunks[$i][1];
        if (($count = floor($since / $seconds)) != 0) {
            break;
        }
    }
    $output = $count . $name . '前';

    echo $output;
}

/**
 * @description: 获取文章缩略图
 * 优先级：自定义字段 titleImg/thumb > 正文 HTML 图片 > 正文 Markdown 图片 > 附件图片
 * 附件查询仅在前面分支均无结果时执行，避免列表页每篇文章多查一次附件表。
 * @param {*} $that
 * @Date: 2023-03-19 17:03:31
 * @Author: mulingyuer
 */
function articleThumbnail($that)
{
    static $cache = array();
    $cid = isset($that->cid) ? (int) $that->cid : 0;
    if ($cid && array_key_exists($cid, $cache)) {
        return $cache[$cid];
    }

    $thumbnail = '';
    $fields = parseFields($that->fields);

    if (!empty($fields['titleImg'])) {
        $thumbnail = $fields['titleImg'];
    } elseif (!empty($fields['thumb'])) {
        $thumbnail = $fields['thumb'];
    } elseif (preg_match('/<img.*?src="(.*?)"[^>]*>/i', $that->content, $matches) && strlen($matches[1]) > 7) {
        $thumbnail = $matches[1];
    } elseif (preg_match('/\!\[.*?\]\((.*?)\)/i', $that->content, $matches) && strlen($matches[1]) > 7) {
        $thumbnail = $matches[1];
    } else {
        $attach = $that->attachments(1)->attachment;
        if ($attach && $attach->isImage) {
            $thumbnail = $attach->url;
        }
    }

    if ($cid) {
        $cache[$cid] = $thumbnail;
    }
    return $thumbnail;
}

/**
 * @description: 文章浏览量
 * @param {*} $that 当前页面对象
 * @param {*} $format0
 * @param {*} $format1
 * @param {*} $formats
 * @param {*} $return
 * @param {*} $field
 * @Date: 2023-03-19 17:07:55
 * @Author: mulingyuer
 */
function articleViews($that, $format0 = '%d', $format1 = '%d', $formats = '%d', $return = false, $field = 'views')
{
    $fields = parseFields($that->fields);
    if (array_key_exists($field, $fields)) {
        $fieldValue = (!empty($fields[$field])) ? intval($fields[$field]) : 0;
    } else {
        $fieldValue = 0;
    }
    if ($fieldValue == 0) {
        $fieldValue = sprintf($format0, $fieldValue);
    } elseif ($fieldValue == 1) {
        $fieldValue = sprintf($format1, $fieldValue);
    } else {
        $fieldValue = sprintf($formats, $fieldValue);
    }
    if ($return) {
        return $fieldValue;
    } else {
        return $fieldValue;
    }
}

/**
 * @description: 文章点赞数
 * @param {*} $that 当前页面对象
 * @Date: 2023-03-24 23:19:56
 * @Author: mulingyuer
 */
function getLikeCount($that)
{
    $fields = parseFields($that->fields);
    $linkCount = isset($fields['likes']) ? $fields['likes'] : 0;
    if (empty($linkCount)) {
        return 0;
    }
    return $linkCount;
}

/**
 * Post Action AJAX接口 点赞接口
 *
 * @param Widget_Archive $widget
 * @return void
 * @date 2020-05-04
 */
function promo($widget)
{

    $user = $widget->widget('Widget_User');
    $db = Typecho_Db::get();
    $fields = parseFields($widget->fields);
    $allowOperates = array('get', 'set', 'inc', 'dec'); // 这里可以扩展操作，建议屏蔽get/set
    $allowFields = array('likes'); // 这里可以扩展修改字段

    // 获取操作
    $operate = $widget->request->get('operate');
    $field = $widget->request->get('field');
    $value = $widget->request->filter('int')->get('value');
    $value = $value === null ? 100 : $value; // 100 起步

    $result = array('cid' => $widget->cid);

    if ($operate === 'get') {
        $result['operate'] = 'get';
        if (array_key_exists($field, $fields)) {
            $result[$field] = $fields[$field];
        } else {
            $result[$field] = -1;
        }
        $widget->response->throwJson(array('status' => 1, 'msg' => _t('已获取参数'), 'result' => json_encode($result)));
    } elseif ($operate === 'set') {
        $result['operate'] = 'set';
        if ($value > 0) {
            $widget->setField($field, 'str', $value, $widget->cid);
        } else {
            $db->query($db->delete('table.fields')
                ->where('cid = ? AND name = ?', $widget->cid, $field));
        }
        $widget->response->throwJson(array('status' => 1, 'msg' => _t('已完成操作'), 'result' => json_encode($result)));
    } elseif ($operate === 'inc') {
        $result['operate'] = 'inc';
        $value = intval($fields[$field]) + 1;
        $widget->setField($field, 'str', $value, $widget->cid);
        $result[$field] = $value;
        $widget->response->throwJson(array('status' => 1, 'msg' => _t('已完成操作'), 'result' => json_encode($result)));
    } elseif ($operate === 'dec') {
        $result['operate'] = 'dec';
        $value = intval($fields[$field]) - 1;
        $result[$field] = $value;
        if ($value > 0) {
            $widget->setField($field, 'str', $value, $widget->cid);
        } else {
            $db->query($db->delete('table.fields')
                ->where('cid = ? AND name = ?', $widget->cid, $field));
        }
        $widget->response->throwJson(array('status' => 1, 'msg' => _t('已完成操作'), 'result' => json_encode($result)));
    }
}

/**
 * @description: 是否是ajax请求
 * @Date: 2023-03-21 00:22:09
 * @Author: mulingyuer
 */
function isAjax()
{
    if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
        return true;
    }
    return false;
}

/**
 * @description: 获取所有独立页，包括隐藏的
 * @Date: 2023-03-21 19:43:52
 * @Author: mulingyuer
 */
function getAllPages()
{
    $db = Typecho_Db::get();
    if (class_exists('\Typecho\Widget')) {
        $widget = \Widget\Contents\Page\Rows::alloc();
        foreach (
            array(
                'stack' => array(),
                'row' => array(),
                'length' => 0,
            ) as $name => $val
        ) {
            try {
                $reflect = new ReflectionClass($widget);
                $property = $reflect->getProperty($name);
                $property->setAccessible(true);
                $property->setValue($widget, $val);
            } catch (ReflectionException $e) {
            }
        }
    } else {
        $widget = new Widget_Contents_Page_List(Typecho_Request::getInstance(), Typecho_Widget_Helper_Empty::getInstance(), null);
    }
    $db->fetchAll($db->select()
        ->from('table.contents')
        ->where('table.contents.type = ?', 'page')
        ->where('table.contents.status = ? or table.contents.status = ?', 'publish', 'hidden')
        ->where('table.contents.created < ?', Helper::options()->time), array($widget, 'push'));
    return $widget;
}

/**
 * @description: 获取指定隐藏分页地址
 * @param {*} $page 分页对象
 * @param {*} $name 分页名称
 * @Date: 2023-03-21 19:32:45
 * @Author: mulingyuer
 */
function getHidePage($page, $name)
{
    $link = [
        "title" => "",
        "href" => "",
    ];

    getAllPages()->to($page);
    while ($page->next()) {
        if ($page->slug === $name) {
            $link["title"] = $page->title;
            $link["href"] = $page->permalink;
            break;
        }
    }

    return $link;
}

/**
 * @description: 自定义关键字
 * @Date: 2023-03-22 20:28:04
 * @Author: mulingyuer
 */
if ($_SERVER['SCRIPT_NAME'] == __TYPECHO_ADMIN_DIR__ . 'write-post.php' || $_SERVER['SCRIPT_NAME'] == __TYPECHO_ADMIN_DIR__ . 'write-page.php') {
    function themeFields($layout)
    {
        global $markdownThemeMap;
        global $markdownHighlightMap;
        //文章独享关键字
        if ($_SERVER['SCRIPT_NAME'] == __TYPECHO_ADMIN_DIR__ . 'write-post.php') {

            //自定义文章缩略图
            $thumb = new Typecho_Widget_Helper_Form_Element_Text('thumb', null, null, _t('自定义缩略图'), _t('输入缩略图地址(仅文章有效)<style>.wmd-button-row {height:auto;}</style>'));
            $layout->addItem($thumb);
            //文章内容标题图
            $titleImg = new Typecho_Widget_Helper_Form_Element_Text('titleImg', null, null, _t('自定义文章内容标题图'), _t('输入文章内容标题图地址(仅文章有效)<style>.wmd-button-row {height:auto;}</style>'));
            $layout->addItem($titleImg);
        }
        // 文章主题
        $markdownTheme = new Typecho_Widget_Helper_Form_Element_Select('markdownTheme', $markdownThemeMap, 'juejin', _t('文章主题'), _t('默认使用掘金主题'));
        $layout->addItem($markdownTheme);
        // 代码高亮（由 shiki 渲染，选中值作为 data-code-theme 输出到正文容器）
        $highlightTheme = new Typecho_Widget_Helper_Form_Element_Select('highlightTheme', $markdownHighlightMap, null, _t('文章代码块主题'), _t('由 shiki 按需加载对应主题：文章主题自带配套的高亮，若有定制需求可自行选择，否则保持"无"即可。'));
        $layout->addItem($highlightTheme);
    }
}

/**
 * @description: 获取文章title图片
 * @param {*} $that
 * @Date: 2023-03-22 20:28:15
 * @Author: mulingyuer
 */
function getArticleTitleImg($that)
{
    return $that->fields->titleImg;
}

/**
 * @description: 获取文章主题
 * @param {*} $that
 * @Date: 2023-03-23 00:44:46
 * @Author: mulingyuer
 */
function getArticleTheme($that)
{
    $defaultTheme = Helper::options()->defaultMarkdownTheme;
    $fields = parseFields($that->fields);
    $fieldsTheme = isset($fields['markdownTheme']) ? $fields['markdownTheme'] : '';
    if (empty($fieldsTheme)) {
        $fieldsTheme = 'juejin';
    }

    if (is_string($defaultTheme) && $defaultTheme !== '' && $defaultTheme !== 'juejin' && $fieldsTheme === 'juejin') {
        $theme = $defaultTheme;
    } else {
        $theme = $fieldsTheme;
    }

    return $theme;
}

/**
 * @description: 生成markdown主题样式link元素
 * @param {*} $that
 * @Date: 2023-12-22 23:13:27
 * @Author: mulingyuer
 */
function getMarkdownTheme($that)
{
    $themeUrl = Helper::options()->themeUrl;
    $articleTheme = getArticleTheme($that);

    // 文章主题链接（高亮主题不再由 CSS 提供，改由 getArticleHighlightTheme() 输出到 HTML 属性）
    $articleHref = $themeUrl . '/css/markdown/' . $articleTheme . '.css';
    $articleLink = '<link href="' . $articleHref . '" rel="stylesheet">';

    echo $articleLink;
}

/**
 * @description: 归一化出文章的逻辑高亮主题 key（沿用后台字段取值，无数据迁移）。
 * 优先级：文章 fields.highlightTheme（非空）→ 文章主题映射的默认高亮 → juejin。
 * @param {*} $that
 * @return string
 */
function getArticleHighlightTheme($that)
{
    global $defaultMarkdownThemeHighlightMap;
    $fields = parseFields($that->fields);
    $articleTheme = getArticleTheme($that);
    $highlightTheme = isset($fields['highlightTheme']) ? (string) $fields['highlightTheme'] : '';
    if ($highlightTheme === '') {
        $highlightTheme = array_key_exists($articleTheme, $defaultMarkdownThemeHighlightMap)
            ? $defaultMarkdownThemeHighlightMap[$articleTheme]
            : 'juejin';
    }

    return $highlightTheme;
}

/**
 * @description: 把成对的 \(...\) 与 \[...\] 公式片段替换为简短占位标记，规避 HyperDown 把前导反斜杠当转义符吞掉。
 * 这些片段之后由 markMathBlocksInHtml() 在解析后还原为真实定界符文本，KaTeX 才能识别。
 * @param string $markdown Markdown 原文
 * @param array $map 出参：占位标记 => 原始公式片段
 * @param int $seed 出参：占位序号（多次调用时保证唯一）
 * @return string 替换后的 Markdown 原文
 */
function maskMathDelimiters($markdown, &$map, &$seed)
{
    if (!is_string($markdown) || $markdown === '' || strpos($markdown, chr(92)) === false) {
        return (string) $markdown;
    }

    $back = chr(92);
    foreach (array('()', '[]') as $pair) {
        $left = substr($pair, 0, 1);
        $right = substr($pair, 1, 1);
        $open = $back . $left;
        $close = $back . $right;
        $from = 0;
        while (($start = strpos($markdown, $open, $from)) !== false) {
            $cursor = $start + strlen($open);
            $end = -1;
            while (($found = strpos($markdown, $close, $cursor)) !== false) {
                if ($found > 0 && substr($markdown, $found - 1, 1) === $back) {
                    $cursor = $found + strlen($close);
                    continue;
                }
                $end = $found;
                break;
            }
            if ($end < 0) {
                break;
            }
            $fragment = substr($markdown, $start, $end + strlen($close) - $start);
            $key = "\x01JJMATH" . ($seed++) . "\x00";
            $map[$key] = $fragment;
            $markdown = substr_replace($markdown, $key, $start, strlen($fragment));
            $from = $start + strlen($key);
        }
    }

    return $markdown;
}

/**
 * @description: 把 HTML 中的公式占位标记替换回 \left...\right 文本。
 * @param string $html 解析后的正文 HTML
 * @param array $map maskMathDelimiters() 生成的映射
 * @return string
 */
function restoreMathDelimiters($html, $map)
{
    if (!is_string($html) || empty($map)) {
        return $html;
    }

    return str_replace(array_keys($map), array_values($map), $html);
}

/**
 * @description: 记录文章渲染前的 Markdown 原文，供增强检测使用。
 * 同时把公式定界符替换成占位符写回 Typecho 内部行数据，解析后再由 renderMarkdownEnhancementAttrs() 侧统一还原。
 * 只在单页/独立页生效；列表页无需增强能力，也不做这些处理。
 * @param Widget_Abstract $archive
 * @return void
 */
function rememberMarkdownSource($archive)
{
    if (!isset($archive) || !is_object($archive)) {
        return;
    }

    // themeInit 阶段 ->content 已经是解析后的 HTML；真正的 Markdown 原文只在内部行数据里
    $raw = '';
    try {
        $rowProperty = new ReflectionProperty($archive, 'row');
        $rowProperty->setAccessible(true);
        $row = $rowProperty->getValue($archive);
        if (is_array($row) && isset($row['text']) && is_string($row['text'])) {
            $raw = (string) $row['text'];
        }
    } catch (ReflectionException $error) {
        $raw = '';
    }

    if ($raw === '' || strpos($raw, '<!--markdown-->') !== 0 || strpos($raw, chr(92)) === false) {
        return;
    }

    $seed = 0;
    $map = array();
    $masked = maskMathDelimiters($raw, $map, $seed);

    $archive->_markdownSource = restoreMathDelimiters(substr($masked, 15), $map);
    // 直接把掩码版内容转换为 HTML，再通过 __set 回填到当前对象，确保模板读到的 content 一定带占位符
    $converted = \Utils\Markdown::convert(substr($masked, 15));
    if (is_string($converted)) {
        try {
            $archive->content = $converted;
        } catch (Throwable $error) {
            // 回填失败时退化为普通渲染：\( \) / \[ \] 会显示为缺反斜杠的原文，正文仍可读
        }
    }

    global $jjMathMaskMap;
    $jjMathMaskMap = array_merge(is_array($jjMathMaskMap ?? null) ? $jjMathMaskMap : array(), $map);
}

/**
 * @description: 读取 rememberMarkdownSource() 保存的 Markdown 原文。
 * @param mixed $that 当前页面对象
 * @return string 拿不到原文时回退到 content，最终回退空串
 */
function getMarkdownSource($that)
{
    if (is_object($that)) {
        if (property_exists($that, '_markdownSource') && is_string($that->_markdownSource)) {
            return $that->_markdownSource;
        }
        if (property_exists($that, 'content') && is_string($that->content)) {
            // 兼容未调用 rememberMarkdownSource() 的场景（例如 markdown 模块被单独引入）
            return $that->content;
        }
    }
    return '';
}

/**
 * @description: 清理单个 Mermaid 代码块的原始定义文本。
 * 输入是 <code> 的 innerHTML（HighDown 保留源码并把标记转义），输出还原后的图表源码。
 * @param {string} $inner <code> 元素的 innerHTML
 * @return {string|null} 清理后的源码；空块返回 null
 */
function extractMermaidBlock($inner)
{
    // 相关比较常量全部由字符拼装，避免 PHP 把源码中的关闭标签当作语法结束
    $q = chr(63);
    $lt = chr(60);
    $gt = chr(62);
    $decoded = trim(html_entity_decode((string) $inner, ENT_QUOTES | ENT_HTML5, 'UTF-8'));
    if ($decoded === '') {
        return null;
    }
    if (strpos($decoded, pack('H*', 'EFBBBF')) === 0) {
        $decoded = substr($decoded, 3);
    }
    $ltrimmed = ltrim($decoded);
    $head = $lt . $q . chr(120) . chr(109) . 'l';
    if (substr($ltrimmed, 0, 5) === $head) {
        $end = strpos($ltrimmed, $q . $gt);
        if ($end !== false) {
            $decoded = ltrim(substr($ltrimmed, $end + 2));
        }
    }
    $cleaned = trim((string) $decoded);
    return $cleaned === '' ? null : $cleaned;
}

/**
 * @description: 收集文章中所有 Mermaid 代码块的原始定义文本，作为 data-mermaid-source 属性输出。
 * class~="x" 语义为「空格分隔词之一」，因此一次匹配同时覆盖 language-mermaid / lang-mermaid；
 * 数组下标与前端 querySelectorAll 的顺序严格一致（原文一次给足，前端不再解析 DOM）。
 * @param {string} $html 解析后的 HTML
 * @return {string|null} JSON 数组字符串；无 Mermaid 时返回 null
 */
function collectMermaidSources($html)
{
    if (!is_string($html) || $html === '' || stripos($html, 'mermaid') === false) {
        return null;
    }

    $sources = array();
    $hasRenderableSource = false;
    $pattern = '/<pre\b[^>]*>\s*<code\b[^>]*class=(["\'])[^"\']*(?:language|lang)-mermaid[^"\']*\1[^>]*>(.*?)<\/code>\s*<\/pre>/is';
    if (preg_match_all($pattern, $html, $matches)) {
        foreach ((array) $matches[2] as $inner) {
            $source = extractMermaidBlock($inner);
            if ($source === null) {
                $sources[] = '';
                continue;
            }
            $sources[] = $source;
            $hasRenderableSource = true;
        }
    }

    return !$hasRenderableSource ? null : json_encode($sources, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}

/**
 * @description: 判断单行原文中是否存在成对的行内 $...$
 * 逐字符扫描：奇数位 "$" 视为起始、偶数位视为结束；被反斜杠转义的字符（含 \$ ）一律跳过，
 * 避免 "$5 and $9" 这类货币写法或孤立 "$" 造成误判；定界符之间必须是可见文本。
 * @param {string} $text 单行文本
 * @return {bool}
 */
function hasPairedInlineMath($text)
{
    $back = chr(92);
    $openAt = -1;
    $length = strlen((string) $text);
    for ($index = 0; $index < $length; $index++) {
        if (substr($text, $index, 1) === $back) {
            $index++;
            continue;
        }
        if (substr($text, $index, 1) !== '$') {
            continue;
        }
        if ($openAt === -1) {
            $openAt = $index;
            continue;
        }
        if (trim(substr($text, $openAt + 1, $index - $openAt - 1)) !== '') {
            return true;
        }
        $openAt = -1;
    }
    return false;
}

/**
 * @description: 移除 Markdown 原文中的围栏代码块与行内代码，供公式检测使用。
 * 定界符只可能出现在正文里，代码块必须保持原样交给 Shiki，避免 "$5 and $9" 之类被当成公式。
 * @param {string} $markdown Markdown 原文
 * @return {string} 仅保留正文的文本
 */
function stripMarkdownCodeForMathCheck($markdown)
{
    $markdown = (string) $markdown;
    $markdown = preg_replace('/`{3,}[^\r\n`]*\R.*?\R?`{3,}/s', ' ', $markdown);
    if (!is_string($markdown)) {
        return '';
    }

    return preg_replace('/`+[^`\r\n]*`+/', ' ', $markdown) ?? $markdown;
}

/**
 * @description: 判断原文中是否包含数学公式（行内或块级）。
 *  - 行内：$...$ 与 \\(...\\)，按行判定，防止跨段落误配
 *  - 块级：$$...$$ 与 \\[...\\] 允许跨行；单对定界符内容上限 2MB，避免恶意长文本回溯
 * 注意 HyperDown 会把 "单个反斜杠 + 标点" 的反斜杠吞掉，所以 \( \) 需写成 \\( \\)、\[ \] 需写成 \\[ \\] 才能保留到前端；
 * 因此检测只认「双反斜杠」形式，单反斜杠写法不作为增强依据，避免加载 KaTeX 后仍无公式可渲染。
 * 检测前会剔除代码块，避免代码里的 $ 触发误判。
 * 反斜杠相关常量全部由 chr(92) 拼装，源文件内不出现连续反斜杠字面。
 * @param {string} $markdown Markdown 原文
 * @return {bool}
 */
function hasMathFormula($markdown)
{
    $markdown = stripMarkdownCodeForMathCheck((string) $markdown);
    $back = chr(92);
    if ($markdown === '' || (strpos($markdown, '$') === false && strpos($markdown, $back) === false)) {
        return false;
    }

    // 行内按行判定（含代码块的正文；代码已剔除）
    $lines = preg_split('/\R/', $markdown);
    foreach (is_array($lines) ? $lines : array($markdown) as $line) {
        if (hasPairedInlineMath((string) $line)) {
            return true;
        }
    }

    // 反斜杠定界符 \( \) 与 \[ \]（解析前会被掩码保护，因此按单成员判断）
    foreach (array('[', '(') as $left) {
        $right = $left === '[' ? ']' : ')';
        $openToken = $back . $left;
        $closeToken = $back . $right;
        $from = 0;
        while (($start = strpos($markdown, $openToken, $from)) !== false) {
            $end = strpos($markdown, $closeToken, $start + 2);
            if ($end === false) {
                break;
            }
            if ($end - $start <= 2097152) {
                return true;
            }
            $from = $end + 2;
        }
    }

    // 块级 $$...$$
    if (strpos($markdown, '$$') !== false && preg_match('/\$\$\X+?\$\$/', $markdown) === 1) {
        return true;
    }

    return false;
}

/**
 * @description: 统一检测文章是否需要 Markdown 增强（数学公式 / Mermaid）。
 * 结果只用于决定是否加载对应前端模块，不落库、不做后台配置项。
 * @param string $html 解析后的正文 HTML
 * @param string $markdown Markdown 原文（可选，缺省时用 html 兜底检测 Mermaid）
 * @return array{math:bool,mermaid:bool}
 */
function detectMarkdownEnhancements($html, $markdown = '')
{
    $math = hasMathFormula(is_string($markdown) && $markdown !== '' ? $markdown : strip_tags((string) $html));
    $mermaid = collectMermaidSources($html) !== null;

    return array('math' => $math, 'mermaid' => $mermaid);
}

/**
 * @description: 渲染增强标记：把需要启用的能力写成 data-* 属性。
 * 无对应能力时不输出该属性，避免在普通文章上附加额外状态。
 * @param array{math:bool,mermaid:bool} $enhancements detectMarkdownEnhancements() 的结果
 * @param string|null $mermaidSources collectMermaidSources() 的结果
 * @return void
 */
function renderMarkdownEnhancementAttrs($enhancements, $mermaidSources = null)
{
    if (!empty($enhancements['math'])) {
        echo ' data-enhance-math="true"';
    }
    if (!empty($enhancements['mermaid'])) {
        echo ' data-enhance-mermaid="true"';
    }
    if (is_string($mermaidSources) && $mermaidSources !== '' && $mermaidSources !== 'null') {
        echo ' data-mermaid-source="' . headEscape($mermaidSources) . '"';
    }
}

/**
 * @description: 获取用户组
 * @Date: 2023-03-23 05:10:27
 * @Author: mulingyuer
 */
function getGroup($uid = 0)
{
    $db = Typecho_Db::get();
    $prow = $db->fetchRow($db->select('group')->from('table.users')->where('uid = ?', $uid));
    $group = $prow['group'];
    if (empty($group)) {
        $group = 'visitor';
    }

    return $group;
}

/**
 * @description: 中文转义用户组
 * @param {*} $uid 用户id
 * @Date: 2023-03-23 05:09:12
 * @Author: mulingyuer
 */
function chineseUserGroup($uid = null)
{
    $userGroup = getGroup($uid);
    $zhUserGroup;
    switch ($userGroup) {
        case 'administrator':
            $zhUserGroup = '博主';
            break;
        case 'editor':
            $zhUserGroup = '编辑';
            break;
        case 'contributor':
            $zhUserGroup = '贡献者';
            break;
        case 'subscriber':
            $zhUserGroup = '粉丝';
            break;
        default:
            $zhUserGroup = '访客';
    }

    if (empty($zhUserGroup)) {
        $zhUserGroup = '未知用户';
    }
    return $zhUserGroup;
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
    if (!$widget instanceof Widget_Archive) {
        return false;
    }

    $fieldValue = articleViews($widget, '%d', '%d', '%d', true, $field);
    $fieldRecords = Typecho_Cookie::get('__typecho_' . $field);
    if (empty($fieldRecords)) {
        $fieldRecords = array();
    } else {
        $fieldRecords = explode(',', $fieldRecords);
    }

    if (!in_array($widget->cid, $fieldRecords)) {
        $fieldValue = $fieldValue + 1;
        $widget->setField($field, 'str', strval($fieldValue), $widget->cid);
        $fieldRecords[] = $widget->cid;
        $fieldRecords = implode(',', $fieldRecords);
        Typecho_Cookie::set('__typecho_' . $field, $fieldRecords);
        return true;
    }
    return false;
}

/**
 * @description: 获取浏览器信息
 * @param {*} $agent 浏览器信息
 * @Date: 2023-03-24 13:33:39
 * @Author: mulingyuer
 */
function getBrowser($agent)
{
    $outputer = '';
    $version = '';

    if (preg_match('/MSIE\s([^\s|;]+)/i', $agent, $regs)) {
        $outputer = 'Internet Explore';
    } elseif (preg_match('/FireFox\/([^\s]+)/i', $agent, $regs)) {
        $outputer = 'FireFox';
    } elseif (preg_match('/Maxthon([\d]*)\/([^\s]+)/i', $agent, $regs)) {
        $outputer = 'MicroSoft Edge';
    } elseif (preg_match('#360([a-zA-Z0-9.]+)#i', $agent, $regs)) {
        $outputer = '360 Fast Browser';
    } elseif (preg_match('/Edge([\d]*)\/([^\s]+)/i', $agent, $regs)) {
        $outputer = 'MicroSoft Edge';
    } elseif (preg_match('/UC/i', $agent)) {
        $outputer = 'UC Browser';
    } elseif (preg_match('/QQ/i', $agent, $regs) || preg_match('/QQ Browser\/([^\s]+)/i', $agent, $regs)) {
        $outputer = 'QQ Browser';
    } elseif (preg_match('/UBrowser/i', $agent, $regs)) {
        $outputer = 'UC Browser';
    } elseif (preg_match('/Opera[\s|\/]([^\s]+)/i', $agent, $regs)) {
        $outputer = 'Opera';
    } elseif (preg_match('/Chrome([\d]*)\/([^\s]+)/i', $agent, $regs)) {
        $outputer = 'Google Chrome';
    } elseif (preg_match('/safari\/([^\s]+)/i', $agent, $regs)) {
        $outputer = 'Safari';
    } else {
        $outputer = 'Google Chrome';
    }
    echo $outputer;
}

/**
 * @description: 获取操作系统信息
 * @param {*} $agent 浏览器信息
 * @Date: 2023-03-24 13:34:12
 * @Author: mulingyuer
 */
function getOs($agent)
{
    $os = false;
    if (preg_match('/win/i', $agent)) {
        if (preg_match('/nt 6.0/i', $agent)) {
            $os = 'Windows Vista';
        } elseif (preg_match('/nt 6.1/i', $agent)) {
            $os = 'Windows 7';
        } elseif (preg_match('/nt 6.2/i', $agent)) {
            $os = 'Windows 8';
        } elseif (preg_match('/nt 6.3/i', $agent)) {
            $os = 'Windows 8.1';
        } elseif (preg_match('/nt 5.1/i', $agent)) {
            $os = 'Windows XP';
        } elseif (preg_match('/nt 10.0/i', $agent)) {
            $os = 'Windows 10';
        } else {
            $os = 'Windows X64';
        }
    } elseif (preg_match('/android/i', $agent)) {
        if (preg_match('/android 9/i', $agent)) {
            $os = 'Android Pie';
        } elseif (preg_match('/android 8/i', $agent)) {
            $os = 'Android Oreo';
        } else {
            $os = 'Android';
        }
    } elseif (preg_match('/ubuntu/i', $agent)) {
        $os = 'Ubuntu';
    } elseif (preg_match('/linux/i', $agent)) {
        $os = 'Linux';
    } elseif (preg_match('/iPhone/i', $agent)) {
        $os = 'iPhone';
    } elseif (preg_match('/mac/i', $agent)) {
        $os = 'MacOS';
    } elseif (preg_match('/fusion/i', $agent)) {
        $os = 'Android';
    } else {
        $os = 'Linux';
    }
    echo $os;
}

// docsearch
function setDocSearchCookie()
{
    $options = Helper::options();
    $open = $options->isOpenDocSearch === 'on';
    if (!$open) {
        return;
    }

    $key = 'jj_docsearch';
    $data = array(
        'appid' => $options->docSearchAppId,
        'apiKey' => $options->docSearchApiKey,
        'indexName' => $options->docSearchIndexName,
    );
    $content = json_encode($data);
    $one_week = 60 * 60 * 24 * 7; // 1周
    $expire = time() + 60 * 60 * 24 * 365; // 1年
    $path = '/';
    $domain = $_SERVER['HTTP_HOST'];
    $secure = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off';
    $httpOnly = false;
    $needSet = false; //是否需要设置cookie

    if (isset($_COOKIE[$key])) {
        $decodedCookie = json_decode($_COOKIE[$key], true);

        //cookie不对或者为空、内部数据不对
        if (empty($decodedCookie) || !isset($decodedCookie['creationTime'])) {
            $needSet = true;
        } else {
            $cookieCreationTime = $decodedCookie['creationTime'];
            $remainingTime = $expire - $cookieCreationTime;
            // 有效期是否不够一周
            if ($remainingTime <= $one_week) {
                $needSet = true;
            }
        }
    } else {
        $needSet = true;
    }

    //设置cookie
    if ($needSet) {
        $data['creationTime'] = time();
        $content = json_encode($data);
        setcookie($key, $content, $expire, $path, $domain, $secure, $httpOnly);
    }
}

/**
 * @description: 转换千分位分隔符
 * @param {*} $val
 * @Date: 2023-07-09 15:48:57
 * @Author: mulingyuer
 */
function numFormatSeparator($val)
{
    $num = floatval($val);
    return number_format($num);
}

/**
 * @description: 单位转w
 * @param {*} $val
 * @Date: 2023-07-09 18:11:38
 * @Author: mulingyuer
 */
function numUnitConversion($val)
{
    $num = floatval($val);
    if ($num >= 10000) {
        $num = floor($num / 1000) / 10;
        if (fmod($num, 1) == 0) {
            $num = intval($num);
        }
        return $num . 'w';
    }
    return $num;
}

/**
 * 通过反射获取内部变量
 *
 * @param mixed $object
 * @param string $name
 * @return mixed
 * @throws ReflectionException
 */
function reflectGetValue($object, $name)
{
    $reflect = new ReflectionClass($object);
    $property = $reflect->getProperty($name);
    $property->setAccessible(true);
    return $property->getValue($object);
}

/**
 * 通过反射设置私有成员
 * @param $object
 * @param $name
 * @param $value
 */
function reflectSetValue($object, $name, $value)
{
    try {
        $reflect = new ReflectionClass($object);
        $property = $reflect->getProperty($name);
        $property->setAccessible(true);
        $property->setValue($object, $value);
    } catch (ReflectionException $e) {
    }
}

/** 设置置顶文章 */
function pushStickyArticles($archive)
{
    // 是否配置了cid
    $cidStr = Helper::options()->stickyCidList;
    if (empty($cidStr) || is_null($cidStr)) {
        return;
    }

    $cidList = explode(',', str_replace(' ', '', $cidStr));
    if (empty($cidList)) {
        return;
    }

    // 是否是第一页
    $currentPage = $archive->getCurrentPage();
    if ($currentPage !== 1) {
        return;
    }

    $stack = reflectGetValue($archive, 'stack');
    $articles = array();

    reflectSetValue($archive, 'stack', array());
    reflectSetValue($archive, 'row', array());
    reflectSetValue($archive, 'length', 0);

    // 开始获取文章
    $db = Typecho_Db::get();
    $stickyCidTag = Helper::options()->stickyCidTag;
    $showTag = !empty($cidStr) && !is_null($cidStr);
    $isConfiguredTag = !empty($stickyCidTag) && !is_null($stickyCidTag);
    foreach ($cidList as $cid) {
        $cidArticle = $db->fetchRow($archive->select()->where('cid = ?', $cid));
        if (empty($cidArticle)) {
            return;
        }
        // 添加tag
        if ($showTag) {
            if ($isConfiguredTag) {
                $cidArticle['sticky'] = $stickyCidTag;
            } else {
                // 默认配置
                $cidArticle['sticky'] = '<span class="article-card-sticky-tag">置顶</span>';
            }
        }
        $articles[] = $cidArticle;
    }

    $stack = array_merge($articles, $stack);

    if (count($stack)) {
        foreach ($stack as $post) {
            $archive->push($post);
        }
    }
}

/** 获取首页右侧推荐文章列表 */
function getHomeRecommendedArticleList()
{
    // 文章数组
    $articles = array();

    // 是否配置了cid
    $cidStr = Helper::options()->homeRecommendedArticleCidList;
    if (empty($cidStr) || is_null($cidStr)) {
        return $articles;
    }

    // 只取前三个
    $cidList = explode(',', str_replace(' ', '', $cidStr));
    if (empty($cidList)) {
        return $articles;
    }
    $cidList = array_slice($cidList, 0, 3);

    // 开始获取文章
    foreach ($cidList as $cid) {
        $cidArticle = Helper::widgetById('Contents', $cid);
        if (empty($cidArticle)) {
            return;
        }
        $articles[] = array(
            'cid' => $cidArticle->cid,
            'title' => $cidArticle->title,
            'permalink' => $cidArticle->permalink,
            'date' => $cidArticle->created,
            'thumb' => $cidArticle->fields->thumb,
        );
    }

    return $articles;
}

/**
 * @description: 把 class / target / rel 这类空白分隔的白名单 token 去重合并，保持首次出现顺序。
 * 值里出现引号、尖括号、反斜杠等非安全字符时整段丢弃，只接受白名单 token。
 * @param {array<string>} $parts 若干原始值片段
 * @return {string} 合并结果；没有可信内容时返回空串
 */
function mergeWhiteListTokens(array $parts)
{
    $seen = array();
    foreach ($parts as $part) {
        if (!is_string($part)) {
            continue;
        }
        $tokens = preg_split('/\s+/', trim($part));
        foreach (is_array($tokens) ? $tokens : array() as $token) {
            // 字母数字与有限符号（覆盖 _blank、noopener、task-list-item 等）
            if ($token !== '' && preg_match('/^[A-Za-z0-9_-]+$/', $token)) {
                $seen[$token] = true;
            }
        }
    }

    return $seen === array() ? '' : implode(' ', array_keys($seen));
}

/**
 * @description: 读取HTML元素的class属性值。
 * @param {string} $tag 元素开始标签
 * @return {string} class 值（不存在时为空串）
 */
function getTagClassValue($tag)
{
    if (preg_match('/\bclass\s*=\s*"([^"]*)"/i', (string) $tag, $match)) {
        return $match[1];
    }
    if (preg_match("/\bclass\s*=\s*'([^']*)'/i", (string) $tag, $match)) {
        return $match[1];
    }

    return '';
}

/**
 * 读取元素开始标签中的双引号或单引号属性。
 * @param {string} $tag
 * @param {string} $name
 * @return {string|null}
 */
function getTagAttributeValue($tag, $name)
{
    $tag = (string) $tag;
    $name = preg_quote((string) $name, '/');
    if (preg_match('/\b' . $name . '\s*=\s*"([^"]*)"/i', $tag, $match)) {
        return $match[1];
    }
    if (preg_match("/\b" . $name . "\s*=\s*'([^']*)'/i", $tag, $match)) {
        return $match[1];
    }

    return null;
}

/**
 * @description: 在元素开始标签上设置属性（存在则整段替换，不存在则插入到标签名之后）。
 * 仅写入合并后的可信值，不做富文本拼接。
 * @param {string} $tag 元素开始标签
 * @param {string} $name 属性名（小写）
 * @param {string} $value 已过滤的属性值
 * @return {string}
 */
function setTagAttributeValue($tag, $name, $value)
{
    $tag = (string) $tag;
    if ($value !== '') {
        $pattern = '/\s*\b' . preg_quote($name, '/') . '\s*=\s*"[^"]*"/i';
        if (preg_match($pattern, $tag)) {
            $tag = preg_replace($pattern, ' ' . $name . '="' . $value . '"', $tag);
        } elseif (preg_match("/\s*\b" . preg_quote($name, '/') . "\s*=\s*'[^']*'/i", $tag)) {
            $tag = preg_replace("/\s*\b" . preg_quote($name, '/') . "\s*=\s*'[^']*'/i", ' ' . $name . '="' . $value . '"', $tag);
        } else {
            // 自闭合与成对标签都在标签名后插入
            $tag = preg_replace('/^(<\w+)/i', '$1 ' . $name . '="' . $value . '"', $tag);
        }
    }

    return is_string($tag) ? $tag : (string) $tag;
}

/**
 * @description: 判断 href 是否为需要按外链处理的 http(s) 链接（跨站）。
 * 站内（同 host）、锚点、相对路径、mailto:/tel: 等协议一律不算外链。
 * @param {string} $href
 * @param {string} $selfHost 站点 host（小写，可为空）
 * @return {bool}
 */
function isMarkdownExternalHref($href, $selfHost)
{
    $href = trim((string) $href);
    if ($href === '') {
        return false;
    }

    $href = html_entity_decode($href, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    // 先按 RFC 形式识别 scheme；parse_url() 会把 tel:123 误判成 host=port
    $scheme = '';
    if (preg_match('/^([A-Za-z][A-Za-z0-9+.\-]*):/', $href, $match)) {
        $scheme = strtolower($match[1]);
    }
    if ($scheme !== '' && $scheme !== 'http' && $scheme !== 'https') {
        return false;
    }

    $parts = parse_url($href);
    if (!is_array($parts)) {
        return false;
    }

    $host = isset($parts['host']) ? strtolower((string) $parts['host']) : '';
    if ($host === '') {
        return false;
    }
    if ($selfHost === '') {
        return true;
    }

    return $host !== strtolower((string) $selfHost);
}

/**
 * @description: 格式化正文中的外链：为跨站 http(s) 链接补齐 target="_blank" 与 rel="noopener noreferrer"。
 * 复用前面已经存在的 <a> 标签，只增删自己负责的两个属性；已有 rel 的其他值会保留去重合并。
 * 站内链接、锚点、相对路径、mailto:/tel: 等行为完全不变。
 * @param {string} $html 解析后的正文 HTML
 * @return {string}
 */
function formatMarkdownExternalLinks($html)
{
    $html = (string) $html;
    if (stripos($html, '<a') === false) {
        return $html;
    }

    $selfHost = '';
    $siteUrl = Helper::options()->siteUrl;
    if (is_string($siteUrl) && $siteUrl !== '') {
        $host = parse_url($siteUrl, PHP_URL_HOST);
        if (is_string($host) && $host !== '') {
            $selfHost = strtolower($host);
        }
    }

    $result = preg_replace_callback(
        '/<a\b[^>]*>/i',
        function ($matches) use ($selfHost) {
            $tag = (string) $matches[0];
            $href = getTagAttributeValue($tag, 'href');
            if ($href === null || !isMarkdownExternalHref($href, $selfHost)) {
                return $tag;
            }

            $target = getTagAttributeValue($tag, 'target');
            if ($target === null) {
                $tag = setTagAttributeValue($tag, 'target', '_blank');
                $target = '_blank';
            }

            if (strtolower(trim($target)) === '_blank') {
                $rel = mergeWhiteListTokens(
                    array(
                        getTagAttributeValue($tag, 'rel') ?: '',
                        'noopener',
                        'noreferrer'
                    )
                );
                $tag = setTagAttributeValue($tag, 'rel', $rel);
            }

            return $tag;
        },
        $html
    );

    return is_string($result) ? $result : $html;
}

/**
 * @description: 判断当前访客是否可查看 [hide] 回复可见内容。
 * 已登录用户可见；未登录时仅当存在该文章下已通过审核、且邮箱与访客 cookie 一致的评论才可见。
 * @param Widget_Abstract $archive 当前页面对象
 * @return {bool}
 */
function canViewReplyVisibleContent($archive)
{
    if (!is_object($archive)) {
        return false;
    }
    // Typecho 中 `$user` 是 Widget 的 protected 属性：模板内 include 的全局函数里 `$archive->user`
    // 只会走 __get() 而取不到该属性（isset/null 合并都落空），因此登录态改用核心用户组件判定。
    /** @var mixed $user */
    $user = class_exists('\\Widget\\User') ? \Widget\User::alloc() : null;
    if (is_object($user) && method_exists($user, 'hasLogin') && $user->hasLogin()) {
        return true;
    }

    if (!is_object($archive)) {
        return false;
    }

    // cid 与 remember 由归档对象自身提供（模板作用域内可用）；缺失时回退请求参数 / cookie
    $cid = intval($archive->parameter->cid ?? $archive->cid ?? $archive->request->cid ?? 0);
    if ($cid <= 0) {
        return false;
    }
    /** @var mixed $mail */
    $mail = method_exists($archive, 'remember')
        ? $archive->remember('mail', true)
        : \Typecho\Cookie::get('__typecho_remember_mail');
    if (!is_string($mail) || $mail === '') {
        return false;
    }

    $db = Typecho_Db::get();
    $row = $db->fetchRow(
        $db->select()->from('table.comments')
            ->where('cid = ?', $cid)
            ->where('mail = ?', $mail)
            ->where('status = ?', 'approved')
            ->limit(1)
    );

    return !empty($row);
}

/**
 * @description: 渲染 [hide] 回复可见短代码。
 * 只处理闭合的 [hide]...[/hide]：可见时去掉标记保留内部 HTML；不可见时替换为固定提示 DOM。
 * @param {string} $html 正文 HTML
 * @param {bool} $canView 是否可见
 * @return {string}
 */
function renderReplyVisibleContent($html, $canView)
{
    $html = (string) $html;
    if ($html === '' || strpos($html, '[hide]') === false) {
        return $html;
    }
    $hidePattern = "/\[hide\](?:<br\s*\/?>)?(.*?)\[\/hide\]/is";

    if ($canView) {
        $result = preg_replace($hidePattern, '$1', $html);
    } else {
        $result = preg_replace(
            $hidePattern,
            '<div class="respond-visible">此处内容已隐藏<a  href="#comments">回复</a>后方可阅读。</div>',
            $html
        );
    }

    return is_string($result) ? $result : $html;
}

/**
 * @description: todoList 格式化：把列表项开头的 [ ] / [x] 转成只读复选框。
 * 只处理解析后 <li> 的第一个文本位置，不碰正文、代码块与属性中的同类文本；
 * 已有 class 保持不变（task-list-item / contains-task-list 追加而不覆盖）。
 * @param {*} $html
 * @Date: 2024-04-27 15:21:07
 * @Author: mulingyuer
 */
function todoListFormatted($html)
{
    $openBox = '<input type="checkbox" disabled/>';
    $checkedBox = '<input type="checkbox" checked disabled/>';
    $html = (string) $html;

    // 1) 列表项开头的 [ ] / [xX] -> 复选框，任务项加 task-list-item；标记之后紧跟的一个空白一并去掉（保持原视觉）
    $html = preg_replace_callback(
        '/(<li\b[^>]*>)\s*\[([ xX])\]\s?/',
        function ($matches) use ($checkedBox, $openBox) {
            $tag = rtrim((string) ($matches[1] ?? ''), '>');
            $box = strtolower((string) ($matches[2] ?? '')) === 'x' ? $checkedBox : $openBox;
            $class = mergeWhiteListTokens(array(getTagClassValue($tag), 'task-list-item'));
            $tag = setTagAttributeValue($tag, 'class', $class);

            return $tag . '>' . $box;
        },
        $html
    );
    if (!is_string($html)) {
        return (string) $html;
    }

    // 2) 包含任务项的 ul/ol -> contains-task-list。逐个最外层列表判定：
    //    未被处理的内部内容不再改写，避免重复扫描与嵌套列表被误标记。
    $html = (string) $html;
    $offset = 0;
    while (is_string($html) && preg_match('/<(ul|ol)\b[^>]*>|<(\/?)(ul|ol)\b[^>]*>/i', $html, $m, PREG_OFFSET_CAPTURE, $offset)) {
        $at = (int) ($m[0][1] ?? 0);
        $closing = isset($m[2][0]) && $m[2][0] === '/';
        if ($closing) {
            $offset = $at + strlen($m[0][0]);
            continue;
        }
        // 找到与之匹配的同标签结束位置（简单计数，Typecho 直出的列表结构规整）
        $depth = 1;
        $cursor = $at + strlen($m[0][0]);
        $endAt = -1;
        while ($depth > 0 && preg_match('/<\/?(?:ul|ol)\b[^>]*>/i', $html, $n, PREG_OFFSET_CAPTURE, $cursor)) {
            if (substr((string) $n[0][0], 1, 1) !== '/') {
                $depth++;
            } else {
                $depth--;
                if ($depth === 0) {
                    $endAt = (int) $n[0][1];
                }
            }
            $cursor = (int) $n[0][1] + strlen($n[0][0]);
        }
        if ($endAt < 0) {
            break;
        }
        $block = substr($html, $at, $endAt - $at);
        if (strpos($block, 'task-list-item') !== false) {
            preg_match('/<[^>]+>/i', $block, $head);
            $class = mergeWhiteListTokens(array(getTagClassValue($head[0] ?? ''), 'contains-task-list'));
            $newHead = setTagAttributeValue($head[0] ?? '', 'class', $class);
            $html = substr($html, 0, $at) . $newHead . substr($block, strlen($head[0] ?? '')) . substr($html, $endAt);
            $offset = $at + strlen($newHead);
        } else {
            $offset = $endAt;
        }
    }

    return is_string($html) ? $html : (string) $html;
}

/** 计算文章的阅读时间 */
function articleReadingTime($text)
{
    $length = mb_strlen(strip_tags($text), 'utf-8');
    // 计算阅读时间（分钟）
    $readingTime = ceil($length / 250);

    // 转换阅读时间为小时和分钟
    $hours = floor($readingTime / 60);
    $minutes = $readingTime % 60;

    if ($hours >= 24) {
        $days = floor($hours / 24);
        $hours = $hours % 24;

        if ($hours == 0) {
            return "阅读" . $days . "天";
        } else {
            return "阅读" . $days . "天" . $hours . "小时";
        }
    } else {
        if ($hours == 0) {
            return "阅读" . $minutes . "分钟";
        } elseif ($minutes == 0) {
            return "阅读" . $hours . "小时";
        } else {
            return "阅读" . $hours . "小时" . $minutes . "分钟";
        }
    }
}

// 获取后台管理页面的 URL
function getAdminUrl($page = "")
{
    // 获取 Typecho 配置选项对象
    $options = Typecho_Widget::widget('Widget_Options');
    // 获取 adminUrl 方法返回的基础 URL
    $adminUrl = $options->adminUrl;

    if (empty($page)) {
        return $adminUrl;
    }

    // 删除开头的斜线（如果有）
    if (strpos($page, '/') === 0) {
        $page = substr($page, 1);
    }
    // 删除结尾的 .php（如果有）
    if (substr($page, -4) === '.php') {
        $page = substr($page, 0, -4);
    }

    // 拼接并返回完整的 URL
    return $adminUrl . $page . ".php";
}

/** 获取文章详情页右侧推荐文章 */
function getArticleDetailRecommended()
{
    // 是否配置了cid
    $cid = Helper::options()->articleRecommendedArticleCid;
    if (empty($cid) || is_null($cid)) {
        return null;
    }

    // 提取文章数据
    $cidArticle = Helper::widgetById('Contents', $cid);
    if (empty($cidArticle)) {
        return null;
    }

    return array(
        'cid' => $cidArticle->cid,
        'title' => $cidArticle->title,
        'permalink' => $cidArticle->permalink,
        'date' => $cidArticle->created,
        'thumb' => $cidArticle->fields->thumb
    );
}

//主题themeInit函数
function themeInit($archive)
{
    //评论回复楼层最高999层.这个正常设置最高只有7层
    Helper::options()->commentsMaxNestingLevels = 999;
    //自动增加浏览次数
    if ($archive->is('single') || $archive->is('page')) {
        viewsCounter($archive);
    }
    // 在加工 content 之前留下 Markdown 原文，供公式 / Mermaid 检测使用
    rememberMarkdownSource($archive);
    //目录树
    if ($archive->is('single')) {
        $archive->content = addAnchorPoint($archive->content);
    }

    //点赞请求接口
    // if ($archive->request->isPost() && $archive->request->likeup && $archive->request->do_action) {
    //     likeup($archive->request->likeup, $archive->request->do_action);
    //     exit;
    // }

    if ($archive->is('single')) {
        if ($archive->request->isPost()) {
            if ($archive->request->is('themeAction=promo')) {
                promo($archive);
            }
        }
    }

    // 文章置顶
    if ($archive->is('index')) {
        pushStickyArticles($archive);
    }
}

/**
 * @description: 渲染通用骨架屏 DOM。
 * 布局配置说明见 src/modules/skeleton/README.md。
 * 内联 style 只承载配置传入的尺寸/间距，颜色一律走 CSS 变量。
 * @param array{selector:string, count?:int, item:array} $options
 * @return void
 */
function renderSkeleton($options)
{
    $selector = isset($options['selector']) && is_string($options['selector']) ? $options['selector'] : '';
    $count = isset($options['count']) && is_int($options['count']) && $options['count'] > 0 ? $options['count'] : 1;
    $item = isset($options['item']) && is_array($options['item']) ? $options['item'] : null;

    if ($selector === '' || $item === null) {
        return;
    }

    echo '<div class="jj-skeleton ' . htmlspecialchars($selector, ENT_QUOTES, 'UTF-8') . '">';
    for ($i = 0; $i < $count; $i++) {
        echo '<div class="jj-skeleton-item">';
        renderSkeletonBlock($item);
        echo '</div>';
    }
    echo '</div>';
}

/**
 * @description: 递归渲染单个骨架块（renderSkeleton 内部使用）
 * @param array $block 块配置
 * @return void
 */
function renderSkeletonBlock($block)
{
    if (!is_array($block) || !isset($block['type']) || !is_string($block['type'])) {
        return;
    }

    switch ($block['type']) {
        case 'avatar':
            $size = isset($block['size']) && is_numeric($block['size']) ? (int)$block['size'] : 40;
            echo '<div class="jj-skeleton-avatar" style="width:' . $size . 'px;height:' . $size . 'px"></div>';
            break;
        case 'line':
            $style = '';
            if (isset($block['width']) && is_string($block['width']) && $block['width'] !== '') {
                $style = ' style="width:' . htmlspecialchars($block['width'], ENT_QUOTES, 'UTF-8') . '"';
            }
            echo '<div class="jj-skeleton-line"' . $style . '></div>';
            break;
        case 'image':
            $width = isset($block['width']) && is_string($block['width']) ? $block['width'] : '';
            $height = isset($block['height']) && is_string($block['height']) ? $block['height'] : '';
            $style = '';
            if ($width !== '') {
                $style .= 'width:' . htmlspecialchars($width, ENT_QUOTES, 'UTF-8') . ';';
            }
            if ($height !== '') {
                $style .= 'height:' . htmlspecialchars($height, ENT_QUOTES, 'UTF-8') . ';';
            }
            echo '<div class="jj-skeleton-image"' . ($style !== '' ? ' style="' . $style . '"' : '') . '></div>';
            break;
        case 'row':
        case 'column':
            $gap = isset($block['gap']) && is_numeric($block['gap']) ? (int)$block['gap'] : ($block['type'] === 'row' ? 12 : 8);
            $children = isset($block['children']) && is_array($block['children']) ? $block['children'] : array();
            echo '<div class="jj-skeleton-' . $block['type'] . '" style="gap:' . $gap . 'px">';
            foreach ($children as $child) {
                renderSkeletonBlock($child);
            }
            echo '</div>';
            break;
    }
}

/**
 * @description: 渲染通用分页组件。
 * 使用文档见 src/modules/pagination/README.md。
 *
 * @param Widget_Archive $archive 归档对象（模板中一般为 $this）
 * @param array $options {
 *   @type string      $type       翻页模式：'infinite'（无限滚动）| 'button'（按钮翻页），默认 'infinite'
 *   @type string|null $prevText   上一页文案，传 null/false 不渲染上一页，默认 '上一页'
 *   @type string|null $nextText   下一页文案，传 null/false 不渲染下一页，默认 '下一页'
 *   @type int         $pageSize   button 模式 pageNav() 两侧页码数，默认 1
 *   @type string      $noMoreText infinite 模式"没有更多了"文案，默认 '没有更多了'
 *   @type string|null $nextUrl    手动指定下一页链接（无法走 pageLink() 的场景，如独立页 ?page=N）
 *   @type string|null $prevUrl    手动指定上一页链接（与 nextUrl 配套的手工模式）
 *   @type bool|null   $hasMore    手动指定是否有下一页（与 nextUrl 配套），null 时由 pageLink 判断
 *   @type string      $loadingImg loading 图相对主题目录路径，默认 '/images/article-loading.gif'
 *   @type bool        $hidden     是否初始隐藏（配合骨架屏），默认 true
 *   @type object|null $navWidget  button 模式（pageNav 分支）实际调用的 Widget，
 *                                 默认 $archive。评论分页必须传评论 Widget（$this->comments() 回调参数），
 *                                 因为 Archive 的 $countSql 未初始化，直接 pageNav() 会抛 Error
 * }
 * @return void
 */
function renderPagination($archive, $options = array())
{
    if (!is_array($options)) {
        $options = array();
    }
    $defaults = array(
        'type'       => 'infinite',
        'prevText'   => '上一页',
        'nextText'   => '下一页',
        'pageSize'   => 1,
        'noMoreText' => '没有更多了',
        'nextUrl'    => null,
        'prevUrl'    => null,
        'hasMore'    => null,
        'loadingImg' => '/images/article-loading.gif',
        'hidden'     => true,
        'navWidget'  => null,
    );
    $paginationOptions = array_merge($defaults, $options);
    // need() 在 Widget 方法调用栈内 include 模板，读不到本函数的局部变量，
    // 挂到 Archive 对象属性上传递（模板内 $this 与 $archive 是同一对象）
    $archive->paginationOptions = $paginationOptions;
    $archive->need('/modules/pagination/pagination.php');
}
