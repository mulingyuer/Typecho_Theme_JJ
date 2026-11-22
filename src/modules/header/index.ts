/*
 * @Author: mulingyuer
 * @Date: 2023-03-15 19:36:49
 * @LastEditTime: 2023-07-16 17:35:48
 * @LastEditors: mulingyuer
 * @Description: header模块
 * @FilePath: /Typecho_Theme_JJ/src/modules/header/index.ts
 * 怎么可能会有bug！！！
 */
import "./style.scss";
import { Header } from "./features/header-visibility";
import { HeaderNav } from "./features/mobile-nav";
import { HeaderSearch } from "./features/header-search";
import { HeaderMenu } from "./features/user-menu";
import { LoginDialogEntry } from "./features/login-dialog";

new Header();
new HeaderNav();
new HeaderSearch();
new HeaderMenu();
new LoginDialogEntry();
