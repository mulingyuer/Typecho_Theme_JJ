import mediumZoom from "medium-zoom";

/**
 * 为 Markdown 根节点中的图片启用 medium-zoom。
 * 位于链接中的图片保持原链接行为；懒加载图片在 load 后且尺寸有效时再绑定。
 */
export function initImageZoom(root: HTMLElement): void {
	const zoom = mediumZoom({
		margin: 0,
		background: "rgba(0, 0, 0, 0.7)",
		scrollOffset: 40
	});
	const pendingImages = new WeakSet<HTMLImageElement>();

	const attachImage = (image: HTMLImageElement): void => {
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

	root.querySelectorAll<HTMLImageElement>("img").forEach((image) => {
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
