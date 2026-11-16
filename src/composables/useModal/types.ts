import type { Component } from "vue";

export type ModalProps = Record<string, unknown>;

export interface PersistentOptions {
	/** 跨组件类型复用同一弹窗实例。 */
	key?: string;
	/** 根据 props 区分同组件的不同常驻实例。 */
	keyGenerator?: (props: ModalProps) => string;
	/** 未配置 key 时默认按组件类型保持单例。 */
	singleton?: boolean;
}

export interface OpenOptions<Props extends ModalProps = ModalProps> {
	component: Component;
	props?: Props;
	persistent?: boolean | PersistentOptions;
}

export type ModalResolve<T = void> = [T] extends [void] ? (value?: T) => void : (value: T) => void;
export type ModalReject = (reason?: unknown) => void;

export interface ModalInstance {
	/** 每次创建都唯一，用于事件寻址，与常驻复用 key 不同。 */
	modalId: symbol;
	/** 由 GlobalModalRenderer 通过 v-model 双向绑定。 */
	visible: boolean;
	component: Component;
	props?: ModalProps;
	/** never 允许存储任意泛型 resolve，实际值由 open<T> 的 Promise 约束。 */
	resolve?: (value: never) => void;
	reject?: ModalReject;
	persistent?: boolean | PersistentOptions;
}

export interface BaseModalProps {
	modalId: symbol;
}

export interface BaseModalEmits {
	confirm: [value?: unknown];
	cancel: [reason?: unknown];
	closed: [];
}
