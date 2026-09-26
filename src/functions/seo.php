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
 * @description: 固定的一些其他页面
 * @param {*} $that 当前页面对象
 * @Date: 2023-03-22 00:40:07
 * @Author: mulingyuer
 */
function isOtherPage($that)
{
    $isIndex = $that->is('index');
    $isCategory = $that->is('category');
    $isArchive = $that->is('archive');

    return $isIndex || $isCategory || $isArchive;
}

/**
 * @description: 获取当前页面描述
 * @param {*} $that 当前页面对象
 * @param {*} $max 最大字符数，推荐在25-160之间
 * @Date: 2023-05-14 23:22:44
 * @Author: mulingyuer
 */
function blogDescription($that, $max = 160)
{
    $desc = '';
    if (isOtherPage($that)) {
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
    $keywords = '';
    if (isOtherPage($that)) {
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
    $image = '';
    if (isOtherPage($that)) {
        $image = Helper::options()->themeUrl . '/images/favicon/android-chrome-512x512.png';
    } else {
        $image = articleThumbnail($that);
    }
    //保底图片
    if (!$image) {
        $image = Helper::options()->themeUrl . '/images/seo_img_null.jpg';
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

