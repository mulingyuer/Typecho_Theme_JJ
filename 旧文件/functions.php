<?php
if (!defined('__TYPECHO_ROOT_DIR__')) {
    exit;
}

?>

<?php
//主题设置
function themeConfig($form)
{
    ?>
  <!-- 设置的ui样式 -->
  <style>
    input[type="text"] {width:100%;}
    .list-unstyled {list-style: none;padding-left:0 !important;}
    .muflow-half label { display:block;margin-bottom: .5em;font-weight: bold;}
    .muflow-half select {width:150px;}
    .muflow-half .multiline {display:flex;align-items: center;margin-bottom: .5em;}
    .muflow-half .multiline label {font-weight: normal;margin-bottom: 0;}
    .muflow-half .multiline input {margin-right:.5em;}

    .muflow-clear {clear: both;}
  </style>
<?php
//统计代码
    $statisticalCode = new Typecho_Widget_Helper_Form_Element_Textarea('statisticalCode', null, null, _t('统计代码'), _t('统计代码是带&lt;script&gt;标签的，不要漏了。'));
    $statisticalCode->setAttribute('class', 'list-unstyled muflow-half muflow-clear typecho-option');
    $form->addInput($statisticalCode);

    //备案号
    $recordNumber = new Typecho_Widget_Helper_Form_Element_Text('recordNumber', null, null, _t('备案号'), _t('默认：无，例：湘ICP备xxxxxx号'));
    $form->addInput($recordNumber);
    //备案跳转的链接
    $recordLink = new Typecho_Widget_Helper_Form_Element_Text('recordLink', null, null, _t('备案跳转的链接'), _t('默认：无，例：https://xxxx.xxx'));
    $form->addInput($recordLink);

}

// 主题目录path
function themeUrl($path)
{
    return Helper::options()->themeUrl($path);
}

// 自定义关键字
if ($_SERVER['SCRIPT_NAME'] == "/admin/write-post.php") {
    function themeFields($layout)
    {
        //自定义文章缩略图
        $thumb = new Typecho_Widget_Helper_Form_Element_Text('thumb', null, null, _t('自定义缩略图'), _t('输入缩略图地址(仅文章有效)<style>.wmd-button-row {height:auto;}</style>'));
        $layout->addItem($thumb);
        //文章内容标题图
        $titleImg = new Typecho_Widget_Helper_Form_Element_Text('titleImg', null, null, _t('自定义文章内容标题图'), _t('输入文章内容标题图地址(仅文章有效)<style>.wmd-button-row {height:auto;}</style>'));
        $layout->addItem($titleImg);
    }
}
;

//筛选多余的ajax获取的内容
function is_ajax()
{
    if (isset($_SERVER["HTTP_X_REQUESTED_WITH"]) && strtolower($_SERVER["HTTP_X_REQUESTED_WITH"]) == "xmlhttprequest") {
        return true;
    }
    return false;
}

//判断数组中是否存在mid
function isMidInArray($arr, $mids)
{
    $flag = false;
    foreach ($mids as $mid) {
        if (in_array($mid['mid'], $arr)) {
            $flag = true;
            break;
        }
    }
    return $flag;
}

/**输出作者文章总数，可以指定*/
function authArticleTotal($authorId)
{
    $users = Typecho_Widget::widget('Widget_Users_Admin')->to($users);
    //循环用户列表
    while ($users->next()) {
        if ($users->uid == $authorId) {
            $users->postsNum();
            break;
        }
    }
};

