/*
 * @Author: mulingyuer
 * @Date: 2023-03-23 01:32:28
 * @LastEditTime: 2023-03-23 01:49:44
 * @LastEditors: mulingyuer
 * @Description: 代码高亮
 * @FilePath: \Typecho_Theme_JJ\src\modules\article_content\hljs.ts
 * 怎么可能会有bug！！！
 */
import hljs from "highlight.js/lib/core";
import bash from "highlight.js/lib/languages/bash";
import c from "highlight.js/lib/languages/c";
import csharp from "highlight.js/lib/languages/csharp";
import cpp from "highlight.js/lib/languages/cpp";
import css from "highlight.js/lib/languages/css";
import go from "highlight.js/lib/languages/go";
import xml from "highlight.js/lib/languages/xml";
import json from "highlight.js/lib/languages/json";
import java from "highlight.js/lib/languages/java";
import javascript from "highlight.js/lib/languages/javascript";
import less from "highlight.js/lib/languages/less";
import markdown from "highlight.js/lib/languages/markdown";
import php from "highlight.js/lib/languages/php";
import phpTemplate from "highlight.js/lib/languages/php-template";
import python from "highlight.js/lib/languages/python";
import pythonRepl from "highlight.js/lib/languages/python-repl";
import rust from "highlight.js/lib/languages/rust";
import scss from "highlight.js/lib/languages/scss";
import sql from "highlight.js/lib/languages/sql";
import shell from "highlight.js/lib/languages/shell";
import typescript from "highlight.js/lib/languages/typescript";
import webAssembly from "highlight.js/lib/languages/wasm";
import yaml from "highlight.js/lib/languages/yaml";
import http from "highlight.js/lib/languages/http";
import nginx from "highlight.js/lib/languages/nginx";
import apache from "highlight.js/lib/languages/apache";
import dockerfile from "highlight.js/lib/languages/dockerfile";
import { LanguageFn } from "highlight.js";

type Languages = {
	[key: string]: LanguageFn;
};
const languages: Languages = {
	bash,
	c,
	csharp,
	cpp,
	css,
	go,
	xml,
	json,
	java,
	javascript,
	less,
	markdown,
	php,
	phpTemplate,
	python,
	pythonRepl,
	rust,
	scss,
	sql,
	shell,
	typescript,
	webAssembly,
	yaml,
	http,
	nginx,
	apache,
	dockerfile
};

//批量注册
Object.keys(languages).forEach((name) => {
	hljs.registerLanguage(name, languages[name]);
});

export default hljs;
