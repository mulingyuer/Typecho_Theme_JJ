/*
 * @Author: mulingyuer
 * @Date: 2023-03-24 12:29:16
 * @LastEditTime: 2024-04-27 18:46:08
 * @LastEditors: mulingyuer
 * @Description: 评论表单
 * @FilePath: /Typecho_Theme_JJ/src/modules/comment/comment_form/index.ts
 * 怎么可能会有bug！！！
 */
import "./style.scss";
import { debounce, generatedGravatar } from "@/utils/tool";
import { EmailRegExp } from "@/utils/regExp";

class CommentAvatar {
	private emailInput = document.querySelector<HTMLInputElement>("#comment-form input[name=mail]");
	private avatarImg = document.querySelector<HTMLImageElement>("#comment-form .comment-form-avatar img");

	constructor() {
		if (this.emailInput && this.avatarImg) {
			// 绑定事件
			this.emailInput.addEventListener("input", this.inputChange);
		}
	}

	/** 监听input的输入事件，动态切换头像 */
	private inputChange = debounce(() => {
		const email = this.emailInput!.value;
		if (!email || !EmailRegExp.test(email)) return;
		this.avatarImg!.src = generatedGravatar({ email });
	}, 300);
}

new CommentAvatar();

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
