<?php
if ( ! defined('__TYPECHO_ROOT_DIR__')) {
    exit;
}

/**
 * @description: 主题可视化配置
 * @param {*} $form
 * @Date: 2023-03-21 23:48:01
 * @Author: mulingyuer
 */
function themeConfig($form) {

    $headInsertCode = new \Typecho\Widget\Helper\Form\Element\Textarea(
        'headInsertCode',
        null,
        null,
        _t('head标签底部插入代码'),
        _t('放入自定义样式link或者脚本script')
    );
    $form->addInput($headInsertCode);

    $bodyInsertCode = new \Typecho\Widget\Helper\Form\Element\Textarea(
        'bodyInsertCode',
        null,
        null,
        _t('body标签底部插入代码'),
        _t('放入站点统计代码或者自定义脚本')
    );
    $form->addInput($bodyInsertCode);

    $filing = new \Typecho\Widget\Helper\Form\Element\Textarea(
        'filing',
        null,
        null,
        _t('备案信息'),
        _t('例子：&lt;div class=&quot;footer-item&quot;&gt;&lt;a href=&quot;备案跳转的链接&quot; target=&quot;_blank&quot; rel=&quot;noopener nofollow&quot;&gt;备案号&lt;/a&gt;&lt;/div&gt;')
    );
    $form->addInput($filing);

    $defaultMarkdownTheme = new \Typecho\Widget\Helper\Form\Element\Select(
        'defaultMarkdownTheme',
        array(
            'juejin'          => _t('掘金'),
            'github'          => _t('github'),
            'smartblue'       => _t('smartblue'),
            'cyanosis'        => _t('cyanosis'),
            'channing-cyan'   => _t('channing-cyan'),
            'fancy'           => _t('fancy'),
            'v-green'         => _t('v-green'),
            'mk-cute'         => _t('mk-cute'),
            'qklhk-chocolate' => _t('qklhk-chocolate'),
            'orange'          => _t('orange'),
            'scrolls-light'   => _t('scrolls-light'),
            'vuepress'        => _t('vuepress'),
            'nico'            => _t('nico'),
            'devui-blue'      => _t('devui-blue'),
        ),
        'juejin', _t('默认文章和独立页主题'), _t('默认使用掘金主题，非默认选项时优先级大于文章和独立页的默认值')
    );
    $form->addInput($defaultMarkdownTheme);

    $paginationType = new \Typecho\Widget\Helper\Form\Element\Select(
        'paginationType',
        array(
            'infinite' => _t('无限滚动'),
            'button'   => _t('按钮翻页'),
        ),
        'infinite', _t('文章翻页类型'), _t('默认使用无限滚动')
    );
    $form->addInput($paginationType);

    $errorType = new \Typecho\Widget\Helper\Form\Element\Select(
        'errorType',
        array(
            'chrome' => _t('谷歌浏览器小恐龙'),
            'juejin' => _t('掘金404'),
        ),
        'chrome', _t('404页面类型'), _t('默认使用谷歌浏览器小恐龙')
    );
    $form->addInput($errorType);

    $address = new \Typecho\Widget\Helper\Form\Element\Text(
        'address',
        null,
        '东之国中远离人里的边境之地',
        _t('底部联系地址'),
        _t('默认幻想乡')
    );
    $form->addInput($address);

    // $sidebarBlock = new \Typecho\Widget\Helper\Form\Element\Checkbox(
    //     'sidebarBlock',
    //     [
    //         'ShowRecentPosts' => _t('显示最新文章'),
    //         'ShowRecentComments' => _t('显示最近回复'),
    //         'ShowCategory' => _t('显示分类'),
    //         'ShowArchive' => _t('显示归档'),
    //         'ShowOther' => _t('显示其它杂项'),
    //     ],
    //     ['ShowRecentPosts', 'ShowRecentComments', 'ShowCategory', 'ShowArchive', 'ShowOther'],
    //     _t('侧边栏显示')
    // );

    // $form->addInput($sidebarBlock->multiMode());
}

/**
 * @description: 获取当前页面标题
 * @param {*} $that 当前页面对象
 * @Date: 2023-03-14 20:50:07
 * @Author: mulingyuer
 */
function blogTitle($that) {
    $before = $that->archiveTitle(array(
        'category' => _t('分类 %s 下的文章'),
        'search'   => _t('包含关键字 %s 的文章'),
        'tag'      => _t('标签 %s 下的文章'),
        'author'   => _t('%s 发布的文章'),
    ), '', ' - ');
    $title = Helper::options()->title();
    return $before.$title;
}

