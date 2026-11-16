import type { BaseModalProps } from "@/composables/useModal/types";

export interface LoginDialogProps extends BaseModalProps {
	/** Typecho 生成的登录提交地址，包含安全 token，不能在前端重新生成。 */
	action: string;
	/** 当前页面地址，由 Typecho 在登录成功后用于回跳，不能丢弃。 */
	referer: string;
}
