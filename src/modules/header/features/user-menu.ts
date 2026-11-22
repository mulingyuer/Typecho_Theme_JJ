//header-menu
export class HeaderMenu {
	private menuBtn: HTMLElement | null = null; //菜单按钮
	private menuWrap: HTMLElement | null = null; //菜单容器

	constructor() {
		this.menuBtn = document.querySelector(".header-avatar");
		this.menuWrap = document.querySelector(".header-menu-body");

		if (!this.menuBtn || !this.menuWrap) return;

		//绑定事件
		this.menuBtn.addEventListener("click", this.onClickMenu.bind(this));
		document.addEventListener("click", this.onClickOtherClose.bind(this));
	}

	/** 菜单按钮事件 */
	private onClickMenu() {
		this.menuWrap && this.menuWrap.classList.toggle("visible");
	}

	/** 点击其他区域关闭 */
	private onClickOtherClose(event: MouseEvent) {
		if (!this.menuBtn || !this.menuWrap) return;
		if (!this.menuWrap.classList.contains("visible")) return;
		const target = event.target as HTMLElement;
		if (this.menuBtn.contains(target) || this.menuWrap.contains(target)) return;
		this.menuWrap.classList.remove("visible");
	}
}
