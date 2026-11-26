<?php // markdown内容 ?>
<?php
/**
 * Markdown 正文输出模块。
 * 只做服务端正文处理：外链安全属性、TODO 列表、回复可见短代码。
 * 能力检测（data-enhance-*）由引用方模板自行输出，本模块不关心页面元数据。
 */

// themeInit 已把 \(...\) / \[...\] 掩码为占位符再走 Markdown 解析；这里先还原成真实定界符
global $jjMathMaskMap;
$mathMap = is_array($jjMathMaskMap ?? null) ? $jjMathMaskMap : array();
$content = !empty($mathMap)
    ? restoreMathDelimiters((string) $this->content, $mathMap)
    : (string) $this->content;

// 顺序固定：先做与结构无关的链接处理，再转换 TODO，最后决定回复可见内容去留
$content = formatMarkdownExternalLinks($content);
$content = todoListFormatted($content);
$content = renderReplyVisibleContent($content, canViewReplyVisibleContent($this));

echo $content;
?>
