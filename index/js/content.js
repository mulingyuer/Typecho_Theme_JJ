/*
 * @Author: mulingyuer
 * @Date: 2021-04-08 23:09:14
 * @LastEditTime: 2021-06-26 18:25:33
 * @LastEditors: mulingyuer
 * @Description: 文章内容
 * @FilePath: \JJ\index\js\content.js
 * 怎么可能会有bug！！！
 */

$(function () {
  const $d = $(document);
  const $content = $("#index-content")
  const $listWrap = $content.find(".entry-list-wrap");
  const $skeletonWrap = $content.find("#index-skeleton-wrap");
  let qrious = null;
  //图片懒加载
  const ImgLazy = new ImgLazyLoad();
  ImgLazy.add($("#index-content .index-right img[data-src]")); //侧边栏评论头像

  // 增加文章数量
  // let listHtml = $listWrap.html()
  //骨架屏
  setTimeout(() => {
    $skeletonWrap.remove();
    // $listWrap.html(listHtml);
    if ($listWrap.hasClass("hide")) $listWrap.removeClass("hide");

    //添加点击事件
    entryCardClick($listWrap.find(".entry-card"));
    entryCardClick($listWrap.find(".comment[data-link]"));

    //二维码分享
    entryCardShareQRCode();

    //图片懒加载
    ImgLazy.add($listWrap.find("img[data-src]"));

    //自动加载
    autoLoadArticle();
  }, 500);

  //文章点击事件
  function entryCardClick(jqEl) {
    if (!jqEl) throw new Error("文章点击事件失效，jqEl参数不能为空，它应该是jq获取的元素类似数组对象。");
    jqEl.off("click").on("click", function (event) {
      const $that = $(this);
      const link = $that.data("link")
      location.href = link;
      event.stopPropagation();
    });
  };

  //文章二维码
  function entryCardShareQRCode() {
    new ShareQRCdoe({
      elements: $listWrap.find(".share"),
      appendClass: "qr-code-body",
      showClass: "show-qr-code",
      stop: true, //阻止冒泡
    });
  };


  //滚动到底部自动加载文章
  function autoLoadArticle() {
    const $autoLoad = $content.find(".auto-load");
    if (!$autoLoad.length) return;

    //初始化api
    const api = axios.create({
      method: 'get',
      headers: {
        "X-Requested-With": "XMLHttpRequest"
      },
      timeout: 15000,
    });

    //显示load
    function showLoad() {
      if (!$autoLoad.hasClass("show")) $autoLoad.addClass("show");
    }

    //隐藏load 
    function hideLoad() {
      if ($autoLoad.hasClass("show")) $autoLoad.removeClass("show");
    }

    //没有更多了
    function noMore() {
      const $next = $autoLoad.find(".next");
      if ($next.length) $next.remove();
      $autoLoad.html('<span class="no-more">没有更多了</span>');
      if (!$autoLoad.hasClass("show")) showLoad();
    }

    //加载文章
    let isLoad = false;
    function loadArticle() {
      if (isLoad) return;

      const $next = $autoLoad.find(".next");
      isLoad = true;
      if ($next.length) {
        showLoad();

        const link = $next.attr("href");
        if (link) {
          api({ url: link }).then(res => {
            const { data } = res;
            let $content = $("<div></div>").html(data);
            $listWrap.append($content.find(".entry-list-wrap .entry-card"));
            //更新autoLoad元素next的link地址
            const $newNext = $content.find(".auto-load .next");
            if ($newNext.length) {
              $next.attr("href", $newNext.attr("href"));
            } else {
              noMore();
            }
            //图片懒加载
            ImgLazy.add($listWrap.find("img[data-src]"));
            //二维码
            entryCardShareQRCode();
            hideLoad();
            isLoad = false;
          }).catch(err => {
            isLoad = false;
            console.log("加载文章失败：", err);
            hideLoad();
            $notyf.error(err.message);
          })
        } else {
          isLoad = false;
          $notyf.error('自动加载文章没有获取到下一页链接');
        }
      } else {
        noMore();
        isLoad = false;
      }
    };

    //滚动监听
    const autoTrigger = debounce((newVal) => {
      // react-loadmore部分源码
      let scrollHeight = (document.documentElement && document.documentElement.scrollHeight) ||
        document.body.scrollHeight;
      let clientHeight = document.documentElement.clientHeight || window.innerHeight;
      let scrolledToBottom = Math.ceil(newVal + clientHeight) >= scrollHeight - 200;
      if (scrolledToBottom) loadArticle();

    }, 150);
    new Watch($obServer, "scrollTop", autoTrigger, true);

  }
  // function autoLoadArticle() {
  //   const $autoLoad = $content.find(".auto-load");
  //   if (!$autoLoad.length) return;
  //   //api
  //   const api = axios.create({
  //     method: 'get',
  //     headers: {
  //       "X-Requested-With": "XMLHttpRequest"
  //     },
  //     timeout: 15000,
  //   });

  //   showAutoLoad();

  //   //显示
  //   function showAutoLoad() {
  //     if (!$autoLoad.hasClass("show")) {
  //       $autoLoad.addClass("show");
  //       axiosSection(); //加载文章
  //     }
  //   };

  //   //隐藏
  //   function hideAutoLoad() {
  //     if ($autoLoad.hasClass("show")) {
  //       $autoLoad.removeClass("show");
  //     }
  //   };

  //   //没有更多了
  //   function noMore() {
  //     const $next = $autoLoad.find(".next");
  //     if ($next.length) $next.remove();
  //     $autoLoad.html('<span class="no-more">没有更多了</span>');
  //   }


  //   //加载文章
  //   function axiosSection() {
  //     const $next = $autoLoad.find(".next");
  //     if ($next.length) {
  //       const link = $next.attr("href");
  //       if (link) {
  //         api({ url: link }).then(res => {
  //           const { data } = res;
  //           let $content = $("<div></div>").html(data);
  //           $listWrap.append($content.find(".entry-list-wrap .entry-card"));
  //           //更新autoLoad元素next的link地址
  //           const $newNext = $content.find(".auto-load .next");
  //           if ($newNext.length) {
  //             $next.attr("href", $newNext.attr("href"));
  //           } else {
  //             //没有了
  //             noMore();
  //           }
  //           //图片懒加载
  //           ImgLazy.add($listWrap.find("img[data-src]"));
  //           //二维码
  //           entryCardShareQRCode();
  //           hideAutoLoad();
  //         }).catch(err => {
  //           console.log("加载文章失败：", err);
  //           hideAutoLoad();
  //           window.$notyf.error(err.message);
  //         })
  //       }
  //     } else {
  //       //没有了
  //       $next.remove();
  //       $autoLoad.html('<span class="no-more">没有更多了</span>');
  //     }
  //   };

  //   //滚动监听
  //   const autoTrigger = debounce((newVal) => {
  //     // react-loadmore部分源码
  //     let scrollHeight = (document.documentElement && document.documentElement.scrollHeight) ||
  //       document.body.scrollHeight;
  //     let clientHeight = document.documentElement.clientHeight || window.innerHeight;
  //     let scrolledToBottom = Math.ceil(newVal + clientHeight) >= scrollHeight - 200;
  //     if (scrolledToBottom) showAutoLoad();
  //   }, 150);
  //   new Watch($obServer, "scrollTop", autoTrigger);
  // };



  //最近评论表情
  const $recentComment = $("#index-content .recent-comment");
  if ($recentComment.length) {
    faceReplace($recentComment);
  }

});