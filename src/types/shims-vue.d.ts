/*
 * @Author: mulingyuer
 * @Date: 2026-09-27 15:45:33
 * @LastEditTime: 2026-09-27 15:49:17
 * @LastEditors: mulingyuer
 * @Description: Vue SFC 类型声明
 * @FilePath: \Typecho_Theme_JJ\src\types\shims-vue.d.ts
 * 怎么可能会有bug！！！
 */
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
