"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkwebpack_multiple_entry"] = self["webpackChunkwebpack_multiple_entry"] || []).push([["404"],{

/***/ "./src/modules/404/game/style.scss":
/*!*****************************************!*\
  !*** ./src/modules/404/game/style.scss ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvbW9kdWxlcy80MDQvZ2FtZS9zdHlsZS5zY3NzLmpzIiwibWFwcGluZ3MiOiI7QUFBQSIsInNvdXJjZXMiOlsid2VicGFjazovL3dlYnBhY2stbXVsdGlwbGUtZW50cnkvLi9zcmMvbW9kdWxlcy80MDQvZ2FtZS9zdHlsZS5zY3NzPzBkZmYiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/modules/404/game/style.scss\n");

/***/ }),

/***/ "./src/pages/404/style.scss":
/*!**********************************!*\
  !*** ./src/pages/404/style.scss ***!
  \**********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvcGFnZXMvNDA0L3N0eWxlLnNjc3MuanMiLCJtYXBwaW5ncyI6IjtBQUFBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vd2VicGFjay1tdWx0aXBsZS1lbnRyeS8uL3NyYy9wYWdlcy80MDQvc3R5bGUuc2Nzcz81M2M1Il0sInNvdXJjZXNDb250ZW50IjpbIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/pages/404/style.scss\n");

/***/ }),

/***/ "./src/modules/404/game/index.ts":
/*!***************************************!*\
  !*** ./src/modules/404/game/index.ts ***!
  \***************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ \"./node_modules/.pnpm/registry.npmmirror.com+@babel+runtime@7.22.3/node_modules/@babel/runtime/helpers/esm/defineProperty.js\");\n/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./style.scss */ \"./src/modules/404/game/style.scss\");\n\n/*\n * @Author: mulingyuer\n * @Date: 2023-03-22 04:02:50\n * @LastEditTime: 2023-03-22 05:09:45\n * @LastEditors: mulingyuer\n * @Description: game\n * @FilePath: \\Typecho_Theme_JJ\\src\\modules\\404\\game\\index.ts\n * 怎么可能会有bug！！！\n */\n\n\n/** 监听按键触发游戏 */\nclass Game {\n  /** 游戏开始提示 */\n\n  constructor() {\n    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(this, \"errorCard\", document.querySelector(\".error-card\"));\n    /** 按键事件 */\n    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(this, \"onKeyDown\", event => {\n      event = event || window.event;\n      if (event.key.toLocaleLowerCase().trim() === \"\") {\n        this.hiddenBox();\n      }\n    });\n    /** 移动端点击 */\n    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(this, \"onTouchStart\", event => {\n      this.hiddenBox();\n    });\n    document.addEventListener(\"keydown\", this.onKeyDown);\n    document.addEventListener(\"touchstart\", this.onTouchStart);\n  }\n  /** 隐藏开始信息 */\n  hiddenBox() {\n    if (this.errorCard) {\n      this.errorCard.style.display = \"none\";\n    }\n  }\n}\nnew Game();//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvbW9kdWxlcy80MDQvZ2FtZS9pbmRleC50cy5qcyIsIm1hcHBpbmdzIjoiOzs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL3dlYnBhY2stbXVsdGlwbGUtZW50cnkvLi9zcmMvbW9kdWxlcy80MDQvZ2FtZS9pbmRleC50cz80N2RkIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfZGVmaW5lUHJvcGVydHkgZnJvbSBcIkBiYWJlbC9ydW50aW1lL2hlbHBlcnMvZGVmaW5lUHJvcGVydHlcIjtcbi8qXG4gKiBAQXV0aG9yOiBtdWxpbmd5dWVyXG4gKiBARGF0ZTogMjAyMy0wMy0yMiAwNDowMjo1MFxuICogQExhc3RFZGl0VGltZTogMjAyMy0wMy0yMiAwNTowOTo0NVxuICogQExhc3RFZGl0b3JzOiBtdWxpbmd5dWVyXG4gKiBARGVzY3JpcHRpb246IGdhbWVcbiAqIEBGaWxlUGF0aDogXFxUeXBlY2hvX1RoZW1lX0pKXFxzcmNcXG1vZHVsZXNcXDQwNFxcZ2FtZVxcaW5kZXgudHNcbiAqIOaAjuS5iOWPr+iDveS8muaciWJ1Z++8ge+8ge+8gVxuICovXG5pbXBvcnQgXCIuL3N0eWxlLnNjc3NcIjtcblxuLyoqIOebkeWQrOaMiemUruinpuWPkea4uOaIjyAqL1xuY2xhc3MgR2FtZSB7XG4gIC8qKiDmuLjmiI/lvIDlp4vmj5DnpLogKi9cblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBfZGVmaW5lUHJvcGVydHkodGhpcywgXCJlcnJvckNhcmRcIiwgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5lcnJvci1jYXJkXCIpKTtcbiAgICAvKiog5oyJ6ZSu5LqL5Lu2ICovXG4gICAgX2RlZmluZVByb3BlcnR5KHRoaXMsIFwib25LZXlEb3duXCIsIGV2ZW50ID0+IHtcbiAgICAgIGV2ZW50ID0gZXZlbnQgfHwgd2luZG93LmV2ZW50O1xuICAgICAgaWYgKGV2ZW50LmtleS50b0xvY2FsZUxvd2VyQ2FzZSgpLnRyaW0oKSA9PT0gXCJcIikge1xuICAgICAgICB0aGlzLmhpZGRlbkJveCgpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIC8qKiDnp7vliqjnq6/ngrnlh7sgKi9cbiAgICBfZGVmaW5lUHJvcGVydHkodGhpcywgXCJvblRvdWNoU3RhcnRcIiwgZXZlbnQgPT4ge1xuICAgICAgdGhpcy5oaWRkZW5Cb3goKTtcbiAgICB9KTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCB0aGlzLm9uS2V5RG93bik7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoc3RhcnRcIiwgdGhpcy5vblRvdWNoU3RhcnQpO1xuICB9XG4gIC8qKiDpmpDol4/lvIDlp4vkv6Hmga8gKi9cbiAgaGlkZGVuQm94KCkge1xuICAgIGlmICh0aGlzLmVycm9yQ2FyZCkge1xuICAgICAgdGhpcy5lcnJvckNhcmQuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgIH1cbiAgfVxufVxubmV3IEdhbWUoKTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/modules/404/game/index.ts\n");

