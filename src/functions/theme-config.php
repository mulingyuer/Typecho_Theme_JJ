<?php
if (!defined('__TYPECHO_ROOT_DIR__')) {
    exit;
}

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