// 获取浏览器信息
function getBrowser($agent)
{
    if (preg_match('/MSIE\s([^\s|;]+)/i', $agent, $regs)) {
        $outputer = 'Internet Explore';
    } else if (preg_match('/FireFox\/([^\s]+)/i', $agent, $regs)) {
        $str1 = explode('Firefox/', $regs[0]);
        $FireFox_vern = explode('.', $str1[1]);
        $outputer = 'FireFox';
    } else if (preg_match('/Maxthon([\d]*)\/([^\s]+)/i', $agent, $regs)) {
        $str1 = explode('Maxthon/', $agent);
        $Maxthon_vern = explode('.', $str1[1]);
        $outputer = 'MicroSoft Edge';
    } else if (preg_match('#360([a-zA-Z0-9.]+)#i', $agent, $regs)) {
        $outputer = '360 Fast Browser';
    } else if (preg_match('/Edge([\d]*)\/([^\s]+)/i', $agent, $regs)) {
        $str1 = explode('Edge/', $regs[0]);
        $Edge_vern = explode('.', $str1[1]);
        $outputer = 'MicroSoft Edge';
    } else if (preg_match('/UC/i', $agent)) {
        $str1 = explode('rowser/', $agent);
        $UCBrowser_vern = explode('.', $str1[1]);
        $outputer = 'UC Browser';
    } else if (preg_match('/QQ/i', $agent, $regs) || preg_match('/QQ Browser\/([^\s]+)/i', $agent, $regs)) {
        $str1 = explode('rowser/', $agent);
        $QQ_vern = explode('.', $str1[1]);
        $outputer = 'QQ Browser';
    } else if (preg_match('/UBrowser/i', $agent, $regs)) {
        $str1 = explode('rowser/', $agent);
        $UCBrowser_vern = explode('.', $str1[1]);
        $outputer = 'UC Browser';
    } else if (preg_match('/Opera[\s|\/]([^\s]+)/i', $agent, $regs)) {
        $outputer = 'Opera';
    } else if (preg_match('/Chrome([\d]*)\/([^\s]+)/i', $agent, $regs)) {
        $str1 = explode('Chrome/', $agent);
        $chrome_vern = explode('.', $str1[1]);
        $outputer = 'Google Chrome';
    } else if (preg_match('/safari\/([^\s]+)/i', $agent, $regs)) {
        $str1 = explode('Version/', $agent);
        $safari_vern = explode('.', $str1[1]);
        $outputer = 'Safari';
    } else {
        $outputer = 'Google Chrome';
    }
    echo $outputer;
};

// 获取操作系统信息
function getOs($agent)
{
    $os = false;
    if (preg_match('/win/i', $agent)) {
        if (preg_match('/nt 6.0/i', $agent)) {
            $os = 'Windows Vista';
        } else if (preg_match('/nt 6.1/i', $agent)) {
            $os = 'Windows 7';
        } else if (preg_match('/nt 6.2/i', $agent)) {
            $os = 'Windows 8';
        } else if (preg_match('/nt 6.3/i', $agent)) {
            $os = 'Windows 8.1';
        } else if (preg_match('/nt 5.1/i', $agent)) {
            $os = 'Windows XP';
        } else if (preg_match('/nt 10.0/i', $agent)) {
            $os = 'Windows 10';
        } else {
            $os = 'Windows X64';
        }
    } else if (preg_match('/android/i', $agent)) {
        if (preg_match('/android 9/i', $agent)) {
            $os = 'Android Pie';
        } else if (preg_match('/android 8/i', $agent)) {
            $os = 'Android Oreo';
        } else {
            $os = 'Android';
        }
    } else if (preg_match('/ubuntu/i', $agent)) {
        $os = 'Ubuntu';
    } else if (preg_match('/linux/i', $agent)) {
        $os = 'Linux';
    } else if (preg_match('/iPhone/i', $agent)) {
        $os = 'iPhone';
    } else if (preg_match('/mac/i', $agent)) {
        $os = 'MacOS';
    } else if (preg_match('/fusion/i', $agent)) {
        $os = 'Android';
    } else {
        $os = 'Linux';
    }
    echo $os;
};

//目录树
function createCatalog($obj)
{ //为文章标题添加锚点
    global $catalog;
    global $catalog_count;
    $catalog = array();
    $catalog_count = 0;
    $obj = preg_replace_callback('/<h([1-6])(.*?)>(.*?)<\/h\1>/i', function ($obj) {
        global $catalog;
        global $catalog_count;
        $catalog_count++;
        $catalog[] = array('text' => trim(strip_tags($obj[3])), 'depth' => $obj[1], 'count' => $catalog_count);
        return '<h' . $obj[1] . $obj[2] . ' id="mu-post-title-' . $catalog_count . '">' . $obj[3] . '</h' . $obj[1] . '>';
    }, $obj);
    return $obj;
}