/***/ }),

/***/ "./src/pages/404/index.ts":
/*!********************************!*\
  !*** ./src/pages/404/index.ts ***!
  \********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./style.scss */ \"./src/pages/404/style.scss\");\n/* harmony import */ var _modules_nav__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/modules/nav */ \"./src/modules/nav/index.ts\");\n/* harmony import */ var _modules_secondary_nav__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/modules/secondary_nav */ \"./src/modules/secondary_nav/index.ts\");\n/* harmony import */ var _modules_404_game__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/modules/404/game */ \"./src/modules/404/game/index.ts\");\n/*\n * @Author: mulingyuer\n * @Date: 2023-03-22 03:50:59\n * @LastEditTime: 2023-03-22 04:03:52\n * @LastEditors: mulingyuer\n * @Description: 404\n * @FilePath: \\Typecho_Theme_JJ\\src\\pages\\404\\index.ts\n * 怎么可能会有bug！！！\n */\n\n\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvcGFnZXMvNDA0L2luZGV4LnRzLmpzIiwibWFwcGluZ3MiOiI7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vd2VicGFjay1tdWx0aXBsZS1lbnRyeS8uL3NyYy9wYWdlcy80MDQvaW5kZXgudHM/NDVjNyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQEF1dGhvcjogbXVsaW5neXVlclxuICogQERhdGU6IDIwMjMtMDMtMjIgMDM6NTA6NTlcbiAqIEBMYXN0RWRpdFRpbWU6IDIwMjMtMDMtMjIgMDQ6MDM6NTJcbiAqIEBMYXN0RWRpdG9yczogbXVsaW5neXVlclxuICogQERlc2NyaXB0aW9uOiA0MDRcbiAqIEBGaWxlUGF0aDogXFxUeXBlY2hvX1RoZW1lX0pKXFxzcmNcXHBhZ2VzXFw0MDRcXGluZGV4LnRzXG4gKiDmgI7kuYjlj6/og73kvJrmnIlidWfvvIHvvIHvvIFcbiAqL1xuaW1wb3J0IFwiLi9zdHlsZS5zY3NzXCI7XG5pbXBvcnQgXCJAL21vZHVsZXMvbmF2XCI7XG5pbXBvcnQgXCJAL21vZHVsZXMvc2Vjb25kYXJ5X25hdlwiO1xuaW1wb3J0IFwiQC9tb2R1bGVzLzQwNC9nYW1lXCI7Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/pages/404/index.ts\n");

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, ["vendors","common"], function() { return __webpack_exec__("./src/main.ts"), __webpack_exec__("./src/pages/404/index.ts"); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);