/**
 * @description: 固定的一些其他页面
 * @param {*} $that 当前页面对象
 * @Date: 2023-03-22 00:40:07
 * @Author: mulingyuer
 */
function isOtherPage($that) {
    $isIndex    = $that->is('index');
    $isCategory = $that->is('category');
    $isArchive  = $that->is('archive');

    return $isIndex || $isCategory || $isArchive;
}

/**
 * @description: 获取当前页面描述
 * @param {*} $that 当前页面对象
 * @param {*} $max 最大字符数，推荐在25-160之间
 * @Date: 2023-05-14 23:22:44
 * @Author: mulingyuer
 */
function blogDescription($that, $max = 160) {
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
function blogKeywords($that) {
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
function seoUrl($that) {
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
function seoImage($that) {
    $image = '';
    if (isOtherPage($that)) {
        $image = Helper::options()->themeUrl.'/static/images/favicon/android-chrome-512x512.png';
    } else {
        $image = articleThumbnail($that);
    }
    //保底图片
    if ( ! $image) {
        $image = Helper::options()->themeUrl.'/static/images/seo_img_null.jpg';
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
function isParentActive($activeSlug, $category, $children) {

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
function secondaryAllActive($that, $category, $children) {
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
function timeFormatting($time) {
    if ($time == 'no') {return;}
    $chunks = array(
        array(31536000, ' 年'),
        array(2592000, ' 个月'),
        array(604800, ' 周'),
        array(86400, ' 天'),
        array(3600, ' 小时'),
        array(60, ' 分钟'),
        array(1, ' 秒'),
    );
    $newer_date = time();
    $since      = abs($newer_date - $time);

    for ($i = 0, $j = count($chunks); $i < $j; $i++) {
        $seconds = $chunks[$i][0];
        $name    = $chunks[$i][1];
        if (($count = floor($since / $seconds)) != 0) {
            break;
        }

    }
    $output = $count.$name.'前';

    echo $output;
}

/**
 * @description: 获取文章缩略图
 * @param {*} $that
 * @Date: 2023-03-19 17:03:31
 * @Author: mulingyuer
 */
function articleThumbnail($that) {
    $attach  = $that->attachments(1)->attachment;
    $pattern = '/\<img.*?src\=\"(.*?)\"[^>]*>/i';

    //如果有自定义缩略图
    if ($that->fields->titleImg) {
        return $that->fields->titleImg;
    } elseif ($that->fields->thumb) {
        return $that->fields->thumb;
    } elseif (preg_match_all($pattern, $that->content, $thumbUrl) && strlen($thumbUrl[1][0]) > 7) {
        return $thumbUrl[1][0];
    } elseif ($attach->isImage) {
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
function articleViews($that, $format0 = '%d', $format1 = '%d', $formats = '%d', $return = false, $field = 'views') {
    $fields = unserialize($that->fields);
    if (array_key_exists($field, $fields)) {
        $fieldValue = ( ! empty($fields[$field])) ? intval($fields[$field]) : 0;
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
        echo $fieldValue;
    }
}

/**
 * @description: 文章点赞数
 * @param {*} $that 当前页面对象
 * @Date: 2023-03-24 23:19:56
 * @Author: mulingyuer
 */
function getLikeCount($that) {

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
function promo($widget) {

    $user          = $widget->widget('Widget_User');
    $db            = Typecho_Db::get();
    $fields        = unserialize($widget->fields);
    $allowOperates = array('get', 'set', 'inc', 'dec'); // 这里可以扩展操作，建议屏蔽get/set
    $allowFields   = array('likes'); // 这里可以扩展修改字段

    // 获取操作
    $operate = $widget->request->get('operate');
    $field   = $widget->request->get('field');
    $value   = $widget->request->filter('int')->get('value');
    $value   = $value === null ? 100 : $value; // 100 起步

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
        $value             = intval($fields[$field]) + 1;
        $widget->setField($field, 'str', $value, $widget->cid);
        $result[$field] = $value;
        $widget->response->throwJson(array('status' => 1, 'msg' => _t('已完成操作'), 'result' => json_encode($result)));
    } elseif ($operate === 'dec') {
        $result['operate'] = 'dec';
        $value             = intval($fields[$field]) - 1;
        $result[$field]    = $value;
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
function isAjax() {
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
function getAllPages() {
    $db = Typecho_Db::get();
    if (class_exists('\Typecho\Widget')) {
        $widget = \Widget\Contents\Page\Rows::alloc();
        foreach (array(
            'stack'  => array(),
            'row'    => array(),
            'length' => 0,
        ) as $name => $val) {
            try {
                $reflect  = new ReflectionClass($widget);
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
function getHidePage($page, $name) {
    $href;
    getAllPages()->to($page);
    while ($page->next()) {
        if ($page->slug === $name) {
            $href = $page->permalink;
        }
    }
    //判断是否存在
    if (empty($href)) {
        return $name.'页不存在';
    } else {
        return $href;
    }
};

/**
 * @description: 自定义关键字
 * @Date: 2023-03-22 20:28:04
 * @Author: mulingyuer
 */
if ($_SERVER['SCRIPT_NAME'] == '/admin/write-post.php' || $_SERVER['SCRIPT_NAME'] == '/admin/write-page.php') {
    function themeFields($layout) {
        //文章独享关键字
        if ($_SERVER['SCRIPT_NAME'] == '/admin/write-post.php') {

            //自定义文章缩略图
            $thumb = new Typecho_Widget_Helper_Form_Element_Text('thumb', null, null, _t('自定义缩略图'), _t('输入缩略图地址(仅文章有效)<style>.wmd-button-row {height:auto;}</style>'));
            $layout->addItem($thumb);
            //文章内容标题图
            $titleImg = new Typecho_Widget_Helper_Form_Element_Text('titleImg', null, null, _t('自定义文章内容标题图'), _t('输入文章内容标题图地址(仅文章有效)<style>.wmd-button-row {height:auto;}</style>'));
            $layout->addItem($titleImg);
        }
        // 文章主题
        $markdownTheme = new Typecho_Widget_Helper_Form_Element_Select('markdownTheme', array(
            'juejin'          => _t('掘金'),
            'github'          => _t('github'),
            'smartblue'       => _t('smartblue'),
            'cyanosis'        => _t('cyanosis'),
            'channing-cyan'   => _t('channing-cyan'),
            'fancy'           => _t('fancy'),
            'v-green'         => _t('v-green'),
            'mk-cute'         => _t('mk-cute'),
            'qklhk-chocolate' => _t('qklhk-chocolate'),
            'orange'          => _t('orange'),
            'scrolls-light'   => _t('scrolls-light'),
            'vuepress'        => _t('vuepress'),
            'nico'            => _t('nico'),
            'devui-blue'      => _t('devui-blue'),
        ), 'juejin', _t('文章主题'), _t('默认使用掘金主题'));
        $layout->addItem($markdownTheme);
    }
}
;

/**
 * @description: 获取文章title图片
 * @param {*} $that
 * @Date: 2023-03-22 20:28:15
 * @Author: mulingyuer
 */
function getArticleTitleImg($that) {
    return $that->fields->titleImg;
};

/**
 * @description: 获取文章主题
 * @param {*} $that
 * @Date: 2023-03-23 00:44:46
 * @Author: mulingyuer
 */
function getArticleTheme($that) {
    $defaultTheme = Helper::options()->defaultMarkdownTheme;
    $fieldsTheme  = $that->fields->markdownTheme;
    if (empty($fieldsTheme)) {
        $fieldsTheme = 'juejin';
    }

    $theme = 'juejin';

    if ($defaultTheme !== 'juejin' && $fieldsTheme === 'juejin') {
        $theme = $defaultTheme;
    } else {
        $theme = $fieldsTheme;
    }

    return $theme;
};

/**
 * @description: 获取用户组
 * @Date: 2023-03-23 05:10:27
 * @Author: mulingyuer
 */
function getGroup($uid = 0) {
    $db    = Typecho_Db::get();
    $prow  = $db->fetchRow($db->select('group')->from('table.users')->where('uid = ?', $uid));
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
function chineseUserGroup($uid = null) {
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
};

/**
 * @description: 给文章内容标题添加锚点
 * @param {*} $content 文章内容
 * @Date: 2023-03-23 20:43:02
 * @Author: mulingyuer
 */
function addAnchorPoint($content) {
    global $catalog;
    global $catalog_count;
    $catalog       = array();
    $catalog_count = 0;
    $content       = preg_replace_callback('/<h([1-6])(.*?)>(.*?)<\/h\1>/i', function ($content) {
        global $catalog;
        global $catalog_count;
        $catalog_count++;
        $catalog[] = array('text' => trim(strip_tags($content[3])), 'depth' => $content[1], 'count' => $catalog_count);
        return '<h'.$content[1].$content[2].' id="heading-'.$catalog_count.'">'.$content[3].'</h'.$content[1].'>';
    }, $content);
    return $content;
}

/**
 * @description: 获取文章目录树
 * @Date: 2023-03-23 20:36:47
 * @Author: mulingyuer
 */
function getDirectoryTree() {
    global $catalog;
    $index = '';
    if ($catalog) {
        $index      = '<ul class="directory-tree-list">'."\n";
        $prev_depth = '';
        $to_depth   = 0;
        foreach ($catalog as $catalog_item) {
            $catalog_depth = $catalog_item['depth'];
            if ($prev_depth) {
                if ($catalog_depth == $prev_depth) {
                    $index .= ''."\n";
                } elseif ($catalog_depth > $prev_depth) {
                    $to_depth++;
                    $index .= '<ul class="directory-tree-sub-list">'."\n";
                } else {
                    $to_depth2 = ($to_depth > ($prev_depth - $catalog_depth)) ? ($prev_depth - $catalog_depth) : $to_depth;
                    if ($to_depth2) {
                        for ($i = 0; $i < $to_depth2; $i++) {
                            $index .= ''."\n".'</ul>'."\n";
                            $to_depth--;
                        }
                    }
                    $index .= '';
                }
            }
            $index .= '<li class="directory-tree-list-item"><div class="directory-tree-list-item-container"><a class="directory-tree-list-item-link" href="#heading-'.$catalog_item['count'].'" data-scroll="#heading-'.$catalog_item['count'].'" title="'.$catalog_item['text'].'"><i class="jj-icon jj-icon-send directory-tree-list-item-icon"></i>'.$catalog_item['text'].'</a></div>';
            $prev_depth = $catalog_item['depth'];
        }
        for ($i = 0; $i <= $to_depth; $i++) {
            $index .= ''."\n".'</li></ul>'."\n";
        }
        // $index = '<div id="toc-container">'."\n".'<div id="toc">'."\n".'<strong>文章目录</strong>'."\n".$index.'</div>'."\n".'</div>'."\n";
    }
    if ( ! $index) {
        echo '<ul class="directory-tree-list"><div class="directory-tree-list-empty">暂无目录</div></ul>';
    } else {
        echo $index;
    }
};

/**
 * 增加浏览次数
 * 使用方法: 在<code>themeInit</code>函数中添加代码
 * <pre>if($archive->is('single') || $archive->is('page')){ viewsCounter($archive);}</pre>
 *
 * @param Widget_Archive $widget
 * @return boolean
 */

function viewsCounter($widget, $field = 'views') {
    if ( ! $widget instanceof Widget_Archive) {
        return false;
    }

    $fieldValue   = articleViews($widget, '%d', '%d', '%d', true, $field);
    $fieldRecords = Typecho_Cookie::get('__typecho_'.$field);
    if (empty($fieldRecords)) {
        $fieldRecords = array();
    } else {
        $fieldRecords = explode(',', $fieldRecords);
    }

    if ( ! in_array($widget->cid, $fieldRecords)) {
        $fieldValue = $fieldValue + 1;
        $widget->setField($field, 'str', strval($fieldValue), $widget->cid);
        $fieldRecords[] = $widget->cid;
        $fieldRecords   = implode(',', $fieldRecords);
        Typecho_Cookie::set('__typecho_'.$field, $fieldRecords);
        return true;
    }
    return false;
};

/**
 * @description: 获取浏览器信息
 * @param {*} $agent 浏览器信息
 * @Date: 2023-03-24 13:33:39
 * @Author: mulingyuer
 */
function getBrowser($agent) {
    if (preg_match('/MSIE\s([^\s|;]+)/i', $agent, $regs)) {
        $outputer = 'Internet Explore';
    } elseif (preg_match('/FireFox\/([^\s]+)/i', $agent, $regs)) {
        $str1         = explode('Firefox/', $regs[0]);
        $FireFox_vern = explode('.', $str1[1]);
        $outputer     = 'FireFox';
    } elseif (preg_match('/Maxthon([\d]*)\/([^\s]+)/i', $agent, $regs)) {
        $str1         = explode('Maxthon/', $agent);
        $Maxthon_vern = explode('.', $str1[1]);
        $outputer     = 'MicroSoft Edge';
    } elseif (preg_match('#360([a-zA-Z0-9.]+)#i', $agent, $regs)) {
        $outputer = '360 Fast Browser';
    } elseif (preg_match('/Edge([\d]*)\/([^\s]+)/i', $agent, $regs)) {
        $str1      = explode('Edge/', $regs[0]);
        $Edge_vern = explode('.', $str1[1]);
        $outputer  = 'MicroSoft Edge';
    } elseif (preg_match('/UC/i', $agent)) {
        $str1           = explode('rowser/', $agent);
        $UCBrowser_vern = explode('.', $str1[1]);
        $outputer       = 'UC Browser';
    } elseif (preg_match('/QQ/i', $agent, $regs) || preg_match('/QQ Browser\/([^\s]+)/i', $agent, $regs)) {
        $str1     = explode('rowser/', $agent);
        $QQ_vern  = explode('.', $str1[1]);
        $outputer = 'QQ Browser';
    } elseif (preg_match('/UBrowser/i', $agent, $regs)) {
        $str1           = explode('rowser/', $agent);
        $UCBrowser_vern = explode('.', $str1[1]);
        $outputer       = 'UC Browser';
    } elseif (preg_match('/Opera[\s|\/]([^\s]+)/i', $agent, $regs)) {
        $outputer = 'Opera';
    } elseif (preg_match('/Chrome([\d]*)\/([^\s]+)/i', $agent, $regs)) {
        $str1        = explode('Chrome/', $agent);
        $chrome_vern = explode('.', $str1[1]);
        $outputer    = 'Google Chrome';
    } elseif (preg_match('/safari\/([^\s]+)/i', $agent, $regs)) {
        $str1        = explode('Version/', $agent);
        $safari_vern = explode('.', $str1[1]);
        $outputer    = 'Safari';
    } else {
        $outputer = 'Google Chrome';
    }
    echo $outputer;
};

/**
 * @description: 获取操作系统信息
 * @param {*} $agent 浏览器信息
 * @Date: 2023-03-24 13:34:12
 * @Author: mulingyuer
 */
function getOs($agent) {
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
};

/**
 * @description: 子评论回复@
 * @param {*} $coid 评论id
 * @Date: 2023-03-24 13:36:10
 * @Author: mulingyuer
 */
function get_comment_at($coid) {
    $db   = Typecho_Db::get();
    $prow = $db->fetchRow($db->select('parent')->from('table.comments')
            ->where('coid = ? AND status = ?', $coid, 'approved'));
    $parent = $prow['parent'];
    if ($parent != '0') {
        $arow = $db->fetchRow($db->select('author')->from('table.comments')
                ->where('coid = ? AND status = ?', $parent, 'approved'));
        $author = $arow['author'];
        if ($author) {
            $href = '<a class="comment-list-item-relation" href="#comment-'.$parent.'">@'.$author.'</a>';
            echo $href;
        } else {
            echo '';
        }
    } else {
        echo '';
    }
};

/**
 * @description: 去除评论内容的p容器标签
 * @param {*} $content 评论内容
 * @Date: 2023-04-08 09:06:16
 * @Author: mulingyuer
 */
function remove_comment_p($content) {
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
function getArticleSummary($that, $maxLength = 80) {
    $content  = $that->excerpt;
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
function getIdPosts($id) {
    $permalink = '';
    $title     = '';

    if ($id) {
        $getid  = explode(',', $id);
        $db     = Typecho_Db::get();
        $result = $db->fetchAll($db->select()->from('table.contents')
                ->where('status = ?', 'publish')
                ->where('type = ?', 'post')
                ->where('cid in ?', $getid)
                ->order('cid', Typecho_Db::SORT_DESC)
        );
        if ( ! $result) {
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
                $val       = Typecho_Widget::widget('Widget_Abstract_Contents')->push($val);
                $title     = htmlspecialchars($val['title']);
                $permalink = $val['permalink'];
            }
        }
    }

    return array(
        'title'     => $title,
        'permalink' => $permalink,
    );
}

//主题themeInit函数
function themeInit($archive) {
    //评论回复楼层最高999层.这个正常设置最高只有7层
    Helper::options()->commentsMaxNestingLevels = 999;
    //自动增加浏览次数
    if ($archive->is('single') || $archive->is('page')) {viewsCounter($archive);}
    ;
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

}
