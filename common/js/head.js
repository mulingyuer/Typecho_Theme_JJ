/*
 * @Author: mulingyuer
 * @Date: 2021-05-20 22:49:16
 * @LastEditTime: 2021-06-26 16:03:24
 * @LastEditors: mulingyuer
 * @Description: head通用脚本
 * @FilePath: \JJ\common\js\head.js
 * 怎么可能会有bug！！！
 */
(function () {
  //基础
  let baseArr = [
    { url: `${$common_js}/jquery-3.6.0.slim.min.js` },
    { url: `${$common_utils}/basil.min.js` },
    { url: `${$common_utils}/tool.js` },
    { url: `${$common_utils}/obServer.js` },
    { url: `${$common_utils}/search-record.js` },
    { url: `${$modules}/notyf/notyf.min.css`, execute: false, css: true },
    { url: `${$modules}/notyf/notyf.min.js` },
  ];

  //调试模式脚本
  if (window._debug) {
    baseArr.push({ url: `${$common_utils}/vconsole.min.js` });
  }

  //模块脚本
  const modulesArr = [
    { url: `${$common_js}/layout.js`, skipCache: true },
  ];

  window.$bk_head = new Promise(async (resolve, reject) => {
    try {
      const baseRes = await $bk.require(...baseArr);
      const moduleRes = await $bk.require(...modulesArr);

      //加载完成
      if (window._debug) {
        //开启调试模式
        window.$vConsole = new VConsole();
      }

      //模块初始化
      read(initModules);

      return resolve({ ...baseRes, ...moduleRes });
    } catch (err) {
      reject(err);
    }


    // const reqArr = [...baseArr, ...modulesArr];
    // $bk.require(...reqArr).then(res => {
    //   //开启调试模式
    //   if (window._debug) {
    //     const vConsole = new VConsole();
    //   }
    //   //模块初始化
    //   if (document.readyState !== 'loading') {
    //     initModules();
    //   } else {
    //     document.addEventListener('DOMContentLoaded', () => initModules());
    //   }

    //   return resolve(res);
    // }).catch((error) => {
    //   console.log("脚本加载失败", error);
    //   return reject(error);
    // })
  });


  //模块初始化
  function initModules() {
    //通知
    window.$notyf = new Notyf({
      position: { x: "right", y: "top" }, //位置
      ripple: false, //不需要波纹
      //增加新的定制
      types: [
        {
          type: "info",
          background: "#26b4ef",
          icon: {
            className: 'icon notyf-icon icon-warning-circle-fill',
            tagName: 'i',
            color: "#fff"
          },
        }
      ]
    });
  };

})();
