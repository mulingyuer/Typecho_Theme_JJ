/*
 * @Author: mulingyuer
 * @Date: 2021-05-29 16:20:30
 * @LastEditTime: 2021-06-13 01:24:11
 * @LastEditors: mulingyuer
 * @Description:表情
 * @FilePath: \JJ\common\js\face\index.js
 * 怎么可能会有bug！！！
 */
$(function () {
  const $face = $("#face");
  if ($face.length) {
    //popper
    const $tooltip = $("#face-tooltip").appendTo("body");  //传入body防止被裁剪;
    let facePopper = null;

    //表情弹窗
    let timer = null;
    //点击
    $face.on("click", function (event) {
      event.stopPropagation();
      if (!$tooltip.data("show")) {
        showFacePopper();
      } else {
        hideFacePopper();
      }
    });

    //显示表情弹窗
    function showFacePopper() {
      if (timer) clearTimeout(timer);
      $tooltip.data("show", true).attr("data-show", "");
      timer = setTimeout(function () {
        $tooltip.addClass("show");
        if (facePopper) {
          // 优化-启用事件监听
          facePopper.setOptions({
            modifiers: [{ name: 'eventListeners', enabled: true }, {
              name: 'offset',
              options: {
                offset: [0, 12],
              },
            }],
          });
          //更新
          facePopper.update();
        } else {
          facePopper = Popper.createPopper($face[0], $tooltip[0], {
            placement: 'bottom-start',
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: [0, 12],
                },
              }
            ]
          });
        }

      }, 150);
    };

    //隐藏表情弹窗
    function hideFacePopper() {
      if (!$tooltip.data("show")) return;
      if (timer) clearTimeout(timer);
      $tooltip.data("show", false).removeClass("show").removeAttr("data-show");
      //优化-消失时结束事件监听
      if (facePopper) {
        facePopper.setOptions({
          modifiers: [{ name: 'eventListeners', enabled: false }],
        });
      }
    }

    //点击其他关闭表情弹窗
    document.addEventListener("click", function (event) {
      if (!$tooltip[0].contains(event.target)) {
        hideFacePopper();
      }
    }, false);


    //表情数据加载
    const faceBasil = new window.Basil({ storages: ["local"] });
    if (!faceBasil.get("face")) {
      //本地没有则请求
      axios.get(`${$common_path}/js/face/config.json`).then(res => {
        const { data } = res;
        faceBasil.set("face", data);
        evalFace(data);
      }).catch(err => {
        console.log(err);
        window.$notyf.error(err.message);
      });
    } else {
      const faceData = faceBasil.get("face");
      evalFace(faceData);
    };




    //生成表情元素
    function evalFace(faceArr) {
      const $tooltip = $("#face-tooltip");
      const $title = $tooltip.find(".tab-title");
      faceArr.forEach((item, index) => {
        const $toTitle = $title.eq(index);
        const $content = $tooltip.find(`.tab-content .${$toTitle.attr("for")} .content`);
        let html = "";
        switch (item.type) {
          case "text":
            $toTitle.text(item.name);
            html = "";
            item.children.forEach(item => {
              html += `<span data-id="${item}" data-type="text">${item}</span>`
            });
            $content.html(html);
            break;
          case "image":
            $toTitle.html(`<img src="${$common_path}${item.src}">`);
            html = "";
            Object.keys(item.children).forEach(key => {
              html += `<span data-id="[${key}]" data-type="image"><img src="${$common_path}/images/emote/loading.gif" data-src="${$common_path}${item.children[key]}"></span>`;
            });
            $content.html(html);
            break;
          default:
            console.log("暂不支持的类型" + item.type);
        };

      });

      //图片懒加载
      const layzloadImg = new ImgLazyLoad($tooltip.find("img[data-src]"), () => { }, {
        root: $tooltip.find(".tab-content")[0]
      });

      //表情插入
      faceInsert($tooltip.find("span[data-id]"), $("#textarea"));

      //表情替换
      const $myCustomComment = $("#my-custom-comment");
      if ($myCustomComment.length) {
        faceReplace($myCustomComment);
      }

    };


    //表情插入
    function faceInsert(jqFace, jqInsert) {
      jqFace.on("click", function () {
        const value = jqInsert.val(); //已存在的内容
        const insert = jqInsert[0].selectionStart;  // 获取光标初始索引
        // 拼接字符串的形式来得到需要的内容
        jqInsert.val(value.substr(0, insert) + this.dataset.id + value.substr(insert));
      });
    };


  }

});