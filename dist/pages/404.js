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

eval("__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvbW9kdWxlcy80MDQvZ2FtZS9zdHlsZS5zY3NzLmpzIiwibWFwcGluZ3MiOiI7QUFBQSIsInNvdXJjZXMiOlsid2VicGFjazovL3dlYnBhY2stbXVsdGlwbGUtZW50cnkvLi9zcmMvbW9kdWxlcy80MDQvZ2FtZS9zdHlsZS5zY3NzPzg3YTMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/modules/404/game/style.scss\n");

/***/ }),

/***/ "./src/pages/404/style.scss":
/*!**********************************!*\
  !*** ./src/pages/404/style.scss ***!
  \**********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvcGFnZXMvNDA0L3N0eWxlLnNjc3MuanMiLCJtYXBwaW5ncyI6IjtBQUFBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vd2VicGFjay1tdWx0aXBsZS1lbnRyeS8uL3NyYy9wYWdlcy80MDQvc3R5bGUuc2Nzcz9mYTk0Il0sInNvdXJjZXNDb250ZW50IjpbIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/pages/404/style.scss\n");

/***/ }),

/***/ "./src/modules/404/game/index.ts":
/*!***************************************!*\
  !*** ./src/modules/404/game/index.ts ***!
  \***************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ \"./node_modules/.pnpm/registry.npmjs.org+@babel+runtime@7.22.0/node_modules/@babel/runtime/helpers/esm/defineProperty.js\");\n/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./style.scss */ \"./src/modules/404/game/style.scss\");\n\n/*\r\n * @Author: mulingyuer\r\n * @Date: 2023-03-22 04:02:50\r\n * @LastEditTime: 2023-03-22 05:09:45\r\n * @LastEditors: mulingyuer\r\n * @Description: game\r\n * @FilePath: \\Typecho_Theme_JJ\\src\\modules\\404\\game\\index.ts\r\n * 怎么可能会有bug！！！\r\n */\n\n\n/** 监听按键触发游戏 */\nclass Game {\n  /** 游戏开始提示 */\n\n  constructor() {\n    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(this, \"errorCard\", document.querySelector(\".error-card\"));\n    /** 按键事件 */\n    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(this, \"onKeyDown\", event => {\n      event = event || window.event;\n      if (event.key.toLocaleLowerCase().trim() === \"\") {\n        this.hiddenBox();\n      }\n    });\n    /** 移动端点击 */\n    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(this, \"onTouchStart\", event => {\n      this.hiddenBox();\n    });\n    document.addEventListener(\"keydown\", this.onKeyDown);\n    document.addEventListener(\"touchstart\", this.onTouchStart);\n  }\n  /** 隐藏开始信息 */\n  hiddenBox() {\n    if (this.errorCard) {\n      this.errorCard.style.display = \"none\";\n    }\n  }\n}\nnew Game();//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvbW9kdWxlcy80MDQvZ2FtZS9pbmRleC50cy5qcyIsIm1hcHBpbmdzIjoiOzs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL3dlYnBhY2stbXVsdGlwbGUtZW50cnkvLi9zcmMvbW9kdWxlcy80MDQvZ2FtZS9pbmRleC50cz83N2UyIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfZGVmaW5lUHJvcGVydHkgZnJvbSBcIkBiYWJlbC9ydW50aW1lL2hlbHBlcnMvZGVmaW5lUHJvcGVydHlcIjtcbi8qXHJcbiAqIEBBdXRob3I6IG11bGluZ3l1ZXJcclxuICogQERhdGU6IDIwMjMtMDMtMjIgMDQ6MDI6NTBcclxuICogQExhc3RFZGl0VGltZTogMjAyMy0wMy0yMiAwNTowOTo0NVxyXG4gKiBATGFzdEVkaXRvcnM6IG11bGluZ3l1ZXJcclxuICogQERlc2NyaXB0aW9uOiBnYW1lXHJcbiAqIEBGaWxlUGF0aDogXFxUeXBlY2hvX1RoZW1lX0pKXFxzcmNcXG1vZHVsZXNcXDQwNFxcZ2FtZVxcaW5kZXgudHNcclxuICog5oCO5LmI5Y+v6IO95Lya5pyJYnVn77yB77yB77yBXHJcbiAqL1xuaW1wb3J0IFwiLi9zdHlsZS5zY3NzXCI7XG5cbi8qKiDnm5HlkKzmjInplK7op6blj5HmuLjmiI8gKi9cbmNsYXNzIEdhbWUge1xuICAvKiog5ri45oiP5byA5aeL5o+Q56S6ICovXG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgX2RlZmluZVByb3BlcnR5KHRoaXMsIFwiZXJyb3JDYXJkXCIsIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZXJyb3ItY2FyZFwiKSk7XG4gICAgLyoqIOaMiemUruS6i+S7tiAqL1xuICAgIF9kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcIm9uS2V5RG93blwiLCBldmVudCA9PiB7XG4gICAgICBldmVudCA9IGV2ZW50IHx8IHdpbmRvdy5ldmVudDtcbiAgICAgIGlmIChldmVudC5rZXkudG9Mb2NhbGVMb3dlckNhc2UoKS50cmltKCkgPT09IFwiXCIpIHtcbiAgICAgICAgdGhpcy5oaWRkZW5Cb3goKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICAvKiog56e75Yqo56uv54K55Ye7ICovXG4gICAgX2RlZmluZVByb3BlcnR5KHRoaXMsIFwib25Ub3VjaFN0YXJ0XCIsIGV2ZW50ID0+IHtcbiAgICAgIHRoaXMuaGlkZGVuQm94KCk7XG4gICAgfSk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgdGhpcy5vbktleURvd24pO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaHN0YXJ0XCIsIHRoaXMub25Ub3VjaFN0YXJ0KTtcbiAgfVxuICAvKiog6ZqQ6JeP5byA5aeL5L+h5oGvICovXG4gIGhpZGRlbkJveCgpIHtcbiAgICBpZiAodGhpcy5lcnJvckNhcmQpIHtcbiAgICAgIHRoaXMuZXJyb3JDYXJkLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICB9XG4gIH1cbn1cbm5ldyBHYW1lKCk7Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/modules/404/game/index.ts\n");

