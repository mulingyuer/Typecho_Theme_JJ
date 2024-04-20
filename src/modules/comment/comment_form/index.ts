/*
 * @Author: mulingyuer
 * @Date: 2023-03-24 12:29:16
 * @LastEditTime: 2024-04-21 03:14:06
 * @LastEditors: mulingyuer
 * @Description: 评论表单
 * @FilePath: /Typecho_Theme_JJ/src/modules/comment/comment_form/index.ts
 * 怎么可能会有bug！！！
 */
import "./style.scss";

class CommentTextarea {
	private wrapper = document.querySelector(".comment-form-combination");
	private textarea = document.getElementById("textarea");

	constructor() {
		if (this.wrapper && this.textarea) {
			this.wrapper.addEventListener("click", this.focus);
			this.textarea.addEventListener("focus", this.focus);
			document.addEventListener("click", this.blur);
		}
	}

	/** 点击focus */
	private focus = () => {
		if (this.wrapper?.classList.contains("focused")) return;

		this.wrapper?.classList.add("focused");
	};

	/** 点击其他部分关闭focus */
	private blur = (event: MouseEvent) => {
		const target = event.target as HTMLElement;
		if (this.wrapper?.contains(target)) return;

		this.wrapper?.classList.remove("focused");
	};
}

new CommentTextarea();
