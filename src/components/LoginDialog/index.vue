<template>
	<el-dialog
		v-model="visible"
		class="login-dialog"
		:show-close="false"
		:align-center="true"
		append-to-body
		transition="jj-dialog-fade"
		aria-label="登录"
		@close="onClose"
		@closed="onClosed"
	>
		<div class="login-dialog-content">
			<div class="login-dialog-close">
				<button class="login-dialog-close-btn" type="button" aria-label="关闭登录" @click="close">
					<i class="jj-icon jj-icon-guanbi login-dialog-close-icon" aria-hidden="true"></i>
				</button>
			</div>
			<div class="login-dialog-head">
				<h2 class="login-dialog-title">登录</h2>
			</div>
			<div class="login-dialog-body">
				<div class="login-dialog-body-left">
					<div class="login-dialog-body-left-title">账号密码登录</div>
					<!-- 不拦截 submit：保留浏览器原生校验和 Typecho POST 登录、回跳行为。 -->
					<form class="login-dialog-form" name="login" method="post" role="form" :action="action">
						<input type="hidden" name="referer" :value="referer" required />
						<div class="login-dialog-input-group username">
							<input type="text" name="name" placeholder="请输入账号" required pattern="\S+.*" />
							<img class="panfish-img greeting" :src="greetingImage" alt="" aria-hidden="true" />
						</div>
						<div class="login-dialog-input-group password">
							<input
								type="password"
								name="password"
								placeholder="请输入密码"
								autocomplete="off"
								required
								pattern="\S+.*"
							/>
							<img class="panfish-img blindfold" :src="blindfoldImage" alt="" aria-hidden="true" />
						</div>
						<div class="login-dialog-input-group remember">
							<label class="remember-label" for="header-login-remember">
								<input id="header-login-remember" class="checkbox" type="checkbox" name="remember" value="1" />
								<span class="login-dialog-input-checkbox">
									<i class="jj-icon jj-icon-check login-dialog-input-checkbox-icon"></i>
								</span>
								<span class="login-dialog-input-checkbox-text">记住账号</span>
							</label>
						</div>
						<div class="login-dialog-input-group submit">
							<button class="login-dialog-form-btn" type="submit">登录</button>
						</div>
						<img class="panfish-img normal" :src="normalImage" alt="" aria-hidden="true" />
					</form>
				</div>
				<div class="login-dialog-body-right">
					<div class="login-dialog-qrcode-title">扫码登录</div>
					<div class="login-dialog-qrcode">
						<img class="login-dialog-qrcode-img" :src="qrcodeImage" alt="扫码登录" />
					</div>
					<div class="login-dialog-qrcode-tips">请使用手机扫码登录</div>
				</div>
			</div>
			<div class="login-dialog-footer">
				注册登录即表示同意<a class="login-dialog-link" href="javascript:;" title="用户协议" @click="showProtocolTip"
					>用户协议</a
				>和<a class="login-dialog-link" href="javascript:;" title="隐私政策" @click="showProtocolTip">隐私政策</a>
			</div>
		</div>
	</el-dialog>
</template>

<script setup lang="ts">
import { ElDialog, ElMessage } from "element-plus";
import normalImage from "@/assets/images/login/normal.png";
import greetingImage from "@/assets/images/login/greeting.png";
import blindfoldImage from "@/assets/images/login/blindfold.png";
import qrcodeImage from "@/assets/images/login/login_dialog_qrcode.png";

defineProps<{ modalId: symbol; action: string; referer: string }>();
const visible = defineModel<boolean>({ required: true });
const emit = defineEmits<{ cancel: [reason?: unknown]; closed: [] }>();

function close() {
	if (!visible.value) return;
	visible.value = false;
}

/** @close 对接 useModal 的取消协议，@closed 在动画结束后通知管理器。 */
function onClose() {
	emit("cancel", "close");
}

function onClosed() {
	emit("closed");
}

/** 保留原静态协议提示，不引入额外路由或配置。 */
function showProtocolTip() {
	ElMessage.info({ message: "真的一滴都没有了", plain: true });
}
</script>

