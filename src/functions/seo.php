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
    ob_start();
    $that->archiveTitle(array(
        'category' => _t('分类 %s 下的文章'),
        'search' => _t('包含关键字 %s 的文章'),
        'tag' => _t('标签 %s 下的文章'),
        'author' => _t('%s 发布的文章'),
    ), '', ' - ');
    $before = ob_get_clean();
    $title = Helper::options()->title;
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
    $max = max(1, (int) $max);
    $description = trim((string) Helper::options()->description);

    if ($that->is('single')) {
        $excerpt = trim(html_entity_decode(strip_tags((string) $that->excerpt), ENT_QUOTES, 'UTF-8'));
        $excerpt = trim(preg_replace('/\s+/u', ' ', $excerpt));
        if ($excerpt !== '') {
            $description = $excerpt;
        }
    }

    $description = trim(preg_replace('/\s+/u', ' ', strip_tags($description)));
    if (function_exists('mb_substr')) {
        return mb_substr($description, 0, $max, 'UTF-8');
    }

    return substr($description, 0, $max);
}

/**
 * @description: 获取当前页面关键词
 * @param {*} $that 当前页面对象
 * @Date: 2023-03-14 21:02:23
 * @Author: mulingyuer
 */
function blogKeywords($that)
{
    $keywords = array();
    if (isOtherPage($that)) {
        $keywords = explode(',', (string) Helper::options()->keywords());
    } elseif ($that->is('single')) {
        $categories = is_array($that->categories) ? $that->categories : array();
        $tags = is_array($that->tags) ? $that->tags : array();
        $keywords = array_merge(
            array_column($categories, 'name'),
            array_column($tags, 'name')
        );
    }

    $keywords = array_filter(array_map('trim', $keywords), function ($keyword) {
        return $keyword !== '';
    });

    return implode(',', array_values(array_unique($keywords)));
}

/**
 * @description: seo链接
 * @param {*} $that 当前页面对象
 * @Date: 2023-03-14 21:20:53
 * @Author: mulingyuer
 */
function seoUrl($that)
{
    $url = $that->is('single')
        ? $that->permalink
        : $that->request->getRequestUrl();

    return seoAbsoluteUrl($url);
}

/**
 * @description: 将 SEO 资源地址转换为绝对 URL
 * @param string $url
 * @return string
 */
function seoAbsoluteUrl($url)
{
    $url = trim((string) $url);
    if ($url === '') {
        return '';
    }
    if (preg_match('/^https?:\/\//i', $url)) {
        return $url;
    }

    $siteUrl = (string) Helper::options()->siteUrl;
    if (strpos($url, '//') === 0) {
        $scheme = parse_url($siteUrl, PHP_URL_SCHEME) ?: 'https';
        return $scheme . ':' . $url;
    }

    return Typecho\Common::url($url, $siteUrl);
}

/**
 * @description: seo图片
 * @param {*} $that 当前页面对象
 * @Date: 2023-03-14 21:30:30
 * @Author: mulingyuer
 */
function seoImage($that)
{
    if ($that->is('single')) {
        $image = articleThumbnail($that);
        if ($image) {
            return seoAbsoluteUrl($image);
        }
        return themeResourceUrl('/images/seo_img_null.jpg');
    }

    return themeResourceUrl('/images/favicon/web-app-manifest-512x512.png');
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