/***/ }),

/***/ "./src/pages/404/index.ts":
/*!********************************!*\
  !*** ./src/pages/404/index.ts ***!
  \********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./style.scss */ \"./src/pages/404/style.scss\");\n/* harmony import */ var _modules_nav__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/modules/nav */ \"./src/modules/nav/index.ts\");\n/* harmony import */ var _modules_secondary_nav__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/modules/secondary_nav */ \"./src/modules/secondary_nav/index.ts\");\n/* harmony import */ var _modules_404_game__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/modules/404/game */ \"./src/modules/404/game/index.ts\");\n/*\r\n * @Author: mulingyuer\r\n * @Date: 2023-03-22 03:50:59\r\n * @LastEditTime: 2023-03-22 04:03:52\r\n * @LastEditors: mulingyuer\r\n * @Description: 404\r\n * @FilePath: \\Typecho_Theme_JJ\\src\\pages\\404\\index.ts\r\n * 怎么可能会有bug！！！\r\n */\n\n\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvcGFnZXMvNDA0L2luZGV4LnRzLmpzIiwibWFwcGluZ3MiOiI7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vd2VicGFjay1tdWx0aXBsZS1lbnRyeS8uL3NyYy9wYWdlcy80MDQvaW5kZXgudHM/MThiMyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gKiBAQXV0aG9yOiBtdWxpbmd5dWVyXHJcbiAqIEBEYXRlOiAyMDIzLTAzLTIyIDAzOjUwOjU5XHJcbiAqIEBMYXN0RWRpdFRpbWU6IDIwMjMtMDMtMjIgMDQ6MDM6NTJcclxuICogQExhc3RFZGl0b3JzOiBtdWxpbmd5dWVyXHJcbiAqIEBEZXNjcmlwdGlvbjogNDA0XHJcbiAqIEBGaWxlUGF0aDogXFxUeXBlY2hvX1RoZW1lX0pKXFxzcmNcXHBhZ2VzXFw0MDRcXGluZGV4LnRzXHJcbiAqIOaAjuS5iOWPr+iDveS8muaciWJ1Z++8ge+8ge+8gVxyXG4gKi9cbmltcG9ydCBcIi4vc3R5bGUuc2Nzc1wiO1xuaW1wb3J0IFwiQC9tb2R1bGVzL25hdlwiO1xuaW1wb3J0IFwiQC9tb2R1bGVzL3NlY29uZGFyeV9uYXZcIjtcbmltcG9ydCBcIkAvbW9kdWxlcy80MDQvZ2FtZVwiOyJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/pages/404/index.ts\n");

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, ["vendors","common"], function() { return __webpack_exec__("./src/main.ts"), __webpack_exec__("./src/pages/404/index.ts"); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);