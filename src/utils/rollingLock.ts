/*
 * @Author: mulingyuer
 * @Date: 2023-03-17 08:24:39
 * @LastEditTime: 2023-03-17 08:25:53
 * @LastEditors: mulingyuer
 * @Description: 滚动锁
 * @FilePath: \Typecho_Theme_JJ\src\utils\rollingLock.ts
 * 怎么可能会有bug！！！
 */

let lockCount = 0; //计数器
let oldScrollData = ""; //记录旧的滚动数据

/** 锁定body滚动 */
export function lockBodyScroll() {
	if (lockCount === 0) {
		oldScrollData = document.body.style.overflow;
		document.body.style.overflow = "hidden";
	}
	lockCount++;
}

/** 解锁body滚动 */
export function unlockBodyScroll() {
	lockCount--;
	if (lockCount === 0) {
		document.body.style.overflow = oldScrollData;
	}
}
