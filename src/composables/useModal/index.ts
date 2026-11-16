import { markRaw, nextTick, ref, type Component } from "vue";
import type { ModalInstance, ModalReject, ModalResolve, OpenOptions, PersistentOptions } from "./types";

interface InternalModal extends ModalInstance {
	/** 常驻实例的复用标识；普通弹窗使用 modalId，避免被错误复用。 */
	key?: string | symbol;
}

/** 集中维护弹窗栈及 Promise 协议，视图只负责渲染和转发事件。 */
class ModalManager {
	private modals = ref<InternalModal[]>([]);
	/** 未显式传 key 时，按组件类型复用常驻实例。 */
	private componentIds = new WeakMap<Component, string | symbol>();

	get list(): readonly ModalInstance[] {
		return this.modals.value;
	}

	/** 打开弹窗；confirm 会 resolve，cancel、关闭或销毁会 reject。 */
	open<T = void>(options: OpenOptions): Promise<T> {
		const key = this.computeKey(options);
		const existing = key ? this.modals.value.find((item) => item.key === key && item.persistent) : undefined;
		if (existing) {
			// 先结束旧 Promise，再替换回调，避免重复打开留下悬挂任务。
			this.settle(existing, "cancel", new Error("弹窗被重复打开"));
			existing.props = options.props;
			existing.visible = true;
			return new Promise<T>((resolve, reject) => {
				existing.resolve = resolve as ModalInstance["resolve"];
				existing.reject = reject;
			});
		}

		return new Promise<T>((resolve, reject) => {
			const modalId = Symbol("modal");
			const modalResolve: ModalResolve<T> = resolve as ModalResolve<T>;
			const modalReject: ModalReject = reject;
			this.modals.value.push({
				modalId,
				visible: false,
				component: markRaw(options.component),
				props: options.props,
				persistent: options.persistent,
				resolve: modalResolve,
				reject: modalReject,
				key: key ?? modalId
			});
			if (options.persistent) this.componentIds.set(options.component, key ?? modalId);
			// 等动态组件首次挂载后再切换 visible，确保 ElDialog 的 open 生命周期触发。
			void nextTick(() => {
				const modal = this.getByModalId(modalId);
				if (modal) modal.visible = true;
			});
		});
	}

	/** 确认并关闭；只结束当前 Promise，常驻实例仍保留。 */
	confirm<T>(modalId: symbol, value?: T) {
		const modal = this.getByModalId(modalId);
		if (!modal) return;
		this.settle(modal, "confirm", value);
		modal.visible = false;
	}

	/** 取消并关闭；重复事件会因回调已清空而不会重复 settle。 */
	cancel(modalId: symbol, reason?: unknown) {
		const modal = this.getByModalId(modalId);
		if (!modal) return;
		this.settle(modal, "cancel", reason);
		modal.visible = false;
	}

	/** 动画结束后清理实例；延迟到达的旧 closed 事件不能关闭已重新打开的弹窗。 */
	closed(modalId: symbol) {
		const modal = this.getByModalId(modalId);
		if (!modal || modal.visible) return;
		this.settle(modal, "cancel", new Error("弹窗已关闭"));
		if (!modal.persistent) this.removeByModalId(modalId);
	}

	/** 销毁指定常驻实例，并结束其尚未完成的 Promise。 */
	destroyPersistent(options: OpenOptions) {
		if (!options.persistent) return;
		const key = this.computeKey(options);
		if (!key) return;
		this.modals.value
			.filter((item) => item.key === key)
			.forEach((item) => {
				this.settle(item, "cancel", new Error("弹窗已销毁"));
			});
		this.modals.value = this.modals.value.filter((item) => item.key !== key);
		this.componentIds.delete(options.component);
	}

	/** 清栈前逐个 settle，防止调用方一直等待。 */
	destroyAll() {
		this.modals.value.forEach((item) => this.settle(item, "cancel", new Error("弹窗已销毁")));
		this.modals.value = [];
	}

	/** 手动 key 优先，其次根据 props 生成，最后回退为组件级单例。 */
	private computeKey(options: OpenOptions): string | symbol | undefined {
		const { component, props = {}, persistent } = options;
		if (!persistent) return undefined;
		const config: PersistentOptions = typeof persistent === "boolean" ? {} : persistent;
		if (config.key) return config.key;
		if (config.keyGenerator) return config.keyGenerator(props);
		return this.componentIds.get(component);
	}

	private getByModalId(modalId: symbol) {
		return this.modals.value.find((item) => item.modalId === modalId);
	}

	private removeByModalId(modalId: symbol) {
		this.modals.value = this.modals.value.filter((item) => item.modalId !== modalId);
	}

	/** settle 后立即清空回调，保证 confirm/cancel/closed 的幂等性。 */
	private settle(modal: InternalModal, type: "confirm" | "cancel", value?: unknown) {
		if (type === "confirm") modal.resolve?.(value as never);
		else modal.reject?.(value);
		modal.resolve = undefined;
		modal.reject = undefined;
	}
}

const modalManager = new ModalManager();

export function useModal() {
	return modalManager;
}

export type * from "./types";
