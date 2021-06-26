/*
 * @Author: mulingyuer
 * @Date: 2021-05-16 17:34:10
 * @LastEditTime: 2021-06-23 22:12:31
 * @LastEditors: mulingyuer
 * @Description:文章内容
 * @FilePath: \JJ\post\js\post.js
 * 怎么可能会有bug！！！
 */

$(function () {
  const $post = $("#post-main");
  const $content = $post.find(".content-warp");
  //骨架
  const $skeleton = $post.find(".post-skeleton");
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
  }

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

  //右侧目录树
  const $catalogTree = $("#catalog-tree");
  if ($catalogTree.length) {
    const toTop = $catalogTree.offset().top;
    const treeSticky = new Sticky('#catalog-tree');
    //监听滚动，如果header出来了增加一下距离顶部的距离
    let reference = null;  //过去的参考值
    const updataSticky = (newVal, oldVal) => {
      if (!reference) {
        reference = oldVal;
        if (newVal >= toTop) $catalogTree.css("margin-top", 0);
      } else {
        if (newVal <= toTop) return $catalogTree.css("margin-top", 0);  //不沾性就不加距离

        if (newVal - reference >= 50) {
          $catalogTree.css("margin-top", 0);
          reference = newVal;
        } else if (reference - newVal >= 50) {
          $catalogTree.css("margin-top", 60);
          reference = newVal;
        }

      }
    };
    //监听 根据header出现增加间距
    new Watch($obServer, "scrollTop", updataSticky, true);

    //目录树点击事件
    $catalogTree.on("click", function (event) {
      if (event.target.tagName.toLowerCase() === "a") {
        event.preventDefault(); //阻止默认行为
        //hash跳转
        const scrollHash = event.target.dataset.scroll;
        if (!scrollHash) return;  //暂无目录跳过
        document.getElementById(event.target.dataset.scroll.replace(/^#/, ""))
          .scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
      }
    })
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
  };


  //相关文章
  const $relatedArticles = $("#related-articles");
  if ($relatedArticles.length) {
    //文章点击
    $relatedArticles.find(".related-item").on("click", function () {
      const $that = $(this);
      const link = $that.data("link")
      location.href = link;
    });
    //图片懒加载
    const ImgLazy = new ImgLazyLoad($relatedArticles.find("img[data-src]"));
    //分享
    const share = new ShareQRCdoe({
      elements: $relatedArticles.find(".share"),
      appendClass: "qr-code-body",
      showClass: "show-qr-code",
      stop: true, //阻止冒泡
    });
  }


  //点赞
  giveLike();


});

