/*
 * @Author: mulingyuer
 * @Date: 2023-03-23 02:42:53
 * @LastEditTime: 2023-03-23 04:23:54
 * @LastEditors: mulingyuer
 * @Description: 灯箱
 * @FilePath: \Typecho_Theme_JJ\src\modules\article_content\lightBox\index.ts
 * 怎么可能会有bug！！！
 */
import "./style.scss";

/** 事件代理容器元素 */
type Wrapper = HTMLElement;
/** 配置 */
type Options = {
	/** 间隙 */
	space?: number;
};

/** 默认参数 */
const defaultOptions: Options = {
	space: 0
};

class LightBox {
	/** 事件代理容器 */
	private wrapper: Wrapper;
	/** 间隙 */
	private space: number = 0;
	/** 灯箱容器 */
	private lightBox: HTMLElement | null = null;
	/** 灯箱遮罩 */
	private mask: HTMLElement | null = null;
	/** 源图 */
	private sourceImg: HTMLElement | null = null;
	/** 克隆的图片 */
	private cloneImg: HTMLElement | null = null;
	/** 是否在关闭中 */
	private isClosing: boolean = false;

	constructor(wrapper: Wrapper, options: Options = defaultOptions) {
		this.wrapper = wrapper;
		const { space } = options;
		if (space) this.space = space;

		//绑定事件
		this.wrapper.addEventListener("click", this.onWrapperClick);
		window.addEventListener("resize", this.closeLightBox);
		window.addEventListener("scroll", this.closeLightBox);
	}

	/** 容器点击事件 */
	private onWrapperClick = (event: MouseEvent) => {
		const target = event.target as HTMLElement;
		if (!this.isImg(target)) return;

		this.sourceImg = target;
		this.showLightBox(target);
	};

	/** 显示灯箱 */
	private showLightBox = (img: HTMLElement) => {
		//获取图片坐标信息
		const domRect: DOMRect = img.getBoundingClientRect();
		const maxSize = this.calcImgMaxSize(domRect);
		const offset = this.calcOffset(domRect);

		//克隆img
		this.cloneImg = img.cloneNode() as HTMLElement;
		this.cloneImg.style.cssText = `width:${domRect.width}px;height:${domRect.height}px;top:${domRect.top}px;left:${domRect.left}px;`;

		//创建灯箱容器
		const lightBox = !this.lightBox ? this.createLightBox() : this.lightBox;
		const mask = !this.mask ? this.createMask(lightBox) : this.mask;
		lightBox.appendChild(this.cloneImg);
		document.body.appendChild(lightBox);

		//动画
		lightBox.classList.add("visible");
		getComputedStyle(lightBox).display;
		mask.classList.add("visible");
		this.cloneImg.style.transform = `translate3d(${offset.x}px,${offset.y}px,0) scale(${maxSize.ratio})`;
		this.sourceImg && (this.sourceImg.style.visibility = "hidden");
	};

	/** 关闭灯箱 */
	private closeLightBox = () => {
		if (!this.mask || !this.cloneImg || !this.sourceImg || !this.lightBox) return;
		//计算图片新的位置
		const domRect: DOMRect = this.sourceImg.getBoundingClientRect();
		this.cloneImg.style.top = `${domRect.top}px`;
		this.cloneImg.style.left = `${domRect.left}px`;
		if (this.isClosing) return;
		this.isClosing = true;
		//克隆图片动画慢一点（代码书写的顺序导致）
		this.cloneImg.addEventListener(
			"transitionend",
			() => {
				if (this.sourceImg) {
					this.sourceImg.style.visibility = "visible";
					this.sourceImg = null;
				}
				this.lightBox?.classList.remove("visible");
				this.cloneImg?.remove();
				this.cloneImg = null;
				this.isClosing = false;
			},
			{ once: true }
		);
		this.mask.classList.remove("visible");
		this.cloneImg.style.transform = "";
	};

	/** window事件 */
	private onWindowEvent = () => {};

	/** 创建灯箱容器 */
	private createLightBox() {
		if (!this.lightBox) {
			const lightBox = document.createElement("div");
			lightBox.classList.add("jj-light-box");
			lightBox.addEventListener("click", this.closeLightBox);
			this.lightBox = lightBox;
		}

		return this.lightBox;
	}

	/** 创建遮罩mask */
	private createMask(lightBox: HTMLElement) {
		if (!this.mask) {
			const mask = document.createElement("div");
			mask.classList.add("jj-light-box-mask");
			lightBox.appendChild(mask);
			this.mask = mask;
		}
		return this.mask;
	}

	/** 是否是img元素 */
	private isImg(target: HTMLElement) {
		return target.tagName.toLocaleLowerCase() === "img";
	}

	/** 计算图片在可视区域的最大尺寸 */
	private calcImgMaxSize(domRect: DOMRect) {
		const { width, height } = domRect; //当前图片展示的大小
		const viewSize = this.getViewportSize(); //可视区域大小
		const maxWidth = viewSize.width - this.space * 2; //最大宽度
		const maxHeight = viewSize.height - this.space * 2; //最大高度

		let calcWidth = 0; //计算后的宽度
		let calcHeight = 0; //计算后的高度
		let ratio = 0; //比例

		//图片宽高谁大谁先
		if (width >= height) {
			ratio = maxWidth / width;
			calcWidth = maxWidth;
			calcHeight = height * ratio;
		} else {
			ratio = maxHeight / height;
			calcWidth = width * ratio;
			calcHeight = maxHeight;
		}

		//保底判断：上面等比例处理后，高度或者宽度可能超出视图了
		if (calcWidth > maxWidth) {
			ratio = maxWidth / width;
			calcWidth = maxWidth;
			calcHeight = height * ratio;
		} else if (calcHeight > maxHeight) {
			ratio = maxHeight / height;
			calcHeight = maxHeight;
			calcWidth = width * ratio;
		}

		return {
			width: calcWidth,
			height: calcHeight,
			ratio
		};
	}

	/** 计算偏移量 */
	private calcOffset(domRect: DOMRect) {
		const { width, height, top, left } = domRect; //当前图片展示的大小
		const viewSize = this.getViewportSize(); //可视区域大小

		//图片中心点
		const imgCenter = {
			x: left + width / 2,
			y: top + height / 2
		};

		//视口中心点
		const viewCenter = {
			x: viewSize.width / 2,
			y: viewSize.height / 2
		};

		return {
			x: viewCenter.x - imgCenter.x,
			y: viewCenter.y - imgCenter.y
		};
	}

	/** 获取可视区域大小 */
	private getViewportSize() {
		const width = document.documentElement.clientWidth;
		const height = document.documentElement.clientHeight;
		return { width, height };
	}
}

export default LightBox;