//输出文章目录容器
function getCatalog()
{
    global $catalog;
    $index = '';
    if ($catalog) {
        $index = '<nav class="catalog-nav">' . "\n";
        $prev_depth = '';
        $to_depth = 0;
        foreach ($catalog as $catalog_item) {
            $catalog_depth = $catalog_item['depth'];
            if ($prev_depth) {
                if ($catalog_depth == $prev_depth) {
                    $index .= '' . "\n";
                } elseif ($catalog_depth > $prev_depth) {
                    $to_depth++;
                    $index .= '<nav class="catalog-nav catalog-nav-sub">' . "\n";
                } else {
                    $to_depth2 = ($to_depth > ($prev_depth - $catalog_depth)) ? ($prev_depth - $catalog_depth) : $to_depth;
                    if ($to_depth2) {
                        for ($i = 0; $i < $to_depth2; $i++) {
                            $index .= '' . "\n" . '</nav>' . "\n";
                            $to_depth--;
                        }
                    }
                    $index .= '';
                }
            }
            $index .= '<a class="nav-link" href="#mu-post-title-' . $catalog_item['count'] . '" data-scroll="#mu-post-title-' . $catalog_item['count'] . '">' . $catalog_item['text'] . '</a>';
            $prev_depth = $catalog_item['depth'];
        }
        for ($i = 0; $i <= $to_depth; $i++) {
            $index .= '' . "\n" . '</nav>' . "\n";
        }
        // $index = '<div id="toc-container">'."\n".'<div id="toc">'."\n".'<strong>文章目录</strong>'."\n".$index.'</div>'."\n".'</div>'."\n";
    }
    if (!$index) {
        echo '<nav class="navbar catalog-nav"><a href="##">暂无目录</a></nav>';
    } else {
        echo $index;
    }
};

//获取隐藏独立页
function getAllPages()
{
    $db = Typecho_Db::get();
    $widget = new Widget_Contents_Page_List(Typecho_Request::getInstance(), Typecho_Widget_Helper_Empty::getInstance(), null);
    $db->fetchAll($db->select()
            ->from('table.contents')
            ->where('table.contents.type = ?', 'page')
            ->where('table.contents.status = ? or table.contents.status = ?', 'publish', 'hidden')
            ->where('table.contents.created < ?', Helper::options()->time), array($widget, 'push'));
    return $widget;
};

//获取指定隐藏分页地址
function getHidePage($pages, $name)
{
    $href;
    getAllPages()->to($pages);
    while ($pages->next()) {
        if ($pages->slug === $name) {
            $href = $pages->permalink;
        }
    }
    //判断是否存在
    if (empty($href)) {
        return $name . "页不存在";
    } else {
        return $href;
    }
};

//获取当前页面完整URL,用于登录后回到当前页
function curPageURL()
{
    $pageURL = 'http';
    if ($_SERVER["HTTPS"] == "on") {
        $pageURL .= "s";
    }
    $pageURL .= "://";

    if ($_SERVER["SERVER_PORT"] != "80") {
        $pageURL .= $_SERVER["SERVER_NAME"] . ":" . $_SERVER["SERVER_PORT"] . $_SERVER["REQUEST_URI"];
    } else {
        $pageURL .= $_SERVER["SERVER_NAME"] . $_SERVER["REQUEST_URI"];
    }
    return $pageURL;
};

//获取文章缩略图，没有则随机
function get_ArticleThumbnail($widget)
{
    // 当文章无图片时的随机缩略图
    $rand = mt_rand(1, 45); // 随机 1-9 张缩略图
    // 缩略图加速
    $rand_url;
    if (!empty(Helper::options()->articleImgSpeed)) {
        $rand_url = Helper::options()->articleImgSpeed;
    } else {
        $rand_url = $widget->widget('Widget_Options')->themeUrl . '/images/articles/';
    }
    $random = $rand_url . $rand . '.jpg'; // 随机缩略图路径

    $attach = $widget->attachments(1)->attachment;
    $pattern = '/\<img.*?src\=\"(.*?)\"[^>]*>/i';

    //如果有自定义缩略图
    if ($widget->fields->titleImg) {
        return $widget->fields->titleImg;
    } else if ($widget->fields->thumb) {
        return $widget->fields->thumb;
    } else if (preg_match_all($pattern, $widget->content, $thumbUrl) && strlen($thumbUrl[1][0]) > 7) {
        return $thumbUrl[1][0];
    } else if ($attach->isImage) {
        return $attach->url;
    } else {
        return "";
    }
};

