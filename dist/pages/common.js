"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkwebpack_multiple_entry"] = self["webpackChunkwebpack_multiple_entry"] || []).push([["common"],{

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/.pnpm/registry.npmmirror.com+vue@3.2.47/node_modules/vue/dist/vue.runtime.esm-bundler.js\");\n/* harmony import */ var pinia__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! pinia */ \"./node_modules/.pnpm/registry.npmmirror.com+pinia@2.0.33_hmuptsblhheur2tugfgucj7gc4/node_modules/pinia/dist/pinia.mjs\");\n/* harmony import */ var _store_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/store/data */ \"./src/store/data.ts\");\n/*\r\n * @Author: mulingyuer\r\n * @Date: 2022-12-18 19:22:40\r\n * @LastEditTime: 2023-03-15 18:39:00\r\n * @LastEditors: mulingyuer\r\n * @Description: 通用入口文件\r\n * @FilePath: \\Typecho_Theme_JJ\\src\\main.ts\r\n * 怎么可能会有bug！！！\r\n */\n\n\n\n\n// 创建pinia实例\nconst pinia = (0,pinia__WEBPACK_IMPORTED_MODULE_2__.createPinia)();\n\n// 创建app实例\nconst app = (0,vue__WEBPACK_IMPORTED_MODULE_0__.createApp)({\n  render() {}\n});\napp.use(pinia);\n//用一个dom元素挂载app，但是dom不显示\napp.mount(document.createElement(\"div\"));\n\n//监听scroll事件，记录滚动条位置\nconst dataStore = (0,_store_data__WEBPACK_IMPORTED_MODULE_1__.useDataStore)();\nfunction updateScrollY() {\n  dataStore.setScrollY(document.documentElement.scrollTop || document.body.scrollTop);\n}\nupdateScrollY();\nwindow.addEventListener(\"scroll\", updateScrollY);\n\n//# sourceURL=webpack://webpack-multiple-entry/./src/main.ts?");

/***/ }),

/***/ "./src/store/data.ts":
/*!***************************!*\
  !*** ./src/store/data.ts ***!
  \***************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"useDataStore\": function() { return /* binding */ useDataStore; }\n/* harmony export */ });\n/* harmony import */ var pinia__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! pinia */ \"./node_modules/.pnpm/registry.npmmirror.com+pinia@2.0.33_hmuptsblhheur2tugfgucj7gc4/node_modules/pinia/dist/pinia.mjs\");\n/*\r\n * @Author: mulingyuer\r\n * @Date: 2023-03-15 16:56:16\r\n * @LastEditTime: 2023-03-15 17:03:11\r\n * @LastEditors: mulingyuer\r\n * @Description: 数据仓库\r\n * @FilePath: \\Typecho_Theme_JJ\\src\\store\\data.ts\r\n * 怎么可能会有bug！！！\r\n */\n\nconst useDataStore = (0,pinia__WEBPACK_IMPORTED_MODULE_0__.defineStore)(\"data\", {\n  state() {\n    return {\n      scrollY: 0 // Y滚动条位置\n    };\n  },\n\n  getters: {\n    getScrollY(state) {\n      return state.scrollY;\n    }\n  },\n  actions: {\n    setScrollY(y) {\n      this.scrollY = y;\n    }\n  }\n});\n\n//# sourceURL=webpack://webpack-multiple-entry/./src/store/data.ts?");

/***/ })

}]);