<style scoped lang="scss">
/* ElDialog 被 Teleport 到 body，外层容器必须使用 :global 才能命中。 */
:global(.login-dialog) {
	width: 640px;
	margin: 120px auto 20px;
	border-radius: 8px;
	background-color: var(--jj-login-dialog-content-bg);
	overflow: visible;
}
:global(.login-dialog > .el-dialog__header) {
	display: none;
}
:global(.login-dialog > .el-dialog__body) {
	padding: 0;
}
:global(.el-overlay:has(.login-dialog)) {
	background-color: var(--jj-login-dialog-mask-bg);
}
.login-dialog-content {
	position: relative;
}
.login-dialog-close {
	position: absolute;
	top: 20px;
	right: 27px;
	z-index: 1;
	font-size: 18px;
	color: var(--jj-login-dialog-close-color);
}
.login-dialog-close-btn {
	border: 0;
	padding: 0;
	background: transparent;
	font-size: inherit;
	color: inherit;
	cursor: pointer;
	&:active {
		opacity: 0.7;
	}
}
.login-dialog-close-icon {
	display: block;
	font-size: inherit;
}
.login-dialog-head {
	padding: 20px 27px;
	border-bottom: 1px solid var(--jj-login-dialog-head-border);
}
.login-dialog-title {
	font-size: 20px;
	font-weight: normal;
	color: var(--jj-login-dialog-title-color);
}
.login-dialog-body {
	display: flex;
	padding: 20px 27px 0;
}
.login-dialog-body-left {
	flex-grow: 1;
	min-width: 0;
}
.login-dialog-body-left-title {
	font-size: 16px;
	color: var(--jj-login-dialog-title-color);
	margin-bottom: 16px;
}
.login-dialog-input-group {
	input[type="text"],
	input[type="password"] {
		display: block;
		width: 100%;
		height: 40px;
		padding: 10px;
		color: var(--jj-login-dialog-input-color);
		background-color: var(--jj-login-dialog-input-bg);
		border: 1px solid var(--jj-login-dialog-input-border);
		border-radius: 4px;
		outline: none;
		&::placeholder {
			color: var(--jj-login-dialog-input-placeholder-color);
		}
		&:focus {
			background-color: var(--jj-login-dialog-input-bg-focus);
			border-color: var(--jj-login-dialog-input-border-focus);
		}
	}
	& + & {
		margin-top: 20px;
	}
	&.submit {
		margin-top: 30px;
	}
	&.remember {
		position: relative;
		display: flex;
		margin-top: 15px;
		.remember-label {
			display: flex;
			align-items: center;
			cursor: pointer;
			@include no-select();
		}
		input[type="checkbox"] {
			position: absolute;
			width: 0;
			height: 0;
			margin: 0;
			outline: none;
			z-index: -1;
			opacity: 0;
			&:checked + .login-dialog-input-checkbox {
				border-color: var(--jj-login-dialog-input-checkbox-border-active);
				background-color: var(--jj-login-dialog-input-checkbox-bg-active);
				.login-dialog-input-checkbox-icon {
					opacity: 1;
					transform: scale(1);
				}
			}
			&:checked ~ .login-dialog-input-checkbox-text {
				color: var(--jj-login-dialog-input-checkbox-text-active);
			}
		}
	}
	/* 账号和密码聚焦时切换熊猫图片，失焦后恢复 normal。 */
	&.username:focus-within {
		.greeting {
			display: block;
		}
		& ~ .normal {
			display: none;
		}
	}
	&.password:focus-within {
		.blindfold {
			display: block;
		}
		& ~ .normal {
			display: none;
		}
	}
}
.login-dialog-input-checkbox {
	flex-shrink: 0;
	margin-right: 6px;
	width: 16px;
	height: 16px;
	border: 1px solid var(--jj-login-dialog-input-checkbox-border);
	border-radius: 2px;
	text-align: center;
	line-height: 14px;
	transition:
		border-color 0.2s ease-in-out,
		background-color 0.2s ease-in-out;
}
.login-dialog-input-checkbox-icon {
	display: block;
	font-size: 12px;
	color: var(--jj-login-dialog-input-checkbox-icon);
	transform: scale(0);
	transition: transform 0.2s ease-in-out;
}
.login-dialog-input-checkbox-text {
	font-size: 13px;
	color: var(--jj-login-dialog-title-color);
	line-height: 1;
}
.login-dialog-form-btn {
	display: block;
	width: 100%;
	height: 40px;
	background-color: var(--jj-login-dialog-form-btn-bg);
	border: none;
	border-radius: 4px;
	font-size: 14px;
	color: var(--jj-login-dialog-form-btn-color);
	cursor: pointer;
	transition: background-color 0.1s linear;
	&:hover {
		background-color: var(--jj-login-dialog-form-btn-bg-hover);
	}
	&:active {
		opacity: 0.7;
	}
}
.panfish-img {
	position: absolute;
	top: 0;
	left: 50%;
	width: 120px;
	display: none;
	pointer-events: none;
	&.normal {
		display: block;
		transform: translate(-50%, -95%);
	}
	&.greeting {
		transform: translate(-50%, -90%);
	}
	&.blindfold {
		transform: translate(-50%, -90%);
	}
}
.login-dialog-body-right {
	flex-shrink: 0;
	width: 230px;
	padding-left: 36px;
	margin-left: 36px;
	border-left: 1px solid var(--jj-login-dialog-body-right-border);
}
.login-dialog-qrcode-title {
	font-size: 16px;
	color: #252933;
	margin-bottom: 16px;
}
.login-dialog-qrcode {
	margin-bottom: 16px;
	border: 1px solid var(--jj-login-dialog-qrcode-border);
	border-radius: 4px;
	width: 150px;
	height: 150px;
	padding: 5px;
	overflow: hidden;
}
.login-dialog-qrcode-img {
	width: 100%;
	height: 100%;
	vertical-align: top;
}
.login-dialog-qrcode-tips {
	font-size: 16px;
	color: var(--jj-login-dialog-title-color);
}
.login-dialog-footer {
	margin-top: 40px;
	padding-bottom: 20px;
	font-size: 14px;
	color: var(--jj-login-dialog-footer-color);
	text-align: center;
}
.login-dialog-link {
	text-decoration: none;
	color: var(--jj-login-dialog-link-color);
	margin: 0 5px;
	&:hover {
		color: var(--jj-login-dialog-link-color-hover);
	}
	&:active {
		opacity: 0.7;
	}
}

@media screen and (max-width: 960px) {
	:global(.login-dialog) {
		width: 420px;
	}
	.login-dialog-body-right {
		display: none;
	}
}

@media screen and (max-width: 640px) {
	:global(.login-dialog) {
		width: 90vw;
		max-width: calc(100vw - 24px);
	}
}
</style>
