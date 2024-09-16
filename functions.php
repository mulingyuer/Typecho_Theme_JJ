<?php
if (!defined('__TYPECHO_ROOT_DIR__')) {
    exit;
}

// 文章主题样式map
global $markdownThemeMap;
$markdownThemeMap = array(
    'juejin' => _t('掘金'),
    'github' => _t('github'),
    'smartblue' => _t('smartblue'),
    'cyanosis' => _t('cyanosis'),
    'channing-cyan' => _t('channing-cyan'),
    'fancy' => _t('fancy'),
    'hydrogen' => _t('hydrogen'),
    'v-green' => _t('v-green'),
    'vue-pro' => _t('vue-pro'),
    'healer-readable' => _t('healer-readable'),
    'mk-cute' => _t('mk-cute'),
    'geek-black' => _t('geek-black'),
    'qklhk-chocolate' => _t('qklhk-chocolate'),
    'orange' => _t('orange'),
    'scrolls-light' => _t('scrolls-light'),
    'simplicity-green' => _t('simplicity-green'),
    'arknights' => _t('arknights'),
    'vuepress' => _t('vuepress'),
    'nico' => _t('nico'),
    'devui-blue' => _t('devui-blue'),
    'serene-rose' => _t('serene-rose'),
    'z-blue' => _t('z-blue'),
    'minimalism' => _t('minimalism'),
    'yu' => _t('yu'),
    'keepnice' => _t('keepnice'),
);

// 默认文章主题对应的代码高亮map
global $defaultMarkdownThemeHighlightMap;
$defaultMarkdownThemeHighlightMap = array(
    'juejin' => 'juejin',
    'github' => 'github',
    'smartblue' => 'juejin',
    'cyanosis' => 'atom-one-dark',
    'channing-cyan' => 'juejin',
    'fancy' => 'juejin',
    'hydrogen' => 'juejin',
    'v-green' => 'juejin',
    'vue-pro' => 'monokai',
    'healer-readable' => 'srcery',
    'mk-cute' => 'juejin',
    'geek-black' => 'monokai',
    'qklhk-chocolate' => 'juejin',
    'orange' => 'atom-one-light',
    'scrolls-light' => 'juejin',
    'simplicity-green' => 'juejin',
    'arknights' => 'atom-one-light',
    'vuepress' => 'base16/tomorrow-night',
    'nico' => 'atelier-sulphurpool-light',
    'devui-blue' => 'juejin',
    'serene-rose' => 'atom-one-dark',
    'z-blue' => 'androidstudio',
    'minimalism' => 'atom-one-dark',
    'yu' => 'atom-one-dark',
    'keepnice' => 'github',
);

// 代码高亮主题map
global $markdownHighlightMap;
$markdownHighlightMap = array(
    '' => _t('无'),
    'juejin' => _t('掘金'),
    'github' => _t('github'),
    'github-gist' => _t('github-gist'),
    'atom-one-dark' => _t('atom-one-dark'),
    'atom-one-light' => _t('atom-one-light'),
    'monokai' => _t('monokai'),
    'monokai-sublime' => _t('monokai-sublime'),
    'srcery' => _t('srcery'),
    'tomorrow-night-blue' => _t('tomorrow-night-blue'),
    'tomorrow-night-eighties' => _t('tomorrow-night-eighties'),
    'tomorrow-night' => _t('tomorrow-night'),
    'tomorrow' => _t('tomorrow'),
    'atelier-sulphurpool-light' => _t('atelier-sulphurpool-light'),
    'androidstudio' => _t('androidstudio'),
    'a11y-dark' => _t('a11y-dark'),
    'a11y-light' => _t('a11y-light'),
    'zenburn' => _t('zenburn'),
);

/**
 * @description: 主题可视化配置
 * @param {*} $form
 * @Date: 2023-03-21 23:48:01
 * @Author: mulingyuer
 */
