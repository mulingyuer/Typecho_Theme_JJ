/*
 * @Author: mulingyuer
 * @Date: 2021-04-05 21:50:40
 * @LastEditTime: 2021-06-14 14:48:27
 * @LastEditors: mulingyuer
 * @Description:
 * @FilePath: \JJ\index\js\nav.js
 * 怎么可能会有bug！！！
 */
$(function () {
  const $navContent = $("#index-main-nav .nav-content");
  if (!$navContent.length) return;
  const navWidth = $navContent[0].scrollWidth;
  $navContent.css("width", navWidth + "px");
  //初始化nav横向滚动容器
  let bs = new BScroll('.index-nav-warp', {
    scrollX: true,
    click: true,
  });

  //给有popper菜单的元素增加点击事件
  const $link = $navContent.find(".tooltip[data-link]");
  $link.on("click", function (event) {
    const link = event.target.dataset.link;
    location.href = link;
  }).on("touchstart", function (event) {
    const link = event.target.dataset.link;
    location.href = link;
  });

  //popper菜单
  const $navItemTooltips = $navContent.find(".tooltip");
  $navItemTooltips.each(function () {
    const $el = $(this);
    const $elToolTips = $el.find(".index-nav-tooltip").appendTo("body");  //传入body防止被裁剪
    //hover事件
    $el.hover(() => {
      showToolTips($elToolTips, $el);
    }, () => {
      hideToolTips($elToolTips, $el);
    })
    $elToolTips.hover(() => {
      showToolTips($elToolTips, $el);
    }, () => {
      hideToolTips($elToolTips, $el);
    });
    //移动端touch事件-不好用
    // $el.on("touchstart", function () {
    //   showToolTips($elToolTips, popper);
    // });
    // $elToolTips.on("touchstart", function () {
    //   showToolTips($elToolTips, popper);
    // });
  });


  /**
   * @description:  显示toolTips
   * @param {*} tooltips tooltips菜单元素
   * @param {*} popper popper实例对象
   * @Date: 2021-04-05 23:46:16
   * @Author: mulingyuer
   */
  function showToolTips(tooltips, el) {
    tooltips.data("show", true).attr("data-show", "");
    clearTimeout(tooltips.toolShowTimer);
    tooltips.toolShowTimer = setTimeout(() => {
      if (!tooltips.hasClass("show")) {
        tooltips.addClass("show");
      }
      if (tooltips.data("popper")) {
        // 优化-启用事件监听
        tooltips.data("popper").setOptions({
          modifiers: [{ name: 'eventListeners', enabled: true }],
        });
        //更新
        tooltips.data("popper").update();
      } else {
        //第一次-初始化
        tooltips.data("popper", Popper.createPopper(el[0], tooltips[0], {
          placement: 'bottom-start',
        }));

      }
    }, 30)
  };


  /**
   * @description: 隐藏toolTips
   * @param {*} tooltips  tooltips菜单元素
   * @param {*} popper popper实例对象
   * @Date: 2021-04-05 23:48:35
   * @Author: mulingyuer
   */
  function hideToolTips(tooltips, el) {
    tooltips.data("show", false);
    //等一会再消失，以防用户又移动到菜单上来
    clearTimeout(tooltips.toolHideTimer1);
    tooltips.toolHideTimer1 = setTimeout(() => {
      if (!tooltips.data("show")) {
        tooltips.removeClass("show");
        //等css动画完毕后让元素消失
        clearTimeout(tooltips.toolHideTimer2)
        tooltips.toolHideTimer2 = setTimeout(() => {
          if (!tooltips.data("show")) {
            tooltips.removeAttr("data-show")
            //优化-消失时结束事件监听
            tooltips.data("popper").setOptions({
              modifiers: [{ name: 'eventListeners', enabled: false }],
            });
          }
        }, 300)
      }
    }, 150);
  };

});