//获取文章title图片
function getArticleTitleImg($widget)
{
    return $widget->fields->titleImg;
}

//获取访问次数
function views($widget, $format0 = "%d", $format1 = "%d", $formats = "%d", $return = false, $field = 'views')
{
    $fields = unserialize($widget->fields);
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
};

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

    $fieldValue = views($widget, "%d", "%d", "%d", true, $field);
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
};

//随机文章cid
function randomPostMid($limit = 10)
{
    $db = Typecho_Db::get();
    $result = $db->fetchAll(
        $db->select()->from('table.contents')
            ->where('status = ?', 'publish')
            ->where('type = ?', 'post')
            ->where('created <= unix_timestamp(now())', 'post')
            ->limit($limit)
            ->order('RAND()')
    );
    $array = array();
    if ($result) {
        $i = 1;
        foreach ($result as $val) {
            $val = Typecho_Widget::widget('Widget_Abstract_Contents')->push($val);
            array_push($array, $val['cid']);
            $i++;
        }
    }
    return implode(',', $array);
};

//调用指定文章集合
class Widget_Post_fanjubiao extends Widget_Abstract_Contents
{
    public function __construct($request, $response, $params = null)
    {
        parent::__construct($request, $response, $params);
        $this->parameter->setDefault(array('pageSize' => $this->options->commentsListSize, 'parentId' => 0, 'ignoreAuthor' => false));
    }
    public function execute()
    {
        $select = $this->select()->from('table.contents')
            ->where("table.contents.password IS NULL OR table.contents.password = ''")
            ->where('table.contents.type = ?', 'post')
            ->limit($this->parameter->pageSize)
            ->order('table.contents.modified', Typecho_Db::SORT_DESC);

        if ($this->parameter->fanjubiao) {
            $fanju = explode(",", $this->parameter->fanjubiao);
            $select->where('table.contents.cid in ?', $fanju);
        }
        $this->db->fetchAll($select, array($this, 'push'));
    }
};

//获取推荐文章数组
function getRecommendArr()
{
    $recommendID = explode(",", trim(Helper::options()->recommendID));
    return $recommendID;
};

//个性时间
function timesince($older_date, $comment_date = false)
{
    if ($older_date == "no") {return;}
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
    $since = abs($newer_date - $older_date);

    for ($i = 0, $j = count($chunks); $i < $j; $i++) {
        $seconds = $chunks[$i][0];
        $name = $chunks[$i][1];
        if (($count = floor($since / $seconds)) != 0) {
            break;
        }

    }
    $output = $count . $name . '前';

    echo $output;
};

//点赞函数
function likeup($ccid, $kg)
{
    $cid = $ccid;
    $action = false;
    $db = Typecho_Db::get();
    $prefix = $db->getPrefix();
    if (!array_key_exists('likes', $db->fetchRow($db->select()->from('table.contents')))) {
        $db->query('ALTER TABLE `' . $prefix . 'contents` ADD `likes` INT(10) DEFAULT 0;');
        return;
    }
    $row = $db->fetchRow($db->select('likes')->from('table.contents')->where('cid = ?', $cid));
    $num = $row['likes'];

    if ($kg == "do") {
        $db->query($db->update('table.contents')->rows(array('likes' => (int) $row['likes'] + 1))->where('cid = ?', $cid));
        $num = $num + 1;
        $action = true;
        // setcookie("like_".$cid, $cid, time()+31536000);
    }
    if ($kg == "undo") {
        $db->query($db->update('table.contents')->rows(array('likes' => (int) $row['likes'] - 1))->where('cid = ?', $cid));
        $num = $num - 1;
        $action = false;
        // setcookie("like_".$cid, "");
    }
    $arr = array('id' => $cid, 'count' => $num, 'active' => $action);
    echo json_encode($arr);
};

//获取点赞数
function getLikeCount($cid)
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
};

/**
 * 显示上一篇
 *
 * @access public
 * @param string $default 如果没有下一篇,返回null
 * @return void
 */
