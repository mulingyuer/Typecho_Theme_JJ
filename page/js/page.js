/*
 * @Author: mulingyuer
 * @Date: 2021-05-24 23:25:52
 * @LastEditTime: 2021-06-23 22:13:51
 * @LastEditors: mulingyuer
 * @Description: 独立页
 * @FilePath: \JJ\page\js\page.js
 * 怎么可能会有bug！！！
 */
$(function () {
  const $page = $("#page-main");
  const $content = $page.find(".content-warp");
  //骨架
  const $skeleton = $page.find(".post-skeleton");
  if ($skeleton.length) {
    setTimeout(() => {
      $skeleton.remove();
      if (!$content.hasClass("show")) $content.addClass("show");
      //手动哈希定位
      hashPosition();
    }, 500);
  }
  //文章内容
  const $markdown = $("#markdown");
  if ($markdown.length) {
    //图片
    bigImg();
    //代码高亮
    codeHighlight();
  };

  //图片
  function bigImg() {
    let openBigImg = false;
    let $BigPicture = null;
    $markdown.find(".gallery").on("click", function (event) {
      $BigPicture = BigPicture({
        el: this,
        imgSrc: $(this).data("src"),
        animationStart: () => {
          openBigImg = true;
        },
        onClose: () => {
          openBigImg = false;
          $BigPicture = null;
        }
      });

      event.stopPropagation();
      event.preventDefault();
      return false;
    });

    //监听滚动，滚动了关闭弹窗
    let closeBigPicture = () => {
      if ($BigPicture && openBigImg) $BigPicture.close();
    }
    closeBigPicture = debounce(closeBigPicture, 50)
    new Watch($obServer, "scrollTop", closeBigPicture);
  };

  //代码高亮
  function codeHighlight() {
    hljs.highlightAll();
  };

  //左侧文章工具
  const $articleTool = $("#article-tool");
  if ($articleTool.length) {
    //微信二维码
    const $wx = $articleTool.find(".wx");
    const link = $wx.data("link");
    if (link) {
      const qrious = new QRious({
        background: "transparent",
        size: 200,
        value: link
      });
      $wx.find(".wx-qrcode").html(`<img src="${qrious.toDataURL()}" alt="二维码">`);
    }
  }

  //点赞
  giveLike();
});
