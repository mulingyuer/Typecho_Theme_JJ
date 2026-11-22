import LoginDialog from "@/components/LoginDialog/index.vue";
import type { LoginDialogProps } from "@/components/LoginDialog/types";
import { useModal } from "@/composables/useModal";

type LoginConfig = Pick<LoginDialogProps, "action" | "referer">;

export class LoginDialogEntry {
	private readonly modal = useModal();
	private config: LoginConfig | null = null;

	constructor() {
		const configElement = document.querySelector<HTMLScriptElement>("#header-login-config");
		// 已登录页面没有登录配置，无需初始化。
		if (!configElement) return;

		try {
			this.config = JSON.parse(configElement.textContent || "") as LoginConfig;
		} catch (error) {
			console.error("登录弹窗配置解析失败", error);
			return;
		}
		if (!this.config.action || !this.config.referer) {
			console.error("登录弹窗配置缺少 action 或 referer");
			return;
		}

		document.querySelector(".header-login-btn")?.addEventListener("click", this.openLoginDialog.bind(this));
		document.querySelector(".header-article-btn.login")?.addEventListener("click", this.openLoginDialog.bind(this));
	}

	private openLoginDialog() {
		if (!this.config) return;
		// 两个入口复用同一常驻实例；关闭产生的 rejection 属于正常取消。
		void this.modal
			.open({
				component: LoginDialog,
				props: { action: this.config.action, referer: this.config.referer },
				persistent: { key: "login-dialog" }
			})
			.catch(() => {});
	}
}
