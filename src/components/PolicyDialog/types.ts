import type { BaseModalProps } from "@/composables/useModal/types";

export type PolicyType = "agreement" | "privacy";

export interface PolicyDialogProps extends BaseModalProps {
	type: PolicyType;
}