function thePrevCid($widget, $default = null)
{
    $db = Typecho_Db::get();
    $sql = $db->select()->from('table.contents')
        ->where('table.contents.created < ?', $widget->created)
        ->where('table.contents.status = ?', 'publish')
        ->where('table.contents.type = ?', $widget->type)
        ->where('table.contents.password IS NULL')
        ->order('table.contents.created', Typecho_Db::SORT_DESC)
        ->limit(1);
    $content = $db->fetchRow($sql);

    if ($content) {
        return $content["cid"];
    } else {
        return $default;
    }
};

/**
 * 获取下一篇文章mid
 *
 * @access public
 * @param string $default 如果没有下一篇,返回null
 * @return void
 */
function theNextCid($widget, $default = null)
{
    $db = Typecho_Db::get();
    $sql = $db->select()->from('table.contents')
        ->where('table.contents.created > ?', $widget->created)
        ->where('table.contents.status = ?', 'publish')
        ->where('table.contents.type = ?', $widget->type)
        ->where('table.contents.password IS NULL')
        ->order('table.contents.created', Typecho_Db::SORT_ASC)
        ->limit(1);
    $content = $db->fetchRow($sql);

    if ($content) {
        return $content["cid"];
    } else {
        return $default;
    }
};

//查询用户组
function yonghuzu($uid = 0)
{
    $db = Typecho_Db::get();
    $prow = $db->fetchRow($db->select('group')->from('table.users')->where('uid = ?', $uid));
    $group = $prow['group'];
    if (empty($group)) {$group = "visitor";}

    return $group;
};

//中文转义用户组
function zhGroup($uid = null)
{
    $userGroup = yonghuzu($uid);
    $zhUserGroup;
    switch ($userGroup) {
        case "administrator":
            $zhUserGroup = "博主";
            break;
        case "editor":
            $zhUserGroup = "编辑";
            break;
        case "contributor":
            $zhUserGroup = "贡献者";
            break;
        case "subscriber":
            $zhUserGroup = "粉丝";
            break;
        default:
            $zhUserGroup = "访客";
    }

    if (empty($zhUserGroup)) {
        $zhUserGroup = "未知用户";
    }
    echo $zhUserGroup;
};

//子评论回复@
function get_comment_at($coid)
{
    $db = Typecho_Db::get();
    $prow = $db->fetchRow($db->select('parent')->from('table.comments')
            ->where('coid = ? AND status = ?', $coid, 'approved'));
    $parent = $prow['parent'];
    if ($parent != "0") {
        $arow = $db->fetchRow($db->select('author')->from('table.comments')
                ->where('coid = ? AND status = ?', $parent, 'approved'));
        $author = $arow['author'];
        if ($author) {
            $href = '<a class="relation" href="#comment-' . $parent . '">@' . $author . '</a>';
            echo $href;
        } else {
            echo '';
        }
    } else {
        echo '';
    }
};

