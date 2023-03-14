"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkwebpack_multiple_entry"] = self["webpackChunkwebpack_multiple_entry"] || []).push([["page"],{

/***/ "./src/pages/page/index.ts":
/*!*********************************!*\
  !*** ./src/pages/page/index.ts ***!
  \*********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ \"./node_modules/.pnpm/registry.npmmirror.com+@babel+runtime@7.21.0/node_modules/@babel/runtime/helpers/esm/defineProperty.js\");\n/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./style.scss */ \"./src/pages/page/style.scss\");\n\n/*\r\n * @Author: mulingyuer\r\n * @Date: 2022-12-18 21:39:53\r\n * @LastEditTime: 2023-03-14 17:13:52\r\n * @LastEditors: mulingyuer\r\n * @Description: about\r\n * @FilePath: \\webpack-multiple-entry\\src\\pages\\page\\index.ts\r\n * 怎么可能会有bug！！！\r\n */\n\nclass Page {\n  constructor() {\n    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(this, \"name\", void 0);\n    this.name = \"page\";\n  }\n  run() {\n    alert(`独立页面：${this.name}`);\n  }\n}\n\n//# sourceURL=webpack://webpack-multiple-entry/./src/pages/page/index.ts?");

/***/ }),

/***/ "./src/pages/page/style.scss":
/*!***********************************!*\
  !*** ./src/pages/page/style.scss ***!
  \***********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n\n\n//# sourceURL=webpack://webpack-multiple-entry/./src/pages/page/style.scss?");

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, ["vendors","common"], function() { return __webpack_exec__("./src/main.ts"), __webpack_exec__("./src/pages/page/index.ts"); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);