/** header-nav class */
export class HeaderNav {
	private mobileMenu: HTMLElement; //按钮
	private navList: HTMLElement; //菜单
	private navStatus: boolean = false; //显示true,隐藏false

	constructor() {
		this.mobileMenu = document.querySelector(".header-nav-mobile-menu") as HTMLElement;
		this.navList = document.querySelector(".header-nav-list") as HTMLElement;

		this.toggleMenu = this.toggleMenu.bind(this);
		this.clickOtherCloseMenu = this.clickOtherCloseMenu.bind(this);

		//绑定事件
		this.mobileMenu.addEventListener("click", this.toggleMenu);
		document.addEventListener("click", this.clickOtherCloseMenu);
	}

	/** 切换菜单 */
	private toggleMenu() {
		this.mobileMenu.classList.toggle("active");
		this.navList.classList.toggle("visible");
		this.navStatus = !this.navStatus;
	}

	/** 点击其他区域关闭菜单 */
	private clickOtherCloseMenu(event: MouseEvent) {
		if (!this.navStatus) return;
		const target = event.target as HTMLElement;
		if (this.mobileMenu.contains(target) || this.navList.contains(target)) return;
		this.toggleMenu();
	}
}