//防止xss
/* 进行安全字段和xss跨站脚本攻击过滤(通用版) -xzz  */
function escape($string)
{
    global $_POST;
    $search = array('/</i', '/>/i', '/\">/i', '/\bunion\b/i', '/load_file(\s*(\/\*.*\*\/)?\s*)+\(/i', '/into(\s*(\/\*.*\*\/)?\s*)+outfile/i',
        '/\bor\b/i', '/\<([\/]?)script([^\>]*?)\>/si', '/\<([\/]?)iframe([^\>]*?)\>/si', '/\<([\/]?)frame([^\>]*?)\>/si',
    );
    $replace = array('&lt;', '&gt;', '&quot;&gt;', 'union&nbsp;', 'load_file&nbsp; (', 'into&nbsp; outfile', 'or&nbsp;', '&lt;\\1script\\2&gt;',
        '&lt;\\1iframe\\2&gt;', '&lt;\\1frame\\2&gt;');
    if (is_array($string)) {
        $key = array_keys($string);
        $size = sizeof($key);
        for ($i = 0; $i < $size; $i++) {
            $string[$key[$i]] = escape($string[$key[$i]]);
        }
    } else {
        if (!$_POST['stats_code'] && !$_POST['ad_type_code_content']) {
            $string = str_replace(array('\n', '\r'), array(chr(10), chr(13)), preg_replace($search, $replace, $string));
            $string = remove_xss($string);
        } else {
            $string = $string;
        }
    }
    return $string;
};
/* 进行安全字段和xss跨站脚本攻击过滤(通用版2) -xzz  */
function remove_xss($val)
{
    $val = preg_replace('/([\x00-\x08\x0b-\x0c\x0e-\x19])/', '', $val);
    $search = 'abcdefghijklmnopqrstuvwxyz';
    $search .= 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $search .= '1234567890!@#$%^&*()';
    $search .= '~`";:?+/={}[]-_|\'\\';
    for ($i = 0; $i < strlen($search); $i++) {
        $val = preg_replace('/(&#[xX]0{0,8}' . dechex(ord($search[$i])) . ';?)/i', $search[$i], $val);
        $val = preg_replace('/(&#0{0,8}' . ord($search[$i]) . ';?)/', $search[$i], $val);
    }
    $ra1 = array('javascript', 'vbscript', 'expression', 'applet', 'meta', 'xml', 'blink', 'script', 'object', 'iframe', 'frame',
        'frameset', 'ilayer', 'bgsound');
    $ra2 = array('onabort', 'onactivate', 'onafterprint', 'onafterupdate', 'onbeforeactivate', 'onbeforecopy', 'onbeforecut',
        'onbeforedeactivate', 'onbeforeeditfocus', 'onbeforepaste', 'onbeforeprint', 'onbeforeunload', 'onbeforeupdate', 'onblur',
        'onbounce', 'oncellchange', 'onchange', 'onclick', 'oncontextmenu', 'oncontrolselect', 'oncopy', 'oncut', 'ondataavailable',
        'ondatasetchanged', 'ondatasetcomplete', 'ondblclick', 'ondeactivate', 'ondrag', 'ondragend', 'ondragenter', 'ondragleave',
        'ondragover', 'ondragstart', 'ondrop', 'onerror', 'onerrorupdate', 'onfilterchange', 'onfinish', 'onfocus', 'onfocusin', 'onfocusout',
        'onhelp', 'onkeydown', 'onkeypress', 'onkeyup', 'onlayoutcomplete', 'onload', 'onlosecapture', 'onmousedown', 'onmouseenter',
        'onmouseleave', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'onmousewheel', 'onmove', 'onmoveend', 'onmovestart',
        'onpaste', 'onpropertychange', 'onreadystatechange', 'onreset', 'onresize', 'onresizeend', 'onresizestart', 'onrowenter', 'onrowexit',
        'onrowsdelete', 'onrowsinserted', 'onscroll', 'onselect', 'onselectionchange', 'onselectstart', 'onstart', 'onstop', 'onsubmit', 'onunload',
    );
    $ra = array_merge($ra1, $ra2);
    $found = true;
    while ($found == true) {
        $val_before = $val;
        for ($i = 0; $i < sizeof($ra); $i++) {
            $pattern = '/';
            for ($j = 0; $j < strlen($ra[$i]); $j++) {
                if ($j > 0) {
                    $pattern .= '(';
                    $pattern .= '(&#[xX]0{0,8}([9ab]);)';
                    $pattern .= '|';
                    $pattern .= '|(&#0{0,8}([9|10|13]);)';
                    $pattern .= ')*';
                }
                $pattern .= $ra[$i][$j];
            }
            $pattern .= '/i';
            $replacement = substr($ra[$i], 0, 2) . ' ' . substr($ra[$i], 2);
            $val = preg_replace($pattern, $replacement, $val);
            if ($val_before == $val) {
                $found = false;
            }
        }
    }
    return $val;
};

//主题themeInit函数
function themeInit($archive)
{
    //评论回复楼层最高999层.这个正常设置最高只有7层
    Helper::options()->commentsMaxNestingLevels = 999;
    //自动增加浏览次数
    if ($archive->is('single') || $archive->is('page')) {viewsCounter($archive);}
    ;
    //目录树
    if ($archive->is('single')) {
        $archive->content = createCatalog($archive->content);
    }

    //点赞请求接口
    if ($archive->request->isPost() && $archive->request->likeup && $archive->request->do_action) {
        Typecho_widget::widget('Widget_Security')->to($security);
        $security->protect();
        likeup($archive->request->likeup, $archive->request->do_action);
        exit;
    }
    ;
}
