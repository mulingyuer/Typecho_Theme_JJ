<?php
if (!defined('__TYPECHO_ROOT_DIR__')) {
    exit;
}

/**
 * @description: 文章发布时间
 * @param {*} $time 原文章发布时间
 * @Date: 2023-03-19 16:58:25
 * @Author: mulingyuer
 */
function timeFormatting($time)
{
    if ($time == 'no') {return;}
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
 * @param {*} $that
 * @Date: 2023-03-19 17:03:31
 * @Author: mulingyuer
 */
function articleThumbnail($that)
{
    $attach = $that->attachments(1)->attachment;
    $pattern1 = '/\<img.*?src\=\"(.*?)\"[^>]*>/i';
    $pattern2 = '/\!\[.*?\]\((.*?)\)/i';

    //如果有自定义缩略图
    if ($that->fields->titleImg) {
        return $that->fields->titleImg;
    } elseif ($that->fields->thumb) {
        return $that->fields->thumb;
    } elseif (preg_match_all($pattern1, $that->content, $thumbUrl) && strlen($thumbUrl[1][0]) > 7) {
        return $thumbUrl[1][0];
    } elseif (preg_match_all($pattern2, $that->content, $thumbUrl) && strlen($thumbUrl[1][0]) > 7) {
        return $thumbUrl[1][0];
    } elseif ($attach && $attach->isImage) {
        return $attach->url;
    } else {
        return '';
    }
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
    $rawFields = $that->fields;
    if (is_string($rawFields)) {
        $fields = unserialize($rawFields);
    } elseif (is_object($rawFields)) {
        $fields = json_decode(json_encode($rawFields), true);
    } else {
        $fields = $rawFields;
    }
    if (!is_array($fields)) {
        $fields = array();
    }
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

    $linkCount = $that->fields->likes;
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
    $rawFields = $widget->fields;
    if (is_string($rawFields)) {
        $fields = unserialize($rawFields);
    } elseif (is_object($rawFields)) {
        $fields = json_decode(json_encode($rawFields), true);
    } else {
        $fields = $rawFields;
    }
    if (!is_array($fields)) {
        $fields = array();
    }
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
        foreach (array(
            'stack' => array(),
            'row' => array(),
            'length' => 0,
        ) as $name => $val) {
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
        // 代码高亮
        $highlightTheme = new Typecho_Widget_Helper_Form_Element_Select('highlightTheme', $markdownHighlightMap, null, _t('文章代码块主题'), _t('文章主题自带配套的代码高亮，如果你有定制需求，可以自行选择代码高亮主题，否则默认选择无即可。'));
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
    $fieldsTheme = $that->fields->markdownTheme;
    if (empty($fieldsTheme)) {
        $fieldsTheme = 'juejin';
    }

    if ($defaultTheme !== 'juejin' && $fieldsTheme === 'juejin') {
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
    global $defaultMarkdownThemeHighlightMap;
    $themeUrl = Helper::options()->themeUrl;
    // 文章主题
    $articleTheme = $that->fields->markdownTheme;
    $defaultTheme = Helper::options()->defaultMarkdownTheme;
    if (empty($articleTheme)) {
        $articleTheme = 'juejin';
    }
    if ($defaultTheme !== 'juejin' && $articleTheme === 'juejin') {
        $articleTheme = $defaultTheme;
    }
    // 代码高亮主题
    $highlightTheme = $that->fields->highlightTheme;
    if (empty($highlightTheme)) {
        // 如果文章主题对应的代码高亮主题不存在
        // 则使用默认代码高亮主题
        if (array_key_exists($articleTheme, $defaultMarkdownThemeHighlightMap)) {
            $highlightTheme = $defaultMarkdownThemeHighlightMap[$articleTheme];
        } else {
            $highlightTheme = 'juejin';
        }
    }

    // 文章主题链接
    $articleHref = $themeUrl . '/css/markdown/' . $articleTheme . '.css';
    $articleLink = '<link href="' . $articleHref . '" rel="stylesheet">';
    // 代码高亮主题链接
    $highlightHref = $themeUrl . '/css/highlight/' . $highlightTheme . '.css';
    $highlightLink = '<link href="' . $highlightHref . '" rel="stylesheet">';

    echo $articleLink . $highlightLink;
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
    if (empty($group)) {$group = 'visitor';}

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
 * @description: todoList 格式化
 * @param {*} $html
 * @Date: 2024-04-27 15:21:07
 * @Author: mulingyuer
 */
function todoListFormatted($html)
{
    // 匹配 [ ] 和 [x] 并替换为相应的 input 元素
    $html = preg_replace('/<li>\[x\]\s/sm', '<li class="task-list-item"><input type="checkbox" checked disabled/>', $html);
    $html = preg_replace('/<li>\[\s\]\s/sm', '<li class="task-list-item"><input type="checkbox" disabled/>', $html);

    // 为包含任务列表的 ul/ol 添加 class
    $html = preg_replace('/<(ul|ol)>(.*?<li class="task-list-item">.*?)<\/\1>/s', '<$1 class="contains-task-list">$2</$1>', $html);

    return $html;
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
        'thumb' => $cidArticle->fields->thumb);
}

//主题themeInit函数
function themeInit($archive)
{
    //评论回复楼层最高999层.这个正常设置最高只有7层
    Helper::options()->commentsMaxNestingLevels = 999;
    //自动增加浏览次数
    if ($archive->is('single') || $archive->is('page')) {viewsCounter($archive);}
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

