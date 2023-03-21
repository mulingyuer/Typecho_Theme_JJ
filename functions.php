<?php
if (!defined('__TYPECHO_ROOT_DIR__')) {
    exit;
}

/**
 * @description: 获取当前页面标题
 * @param {*} $that 当前页面对象
 * @Date: 2023-03-14 20:50:07
 * @Author: mulingyuer
 */
function blogTitle($that)
{
    $before = $that->archiveTitle(array(
        'category' => _t('分类 %s 下的文章'),
        'search' => _t('包含关键字 %s 的文章'),
        'tag' => _t('标签 %s 下的文章'),
        'author' => _t('%s 发布的文章'),
    ), '', ' - ');
    $title = Helper::options()->title();
    return $before . $title;
}

/**
 * @description: 获取当前页面描述
 * @param {*} $that 当前页面对象
 * @Date: 2023-03-14 20:51:55
 * @Author: mulingyuer
 */
function blogDescription($that, $max = 150)
{
    $desc = "";
    if ($that->is('index') || $that->is('category')) {
        $desc = Helper::options()->description();
    } else {
        $desc = $that->excerpt($max);
    }
    return $desc;
}

/**
 * @description: 获取当前页面关键词
 * @param {*} $that 当前页面对象
 * @Date: 2023-03-14 21:02:23
 * @Author: mulingyuer
 */
function blogKeywords($that)
{
    $keywords = "";
    if ($that->is('index') || $that->is('category')) {
        $keywords = Helper::options()->keywords();
    } else {
        $keywords = $that->category(',', false) + $that->tags(',', false);
    }
    return $keywords;
}

/**
 * @description: seo链接
 * @param {*} $that 当前页面对象
 * @Date: 2023-03-14 21:20:53
 * @Author: mulingyuer
 */
function seoUrl($that)
{
    // 旧版
    // $url = "";
    // if ($that->is('index')) {
    //     $url = Helper::options()->siteUrl();
    // } else {
    //     $url = $that->permalink();
    // }
    // return $url;
    echo $that->request->getRequestUrl();
}

/**
 * @description: seo图片
 * @param {*} $that 当前页面对象
 * @Date: 2023-03-14 21:30:30
 * @Author: mulingyuer
 */
function seoImage($that)
{
    $image = "";
    if ($that->is('index') || $that->is('category')) {
        $image = Helper::options()->themeUrl . "/static/images/favicon/android-chrome-512x512.png";
    } else {
        $image = get_ArticleThumbnail($that);
    }
    //保底图片
    if (!$image) {
        $image = Helper::options()->themeUrl . "/static/images/seo_img_null.jpg";
    }
    return $image;
}

/**
 * @description: 父级菜单是否高亮
 * @param {*} $activeSlug 选中的菜单slug，也就是名称
 * @param {*} $category 父级分类信息
 * @param {*} $children 子级分类信息
 * @Date: 2023-03-18 22:24:19
 * @Author: mulingyuer
 */
function isParentActive($activeSlug, $category, $children)
{

    $flag = false;
    foreach ($children as $mid) {
        $child = $category->getCategory($mid);
        if ($child['slug'] === $activeSlug) {
            $flag = true;
            break;
        }
    }
    return $flag;
}

/** 二级分类：全部是否高亮 */
function secondaryAllActive($that, $category, $children)
{
    $flag = true;
    foreach ($children as $mid) {
        $child = $category->getCategory($mid);
        if ($that->is('category', $child['slug'])) {
            $flag = false;
            break;
        }
    }
    return $flag;
}

/**
 * @description: 文章发布时间
 * @param {*} $time 原文章发布时间
 * @Date: 2023-03-19 16:58:25
 * @Author: mulingyuer
 */
function articleTime($time)
{
    if ($time == "no") {return;}
    $chunks = array(
        array(31536000, ' 年'),
        array(2592000, ' 个月'),
        array(604800, ' 周'),
        array(86400, ' 天'),
        array(3600, ' 小时'),
        array(60, ' 分'),
        array(1, ' 秒'),
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
    $pattern = '/\<img.*?src\=\"(.*?)\"[^>]*>/i';

    //如果有自定义缩略图
    if ($that->fields->titleImg) {
        return $that->fields->titleImg;
    } else if ($that->fields->thumb) {
        return $that->fields->thumb;
    } else if (preg_match_all($pattern, $that->content, $thumbUrl) && strlen($thumbUrl[1][0]) > 7) {
        return $thumbUrl[1][0];
    } else if ($attach->isImage) {
        return $attach->url;
    } else {
        return "";
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
function articleViews($that, $format0 = "%d", $format1 = "%d", $formats = "%d", $return = false, $field = 'views')
{
    $fields = unserialize($that->fields);
    if (array_key_exists($field, $fields)) {
        $fieldValue = (!empty($fields[$field])) ? intval($fields[$field]) : 0;
    } else {
        $fieldValue = 0;
    }
    if ($fieldValue == 0) {
        $fieldValue = sprintf($format0, $fieldValue);
    } else if ($fieldValue == 1) {
        $fieldValue = sprintf($format1, $fieldValue);
    } else {
        $fieldValue = sprintf($formats, $fieldValue);
    }
    if ($return) {
        return $fieldValue;
    } else {
        echo $fieldValue;
    }
}

/**
 * @description: 文章点赞数
 * @param {*} $cid 文章cid
 * @Date: 2023-03-19 17:08:59
 * @Author: mulingyuer
 */
function articleLike($cid)
{
    $db = Typecho_Db::get();
    $prefix = $db->getPrefix();
    if (!array_key_exists('likes', $db->fetchRow($db->select()->from('table.contents')))) {
        $db->query('ALTER TABLE `' . $prefix . 'contents` ADD `likes` INT(10) DEFAULT 0;');
        return;
    }
    $row = $db->fetchRow($db->select('likes')->from('table.contents')->where('cid = ?', $cid));
    $num = $row['likes'];
    return $num;
}

/**
 * @description: 是否是ajax请求
 * @Date: 2023-03-21 00:22:09
 * @Author: mulingyuer
 */
function isAjax()
{
    if (isset($_SERVER["HTTP_X_REQUESTED_WITH"]) && strtolower($_SERVER["HTTP_X_REQUESTED_WITH"]) == "xmlhttprequest") {
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
        foreach ([
            "stack" => [],
            "row" => [],
            "length" => 0,
        ] as $name => $val) {
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

};

/**
 * @description: 获取指定隐藏分页地址
 * @param {*} $page 分页对象
 * @param {*} $name 分页名称
 * @Date: 2023-03-21 19:32:45
 * @Author: mulingyuer
 */
function getHidePage($page, $name)
{
    $href;
    getAllPages()->to($page);
    while ($page->next()) {
        if ($page->slug === $name) {
            $href = $page->permalink;
        }
    }
    //判断是否存在
    if (empty($href)) {
        return $name . "页不存在";
    } else {
        return $href;
    }
};