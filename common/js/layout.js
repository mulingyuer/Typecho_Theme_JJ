/*
 * @Author: mulingyuer
 * @Date: 2021-04-05 01:34:49
 * @LastEditTime: 2021-06-26 17:47:15
 * @LastEditors: mulingyuer
 * @Description:
 * @FilePath: \JJ\common\js\layout.js
 * 怎么可能会有bug！！！
 */

// Header
$(function () {
  const $nav = $("#header-nav");
  const $d = $(document);
  const $obServer = window.$obServer;

  //获取滚动条高度-事件
  $(window).scroll(() => {
    $obServer.scrollTop = $d.scrollTop();
  });
  //获取滚动条高度-首次
  $obServer.scrollTop = $d.scrollTop();

  // 菜单
  if ($nav.find(".nav-item.menu").length) {
    const $menu = $nav.find(".nav-item.menu");
    const $menuList = $menu.find(">.nav-menu");
    // 菜单-开关
    $menu.on("click", () => {
      if ($menuList.hasClass("show")) {
        $menuList.removeClass("show");
      } else {
        $menuList.addClass("show");
      };
    });
    // 点击内部不会关闭菜单
    $menuList.on("click", (event) => event.stopPropagation());
    //点击其他区域关闭菜单
    $d.on("click", (event) => {
      if (!$menu[0].contains(event.target) && $menuList.hasClass("show")) {
        $menuList.removeClass("show");
      }
    });
  };





  // 搜索框
  class Search {
    constructor(args = {}) {
      this.init(args);  //初始化
      this.addEvent();  //添加事件
    }

    //初始化
    init(options) {
      this.options = {};
      Object.assign(this.options, options);  //合并配置

      this.$form = $(this.options.elForm);   //form
      this.$input = $(this.options.elInput);   //input
      this.$submit = $(this.options.subBtn);   //submit
      this.$recordWrap = $(this.options.recordWrap);   //submit
      this.$clearBtn = $(this.options.clearBtn);   //clear
      this.$recordList = $(this.options.recordList);   //recordList

      this.data = new SearchRecord();  //搜索数据
    }

    //添加事件
    addEvent() {
      //阻止回车按下时提交表单
      this.$form.on("keydown", (event) => {
        if (event.keyCode === 13) {
          event.preventDefault();
        }
      });

      //回车回位时触发搜索
      this.$form.on("keyup", (event) => {
        if (event.keyCode === 13) {
          this.submit();
        }
      });

      //搜索按钮点击事件
      this.$submit.on("click", this.submit.bind(this));

      //input的focus事件
      this.$input.on("focus", this.showRecord.bind(this));

      //清空按钮事件
      this.$clearBtn.on("click", () => {
        this.data.clear();
        this.showRecord();
      });

      //历史记录点击事件
      this.$recordList.on("click", (event) => {
        const value = $(event.target).text();
        this.$input.val(value);  //input赋值

        this.submit();
        this.hideRecord();
      });


    }

    //记录数据并显示
    submit() {
      const value = this.$input.val();
      if (value !== "") {
        this.data.push(value); //记录
        this.$form.submit();  //手动提交
      }
    }

    //显示历史记录
    showRecord() {
      if (this.data.size > 0) {
        const innerHtml = this.data.getSearchData().map((value) => {
          return `<div>${value}</div>`;
        }).join("");
        this.$recordList.html(innerHtml);  //更新内容

        if (!this.$recordWrap.hasClass("show")) {
          this.$recordWrap.addClass("show");
        }

        //添加其他区域事件
        this.addOtherEvent();
      } else {
        this.hideRecord();
      }
    }

    //隐藏历史记录
    hideRecord() {
      if (this.$recordWrap.hasClass("show")) {
        this.$recordWrap.removeClass("show");
        this.removeOtherEvent();  //移除其他区域事件
      }
    }

    //添加其他区域事件-用于关闭历史记录
    addOtherEvent() {
      this.removeOtherEvent();
      document.addEventListener("click", this.otherAreasHideRecord.bind(this))
    }

    //删除其他区域事件
    removeOtherEvent() {
      document.removeEventListener("click", this.otherAreasHideRecord);
    }

    //点击非search区域关闭历史记录
    otherAreasHideRecord(event) {
      if (!this.$form[0].contains(event.target)) {
        this.hideRecord();
      }
    }
  }

  new Search({
    elForm: ".nav-item .search-form", //form选择器
    elInput: ".search-form .search-input", //input选择器
    subBtn: ".search-form .search-btn",  //搜索按钮
    recordWrap: ".search-form .typehead",  //历史记录容器
    clearBtn: ".search-form .clear", //清理按钮
    recordList: ".search-form .typehead .list", //搜索列表
  });




  //响应式菜单
  const $mobileMenu = $nav.find(".mobile-show-menu");
  const $mobileNav = $nav.find(".mobile-hide");

  $mobileMenu.on("click", () => {
    if (!$mobileNav.hasClass("show")) {
      $mobileNav.addClass("show");
    } else {
      $mobileNav.removeClass("show");
    }
  });

  //点击其他区域关闭菜单
  $d.on("click", (event) => {
    if (!$mobileNav[0].contains(event.target) && !$mobileMenu[0].contains(event.target) && $mobileNav.hasClass("show")) {
      $mobileNav.removeClass("show");
    }
  });


  //header动画
  const $header = $("#header");
  let reference = null;  //过去的参考值
  let headerTranstion = (newVal, oldVal) => {
    if (!reference) {
      reference = oldVal;
      if (newVal >= 600) if ($header.hasClass("visible")) $header.removeClass("visible");
    } else {
      if (window.disableHeaderTranstion) return;  //停止的话就跳过
      if (newVal >= 600 && newVal - reference >= 50) {
        if ($header.hasClass("visible")) $header.removeClass("visible");
        reference = newVal;
      } else if (reference - newVal >= 50) {
        if (!$header.hasClass("visible")) $header.addClass("visible");
        reference = newVal;
      }
    }
  };
  if ($header.length) {
    new Watch($obServer, "scrollTop", headerTranstion, true);
  }



  //login弹窗
  const $b = $("body");
  const $loginDialog = $("#login-dialog");
  const $loginBtn = $nav.find(".login-btn");
  const $loginAdd = $nav.find(".login-add");
  const $authForm = $loginDialog.find(".auth-form");
  const $loginCloseBtn = $loginDialog.find(".close");
  let authFormTimer = null;

  if ($loginBtn.length) $loginBtn.on("click", showLoginDialog);
  if ($loginAdd.length) $loginAdd.on("click", showLoginDialog);

  //显示login弹窗
  function showLoginDialog() {
    $b.css("overflow", "hidden");
    if (!$loginDialog.hasClass("show")) {
      $loginDialog.addClass("show");
      if (authFormTimer) clearTimeout(authFormTimer);
      authFormTimer = setTimeout(() => {
        if (!$authForm.hasClass("show")) {
          $authForm.addClass("show");
        }
      }, 200);
    }
    //添加关闭事件
    if ($loginCloseBtn.length) $loginCloseBtn.on("click", hideLoginDialog);
  };

  //隐藏login弹窗
  function hideLoginDialog() {
    $b.css("overflow", "");
    if ($loginDialog.hasClass("show")) {
      $loginDialog.removeClass("show");
      if (authFormTimer) clearTimeout(authFormTimer);
      if ($authForm.hasClass("show")) {
        $authForm.removeClass("show");
      }
    }
    $loginCloseBtn.off("click");
  }



  //全局图片加载失败兜底
  document.addEventListener('error', event => {
    let target = event.target;
    const tagName = target.tagName || '';
    const curTimes = Number(target.dataset.retryTimes) || 0
    if (tagName.toLowerCase() === "img") {
      if (curTimes >= 3) {
        target.src = 'data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAA8AAD/4QMsaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA2LjAtYzAwNiA3OS4xNjQ3NTMsIDIwMjEvMDIvMTUtMTE6NTI6MTMgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCAyMi4zIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo5NUZENDZEQjlGNTkxMUVCOUEwNEY0NEEyMEVGMUFFRCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo5NUZENDZEQzlGNTkxMUVCOUEwNEY0NEEyMEVGMUFFRCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjk1RkQ0NkQ5OUY1OTExRUI5QTA0RjQ0QTIwRUYxQUVEIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjk1RkQ0NkRBOUY1OTExRUI5QTA0RjQ0QTIwRUYxQUVEIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+/+4ADkFkb2JlAGTAAAAAAf/bAIQABgQEBAUEBgUFBgkGBQYJCwgG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'
      } else {
        target.dataset.retryTimes = curTimes + 1;
        target.src = target.src;
      }
      target = null;
    }
  }, true);


  //悬浮工具
  const $fixedTool = $("#fixed-tool");
  const $goTop = $fixedTool.find(".top");

  //监听滚动条高度
  new Watch($obServer, "scrollTop", (val) => {
    if (val >= 300) {
      if (!$goTop.hasClass("show")) {
        $goTop.addClass("show");
      }
    } else {
      $goTop.removeClass("show");
    }
  });
  $goTop.on("click", scrollBackToTop);

  //清理缓存+刷新页面
  let refreshClick = function () {
    const $that = $(this);
    if (!$that.hasClass("whirling")) $that.addClass("whirling");
    const dosage = getStorageAmount(); //缓存大小
    cleanCache(); //清理缓存-指定存储容器
    window.$notyf.open({ type: "info", message: `已清理 ${dosage} 的缓存，即将刷新页面！`, });
    setTimeout(() => {
      location.reload();
    }, 250);
  };
  refreshClick = debounce(refreshClick, 250);
  $fixedTool.find(".refresh").on("click", refreshClick);
});