function themeConfig($form)
{
    global $markdownThemeMap;

    // head标签底部插入代码
    $headInsertCode = new \Typecho\Widget\Helper\Form\Element\Textarea(
        'headInsertCode',
        null,
        null,
        _t('head标签底部插入代码'),
        _t('放入自定义样式link或者脚本script')
    );
    $form->addInput($headInsertCode);

    // body标签底部插入代码
    $bodyInsertCode = new \Typecho\Widget\Helper\Form\Element\Textarea(
        'bodyInsertCode',
        null,
        null,
        _t('body标签底部插入代码'),
        _t('放入站点统计代码或者自定义脚本')
    );
    $form->addInput($bodyInsertCode);

    // 备案信息
    $filing = new \Typecho\Widget\Helper\Form\Element\Textarea(
        'filing',
        null,
        null,
        _t('备案信息'),
        _t('例子：&lt;div class=&quot;footer-item&quot;&gt;&lt;a href=&quot;备案跳转的链接&quot; target=&quot;_blank&quot; rel=&quot;noopener nofollow&quot;&gt;备案号&lt;/a&gt;&lt;/div&gt;')
    );
    $form->addInput($filing);

    // 文章置顶
    $stickyCidList = new \Typecho\Widget\Helper\Form\Element\Text(
        'stickyCidList',
        null,
        '',
        _t('置顶文章cid列表'),
        _t('请用英文逗号 , 分隔文章cid')
    );
    $form->addInput($stickyCidList);
    // 文章置顶标题高亮tag
    $stickyCidTag = new \Typecho\Widget\Helper\Form\Element\Text(
        'stickyCidTag',
        null,
        '',
        _t('置顶文章标题前面加的tag'),
        _t('请使用html标签，默认：&lt;span class=&quot;article-card-sticky-tag&quot;&gt;置顶&lt;/span&gt;')
    );
    $form->addInput($stickyCidTag);

    // 首页右侧推荐文章cid列表
    $homeRecommendedArticleCidList = new \Typecho\Widget\Helper\Form\Element\Text(
        'homeRecommendedArticleCidList',
        null,
        '',
        _t('首页右侧推荐文章cid列表'),
        _t('请用英文逗号 , 分隔文章cid，最大3篇，务必配置好文章自定义缩略图字段！！！')
    );
    $form->addInput($homeRecommendedArticleCidList);
    // 首页右侧推荐文章tag
    $homeRecommendedArticleTag = new \Typecho\Widget\Helper\Form\Element\Text(
        'homeRecommendedArticleTag',
        null,
        '推荐',
        _t('首页右侧推荐文章tag文字'),
        _t('推荐2个文字')
    );
    $form->addInput($homeRecommendedArticleTag);

    // 文章详情页右侧推荐文章cid
    $articleRecommendedArticleCid = new \Typecho\Widget\Helper\Form\Element\Text(
        'articleRecommendedArticleCid',
        null,
        '',
        _t('文章详情页右侧推荐文章cid'),
        _t('只能填写一个文章cid，务必配置好文章自定义缩略图字段！！！')
    );
    $form->addInput($articleRecommendedArticleCid);
    // 文章详情页右侧推荐文章tag
    $articleRecommendedArticleTag = new \Typecho\Widget\Helper\Form\Element\Text(
        'articleRecommendedArticleTag',
        null,
        '推荐',
        _t('文章详情页右侧推荐文章tag文字'),
        _t('推荐2个文字')
    );
    $form->addInput($articleRecommendedArticleTag);

    $defaultMarkdownTheme = new \Typecho\Widget\Helper\Form\Element\Select(
        'defaultMarkdownTheme',
        $markdownThemeMap,
        'juejin', _t('默认文章和独立页主题'), _t('默认使用掘金主题，非默认选项时优先级大于文章和独立页的默认值')
    );
    $form->addInput($defaultMarkdownTheme);

    // 文章翻页类型
    $paginationType = new \Typecho\Widget\Helper\Form\Element\Select(
        'paginationType',
        array(
            'infinite' => _t('无限滚动'),
            'button' => _t('按钮翻页'),
        ),
        'infinite', _t('文章翻页类型'), _t('默认使用无限滚动')
    );
    $form->addInput($paginationType);

    // 404页面类型
    $errorType = new \Typecho\Widget\Helper\Form\Element\Select(
        'errorType',
        array(
            'chrome' => _t('谷歌浏览器小恐龙'),
            'juejin' => _t('掘金404'),
        ),
        'juejin', _t('404页面类型'), _t('默认使用掘金404')
    );
    $form->addInput($errorType);

    // 底部联系地址
    $address = new \Typecho\Widget\Helper\Form\Element\Text(
        'address',
        null,
        '东之国中远离人里的边境之地',
        _t('底部联系地址'),
        _t('默认幻想乡')
    );
    $form->addInput($address);

    // 自定义文章版权声明
    $customCopyright = new \Typecho\Widget\Helper\Form\Element\Textarea(
        'customCopyright',
        null,
        '',
        _t('自定义文章版权声明'),
        _t('默认空')
    );
    $form->addInput($customCopyright);

    // DocSearch
    $isOpenDocSearch = new \Typecho\Widget\Helper\Form\Element\Radio(
        'isOpenDocSearch',
        array(
            'off' => _t('关闭'),
            'on' => _t('开启'),
        ),
        'off', _t('是否开启DocSearch'), _t('默认关闭')
    );
    $form->addInput($isOpenDocSearch);

    $docSearchAppId = new \Typecho\Widget\Helper\Form\Element\Text(
        'docSearchAppId',
        null,
        '',
        _t('DocSearch AppId'),
        _t('默认为空')
    );
    $form->addInput($docSearchAppId);

    $docSearchApiKey = new \Typecho\Widget\Helper\Form\Element\Text(
        'docSearchApiKey',
        null,
        '',
        _t('DocSearch ApiKey'),
        _t('默认为空')
    );
    $form->addInput($docSearchApiKey);

    $docSearchIndexName = new \Typecho\Widget\Helper\Form\Element\Text(
        'docSearchIndexName',
        null,
        '',
        _t('DocSearch IndexName'),
        _t('默认为空')
    );
    $form->addInput($docSearchIndexName);
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
        $image = Helper::options()->themeUrl . '/static/images/favicon/android-chrome-512x512.png';
    } else {
        $image = articleThumbnail($that);
    }
    //保底图片
    if (!$image) {
        $image = Helper::options()->themeUrl . '/static/images/seo_img_null.jpg';
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
    $fields = unserialize($that->fields);
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
    $fields = unserialize($widget->fields);
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
    $articleHref = $themeUrl . '/static/css/markdown/' . $articleTheme . '.css';
    $articleLink = '<link href="' . $articleHref . '" rel="stylesheet">';
    // 代码高亮主题链接
    $highlightHref = $themeUrl . '/static/css/highlight/' . $highlightTheme . '.css';
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
