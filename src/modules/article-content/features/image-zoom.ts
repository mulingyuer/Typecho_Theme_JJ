import mediumZoom from "medium-zoom";

/**
 * @description: 正文图片灯箱（medium-zoom）。懒加载图片在 load/error 后才尝试挂载，
 * 已挂在 a 内或无 src 的图片不处理，避免重复绑定。
 */
export function initImageZoom() {
	const markdownBody = document.querySelector(".markdown-body");
	if (!markdownBody) return;

	const zoom = mediumZoom({
		margin: 0,
		background: "rgba(0, 0, 0, 0.7)",
		scrollOffset: 40
	});
	// 懒加载图片在完成前不可绑定，处理完即从集合移除
	const pendingImages = new WeakSet<HTMLImageElement>();

	const attachImage = (image: HTMLImageElement) => {
		if (
			image.closest("a") ||
			!(image.currentSrc || image.src) ||
			!image.complete ||
			image.naturalWidth === 0 ||
			image.naturalHeight === 0 ||
			zoom.getImages().includes(image)
		) {
			return;
		}
		zoom.attach(image);
	};

	markdownBody.querySelectorAll<HTMLImageElement>("img").forEach((image) => {
		if (image.closest("a") || !(image.currentSrc || image.src)) return;
		if (image.complete) {
			attachImage(image);
			return;
		}
		if (pendingImages.has(image)) return;
		pendingImages.add(image);
		image.addEventListener(
			"load",
			() => {
				pendingImages.delete(image);
				attachImage(image);
			},
			{ once: true }
		);
		image.addEventListener("error", () => pendingImages.delete(image), { once: true });
	});
}
