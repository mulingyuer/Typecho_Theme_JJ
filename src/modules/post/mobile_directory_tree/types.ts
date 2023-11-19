/*
 * @Author: mulingyuer
 * @Date: 2023-11-19 19:10:35
 * @LastEditTime: 2023-11-19 23:05:31
 * @LastEditors: mulingyuer
 * @Description: 移动端目录树 类型声明
 * @FilePath: /Typecho_Theme_JJ/src/modules/post/mobile_directory_tree/types.ts
 * 怎么可能会有bug！！！
 */

/** 实例化目录树参数 */
export interface MobileDirectoryTreeOptions {
	/** 触发按钮 */
	triggerBtn: HTMLElement;
	/** 目录树容器 */
	container: HTMLElement;
	/** 遮罩元素 */
	mask: HTMLElement;
	/** 目录树内容元素 */
	content: HTMLElement;
	/** 目录树列表容器 */
	listContainer: HTMLElement;
	/** 关闭按钮 */
	closeBtn: HTMLElement;
	/** pc端目录树容器 */
	pcContainer: HTMLElement;
	/** pc端目录树列表 */
	pcTreeList: HTMLElement;
}

/** 触摸数据 */
export interface TouchData {
	/** 起始：触点相对于可见视区左边缘的 X 坐标 */
	startClientX: number;
	/** 起始：触点相对于可见视区上边缘的 Y 坐标 */
	startClientY: number;
	/** 结束：触点相对于可见视区左边缘的 X 坐标 */
	endClientX: number;
	/** 结束：触点相对于可见视区左边缘的 Y 坐标 */
	endClientY: number;
}
