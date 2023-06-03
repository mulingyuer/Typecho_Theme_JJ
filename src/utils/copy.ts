/*
 * @Author: mulingyuer
 * @Date: 2023-03-29 23:51:59
 * @LastEditTime: 2023-03-30 00:18:51
 * @LastEditors: mulingyuer
 * @Description: 复制
 * @FilePath: \Typecho_Theme_JJ\src\utils\copy.ts
 * 怎么可能会有bug！！！
 */

/**
 * @description: 复制纯文本
 * @param {string} val
 * @Date: 2022-09-04 23:42:46
 * @Author: mulingyuer
 */
function copyString(val: string): boolean {
	const textarea = document.createElement("textarea");
	textarea.value = val;
	//只读防止选中而产生的页面跳动
	textarea.readOnly = true;
	//不让元素展示出来
	textarea.style.position = "absolute";
	textarea.style.left = "-9999px";
	textarea.style.top = "-9999px";
	textarea.style.opacity = "0";
	textarea.style.visibility = "hidden";
	document.body.appendChild(textarea);
	//选中元素的文本
	textarea.select();
	textarea.setSelectionRange(0, val.length); //这个应该是兼容作用
	//复制命令
	const copyFlag = document.execCommand("copy");
	//用完删除
	textarea.remove();

	return copyFlag;
}

/**
 * @description: 复制节点文本
 * @param {HTMLElement} val
 * @Date: 2022-09-04 23:44:52
 * @Author: mulingyuer
 */
function copyNodeText(node: HTMLElement): boolean {
	let isEditable = false;
	if (node.hasAttribute("contenteditable") && node.getAttribute("contenteditable") !== "false") {
		isEditable = true;
	}
	//暂时移除，用完回复
	if (isEditable) {
		node.removeAttribute("contenteditable");
	}
	//选中元素的文本
	//获取Selection对象
	const selection = window.getSelection()!;
	//创建区域
	const range = document.createRange();
	range.selectNodeContents(node);
	selection.removeAllRanges();
	//传入区域
	selection.addRange(range);
	//复制
	const copyFlag = document.execCommand("copy");
	//取消选中
	selection.removeAllRanges();
	//恢复
	if (isEditable) {
		node.setAttribute("contenteditable", "true");
	}

	return copyFlag;
}

/**
 * @description: 复制函数
 * @param {string | HTMLElement} val
 * @Date: 2022-09-04 23:26:12
 * @Author: mulingyuer
 */
export default function copy(val: string | HTMLElement): Promise<boolean> {
	return new Promise((resolve, reject) => {
		try {
			/** 是否允许复制 */
			const isSupported = document.queryCommandSupported("copy");
			if (!isSupported) {
				throw new Error("当前设备不支持copy功能");
			}

			/** 确认需要选中的内容 */
			let copyVal: string | HTMLElement = "";
			if (typeof val === "string") {
				copyVal = val;
			} else if (
				val instanceof HTMLInputElement ||
				val instanceof HTMLTextAreaElement ||
				val instanceof HTMLSelectElement
			) {
				copyVal = val.value;
			} else {
				copyVal = val;
			}

			/** 文本复制与dom的复制 */
			let status: boolean;
			if (typeof copyVal === "string") {
				status = copyString(copyVal);
			} else {
				status = copyNodeText(copyVal);
			}

			if (status) {
				return resolve(true);
			} else {
				throw new Error("复制失败");
			}
		} catch (error) {
			console.warn(error);
			return reject(false);
		}
	});
}
