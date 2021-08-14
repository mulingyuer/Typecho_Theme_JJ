/*
 * @Author: mulingyuer
 * @Date: 2021-04-07 09:25:37
 * @LastEditTime: 2021-08-14 22:41:20
 * @LastEditors: mulingyuer
 * @Description: 工具函数
 * @FilePath: \JJ\common\js\utils\tool.js
 * 怎么可能会有bug！！！
 */


//防抖动
function debounce(fn, delay) {
  let timer = null;

  return function () {
    let context = this;
    let args = arguments;

    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, delay);
  }
};

//判断数据类型
function getType(value) {
  let type = typeof value;
  if (type !== "object") {
    return type;
  }
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
};


//返回顶部函数
const cubic = (value) => Math.pow(value, 3);
const easeInOutCubic = (value) =>
  value < 0.5 ? cubic(value * 2) / 2 : 1 - cubic((1 - value) * 2) / 2;
const scrollBackToTop = function () {
  const beginTime = Date.now();
  const beginValue = document.documentElement.scrollTop;
  const rAF =
    window.requestAnimationFrame || ((func) => setTimeout(func, 16));
  const frameFunc = () => {
    const progress = (Date.now() - beginTime) / 500;
    if (progress < 1) {
      document.documentElement.scrollTop = beginValue * (1 - easeInOutCubic(progress));
      rAF(frameFunc);
    } else {
      document.documentElement.scrollTop = 0;
    }
  };
  rAF(frameFunc);
};



//获取local用量
function getStorageAmount(container = "local") {
  let sizeStore = 0;
  switch (container) {
    case "local":
      const local = window.localStorage;
      Object.keys(local).forEach(key => {
        sizeStore += local.getItem(key).length;
      });
      break;
    case "session":
      const session = window.sessionStorage;
      Object.keys(session).forEach(key => {
        sizeStore += session.getItem(key).length;
      });
      break;
    default:
      throw new Error(`暂时不支持该${container}存储容器查询占用大小`);
  }
  return (sizeStore / 1024 / 1024).toFixed(2) + 'M';
};

//清理缓存
function cleanCache(container = "local", key) {
  const whiteList = ["searchRecord"];  //白名单
  let tagger = null;
  switch (container) {
    case "local":
      tagger = window.localStorage;
      break;
    case "session":
      tagger = window.sessionStorage;
      break;
    default:
      throw new Error(`暂时不支持该${container}存储容器清理缓存`);
  }

  if (key) {
    if (!whiteList.includes(key)) tagger.removeItem(key);
  } else {
    if (whiteList.length === 0) {
      tagger.clear();
    } else {
      Object.keys(tagger).forEach(key => {
        if (!whiteList.includes(key)) tagger.removeItem(key);
      })
    }
  }
};


//表情替换
function faceReplace(container) {
  //获取表情数据
  const faceBasil = new window.Basil({ storages: ["local"] });
  if (!faceBasil.get("face")) {
    //本地没有则请求
    axios.get(`${$common_path}/js/face/config.json`).then(res => {
      const { data } = res;
      faceBasil.set("face", data);
      regReplace(container, data);
    }).catch(err => {
      console.log(err);
      window.$notyf.error(err.message);
    });
  } else {
    const faceData = faceBasil.get("face");
    regReplace(container, faceData);
  }

  //替换
  function regReplace(container, face) {
    let html = container.html();
    const faceData = {};
    face.forEach(item => {
      if (item.type !== "text") {
        Object.assign(faceData, item.children);
      }
    });

    const reg = /\[(.*?)\]/g;
    const str = html.replace(reg, (match, param) => {
      if (faceData[param]) {
        return `<img src="${$common_path}${faceData[param]}">`
      }
      return match;
    });

    container.html(str);
  }
};



//点赞
function giveLike() {
  const $like = $("#like-badge");
  if ($like.length) {
    $like.on("click", function () {
      window.$notyf.open({ type: "info", message: "正在点赞", position: { x: "center", y: "top" } });
      axios({
        url: $like.data("like-href"),
        method: "post",
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: Qs.stringify({
          likeup: $like.data("cid"),
          do_action: "do",//反正挡不住，索性可以一直点赞
        })
      }).then(res => {
        const { count } = res.data;
        $like.attr("badge", count);  //更新数字
        if (!$like.hasClass("active")) $like.addClass("active");
        window.$notyf.success({ message: "点赞完成", position: { x: "center", y: "top" } })
      }).catch(err => {
        window.$notyf.error(err.message);
      });
    })


  }
};


//手动哈希定位
function hashPosition() {
  const hash = location.hash.slice(1);
  if (hash) {
    document.getElementById(hash.replace("#", "")).scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest"
    });
  }
};


//jq read
function read(fn) {
  if (document.readyState !== 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}