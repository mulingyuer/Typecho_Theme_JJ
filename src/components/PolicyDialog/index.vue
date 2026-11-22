<template>
	<el-dialog
		v-model="visible"
		class="policy-dialog"
		:show-close="false"
		:align-center="true"
		append-to-body
		transition="jj-dialog-fade"
		:aria-label="title"
		@open="onOpen"
		@close="onClose"
		@closed="onClosed"
	>
		<header class="policy-dialog-header">
			<h2 class="policy-dialog-title">{{ title }}</h2>
			<button class="policy-dialog-close" type="button" :aria-label="`关闭${title}`" @click="close">
				<i class="jj-icon jj-icon-guanbi" aria-hidden="true"></i>
			</button>
		</header>
		<div ref="bodyRef" class="policy-dialog-body" tabindex="0">
			<article v-if="type === 'agreement'" class="policy-dialog-article">
				<section class="policy-dialog-section">
					<h3>第 0 条 协议性质</h3>
					<p>本协议不是代码，但和代码一样：没人看，出事了才有人问“这谁写的”。</p>
					<p>
						你点击“同意”，视为你已阅读、理解并放弃阅读本协议。若你不同意，请按
						<code>Alt + F4</code>、拔网线或使用传统艺能：关闭页面并假装无事发生。
					</p>
				</section>
				<section class="policy-dialog-section">
					<h3>第 1 条 服务内容</h3>
					<ol>
						<li>我们提供本产品，状态大概是：“能跑，别动。”</li>
						<li>功能以实际合并进主分支的代码为准，需求以 Issue 里最后一秒的讨论为准。</li>
						<li>我们不保证服务永远稳定；毕竟祖传代码像屎山，动一行可能雪崩。</li>
						<li>
							若出现 Bug，请先确认：重启、清缓存、换浏览器、怀疑人生。若仍不行，请提
							Issue，我们会按“已读不回”的优先级处理。
						</li>
					</ol>
				</section>
				<section class="policy-dialog-section">
					<h3>第 2 条 账号与身份</h3>
					<ol>
						<li>
							你应妥善保管账号密码。不要用 <code>123456</code>，也不要用
							<code>password</code>；你这不叫密码，叫赛博菩萨给黑客开光。
						</li>
						<li>账号仅限本人使用。共享账号可以，但出了事请自行上演“小丑竟是我自己”。</li>
						<li>若你忘记密码，我们提供找回功能；找回失败说明缘分尽了，建议 V 我 50 重新注册。</li>
					</ol>
				</section>
				<section class="policy-dialog-section">
					<h3>第 3 条 用户行为规范</h3>
					<p>你承诺不实施以下行为：</p>
					<ol>
						<li>把需求文档当小说写，把 Bug 当彩蛋提。</li>
						<li>在评论区发疯文学、废话文学、抽象文学，导致服务器 CPU 和你的 KTV 一起烧起来。</li>
						<li>使用外挂、爬虫、脚本对服务进行“压力测试”，并美其名曰“我是安全研究员”。</li>
						<li>把我们的服务用于违法用途。我们虽然抽象，但不背这口锅。</li>
						<li>对维护者进行 PUA。维护者也是用爱发电的普通人，不是情绪垃圾桶；你可以催更，但不能人身攻击。</li>
					</ol>
				</section>
				<section class="policy-dialog-section">
					<h3>第 4 条 知识产权</h3>
					<ol>
						<li>
							本产品的代码、界面、文案、图标归我们所有。你可以学习，但不要 <code>Ctrl+C</code> 完还说“原创，尊嘟假嘟”。
						</li>
						<li>你发布的内容归你；但你授权我们为提供服务进行展示、缓存、压缩和“能跑就行”的处理。</li>
						<li>若你发现我们用了你的梗，请冷静。互联网梗的版权状态大概和祖传代码一样：来源不可考，能跑就别动。</li>
					</ol>
				</section>
				<section class="policy-dialog-section">
					<h3>第 5 条 免责与责任限制</h3>
					<ol>
						<li>因网络、设备、运营商、地球自转、水逆、上游依赖突然破坏性更新导致的服务中断，我们不承担“破防”责任。</li>
						<li>我们不对你因使用本产品产生的情绪价值、摸鱼时长、头发数量变化作出保证。</li>
						<li>
							在法律允许范围内，我们的赔偿责任上限为：你过去 12 个月实际支付费用的 0
							倍，或一根赛博电子木鱼，以较高者为准。
						</li>
					</ol>
				</section>
				<section class="policy-dialog-section">
					<h3>第 6 条 协议变更</h3>
					<p>我们可能随时更新本协议。更新后继续使用视为同意。</p>
					<p>
						最终解释权归随机数生成器所有；若随机数生成器罢工，则归项目维护者所有，但维护者不承担解释义务。典，太典了。
					</p>
				</section>
				<section class="policy-dialog-section">
					<h3>第 7 条 争议解决</h3>
					<p>发生争议，双方应先友好沟通、提 Issue、发 PR。若合并冲突无法解决，按以下顺序处理：</p>
					<ol>
						<li>石头剪刀布；</li>
						<li>掷骰子；</li>
						<li>谁代码 review 通过听谁的；</li>
						<li>实在不行，去楼下便利店买瓶水冷静一下。</li>
					</ol>
				</section>
			</article>
			<article v-else class="policy-dialog-article">
				<section class="policy-dialog-section">
					<h3>一、我们收集哪些信息</h3>
					<p>为了让你体验“水灵灵地使用”，我们可能收集：</p>
					<ol>
						<li>账号信息：昵称、头像、邮箱等。你填“吴彦祖”也行，但我们知道你不是。</li>
						<li>设备信息：浏览器、系统、屏幕尺寸、IP 地址。主要用于判断“是你网络不行，不是我们服务器不行”。</li>
						<li>日志信息：访问时间、点击记录、崩溃日志。用于修 Bug 和写事故报告。</li>
						<li>Cookie 及类似技术：用于记住登录状态。不是烤箱里的 Cookie，不能吃，别问。</li>
						<li>你主动提供的内容：评论、反馈、截图。你发“退退退”，我们不会真的退，但会记录。</li>
					</ol>
				</section>
				<section class="policy-dialog-section">
					<h3>二、我们怎么使用信息</h3>
					<p>我们使用信息用于：</p>
					<ol>
						<li>提供、维护、改进服务；</li>
						<li>修复 Bug，降低屎山雪崩概率；</li>
						<li>判断需求变更到底是“遥遥领先”还是“遥遥无期”；</li>
						<li>做匿名统计分析，比如“原来大家真的不看用户协议”；</li>
						<li>训练一个更懂你的 Bug。开玩笑的。主要是让主题别太抽象。</li>
					</ol>
				</section>
				<section class="policy-dialog-section">
					<h3>三、我们如何共享信息</h3>
					<ol>
						<li>我们不会出售你的个人信息。除非对方给得实在太多了——不会的，放心，我们穷得有原则。</li>
						<li>
							我们可能向云服务商、CDN、日志服务商等必要合作方共享最小必要信息。外卖小哥不在此列，他只知道你的奶茶到了。
						</li>
						<li>法律法规要求时，我们会依法配合。这个不玩梗，认真脸。</li>
					</ol>
				</section>
				<section class="policy-dialog-section">
					<h3>四、数据存储与安全</h3>
					<ol>
						<li>数据存储在境内服务器或合规云服务中。服务器有空调，也有监控；比你家路由器安全一点，大概。</li>
						<li>
							我们采用 HTTPS 等行业常见措施保护数据。Base64 不是加密，MD5 也不是加密，这点程序员最后的底线还是有的。
						</li>
						<li>互联网没有绝对安全。若发生安全事件，我们会按法律要求处理并通知你，不玩“听我说谢谢你”的糊弄学。</li>
					</ol>
				</section>
				<section class="policy-dialog-section">
					<h3>五、你的权利</h3>
					<p>你可以访问、更正、删除个人信息，或注销账号。</p>
					<p>注销后，我们会删除或匿名化处理你的信息；但日志、备份、审计记录可能按法律要求保留一段时间。</p>
					<p>如果你想“删库跑路”，请先确认你不是在删我们的库。谢谢配合，栓 Q。</p>
				</section>
				<section class="policy-dialog-section">
					<h3>六、未成年人保护</h3>
					<p>若你是未成年人，请在监护人指导下使用。</p>
					<p>不要用“我今年 18”糊弄系统；系统可能不信，我们也可能不信。</p>
				</section>
				<section class="policy-dialog-section">
					<h3>七、Cookie 说明</h3>
					<p>我们使用 Cookie 保持登录、统计访问和改进体验。</p>
					<p>
						你可以通过浏览器管理 Cookie。禁用后部分功能可能失效，届时请勿发疯文学：“为什么是我——为什么不能是这个世界——”
					</p>
				</section>
				<section class="policy-dialog-section">
					<h3>八、联系与更新</h3>
					<p>如对本协议有疑问，请提 Issue 或在评论区留言。</p>
					<p>我们可能更新本政策，更新后继续使用视为同意。</p>
					<p>若你看到这里，恭喜你，你已超过 99% 的用户。你很有偷感，也很硬控，但请记住：</p>
					<blockquote class="policy-dialog-quote">
						<p>本文件纯属恶搞。真实产品请使用专业法律文本。</p>
						<p>程序员不背法务的锅，法务也不背程序员的 Bug。大家都有光明的未来，能跑就行。</p>
					</blockquote>
				</section>
			</article>
		</div>
	</el-dialog>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import { ElDialog } from "element-plus";
import type { PolicyType } from "./types";

const props = defineProps<{ modalId: symbol; type: PolicyType }>();
const visible = defineModel<boolean>({ required: true });
const emit = defineEmits<{ cancel: [reason?: unknown]; closed: [] }>();
const bodyRef = ref<HTMLElement>();
const title = computed(() => (props.type === "agreement" ? "用户协议" : "隐私政策"));

function close() {
	if (!visible.value) return;
	visible.value = false;
}

function resetScroll() {
	void nextTick(() => {
		bodyRef.value?.scrollTo({ top: 0 });
	});
}

function onOpen() {
	resetScroll();
}

/** 所有关闭方式统一进入 useModal 的取消协议。 */
function onClose() {
	emit("cancel", "close");
}

function onClosed() {
	emit("closed");
}

watch(
	() => props.type,
	() => {
		if (visible.value) resetScroll();
	}
);
</script>

<style scoped lang="scss">
:global(.policy-dialog) {
	width: 640px;
	max-width: calc(100vw - 48px);
	max-height: min(720px, calc(100dvh - 64px - env(safe-area-inset-top) - env(safe-area-inset-bottom)));
	margin: max(32px, env(safe-area-inset-top)) auto max(32px, env(safe-area-inset-bottom));
	border-radius: 8px;
	background-color: var(--jj-login-dialog-content-bg);
	display: flex;
	flex-direction: column;
	overflow: hidden;
}
:global(.policy-dialog > .el-dialog__header) {
	display: none;
}
:global(.policy-dialog > .el-dialog__body) {
	display: flex;
	flex-direction: column;
	min-height: 0;
	padding: 0;
	overflow: hidden;
}
:global(.el-overlay:has(.policy-dialog)) {
	background-color: var(--jj-login-dialog-mask-bg);
}
.policy-dialog-header {
	flex-shrink: 0;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 20px;
	padding: 20px 24px;
	border-bottom: 1px solid var(--jj-login-dialog-head-border);
}
.policy-dialog-title {
	font-size: 20px;
	font-weight: 500;
	line-height: 28px;
	color: var(--jj-login-dialog-title-color);
}
.policy-dialog-close {
	flex-shrink: 0;
	width: 32px;
	height: 32px;
	border: 0;
	border-radius: 4px;
	padding: 0;
	background: transparent;
	font-size: 18px;
	color: var(--jj-login-dialog-close-color);
	cursor: pointer;
	&:hover {
		color: var(--jj-login-dialog-link-color-hover);
	}
	&:focus-visible {
		outline: 2px solid var(--jj-login-dialog-link-color);
		outline-offset: 2px;
	}
	&:active {
		opacity: 0.7;
	}
}
.policy-dialog-close .jj-icon {
	display: block;
}
.policy-dialog-body {
	min-height: 0;
	padding: 24px;
	overflow-y: auto;
	overscroll-behavior: contain;
	font-size: 14px;
	line-height: 1.9;
	color: var(--jj-header-text-color);
	&:focus-visible {
		outline: 2px solid var(--jj-login-dialog-link-color);
		outline-offset: -2px;
	}
}
.policy-dialog-section + .policy-dialog-section {
	margin-top: 24px;
}
.policy-dialog-section h3 {
	margin-bottom: 10px;
	font-size: 16px;
	font-weight: 600;
	line-height: 1.6;
	color: var(--jj-login-dialog-title-color);
}
.policy-dialog-section p + p,
.policy-dialog-section p + ol,
.policy-dialog-section ol + p {
	margin-top: 10px;
}
.policy-dialog-section ol {
	padding-left: 24px;
	list-style: decimal;
}
.policy-dialog-section li {
	padding-left: 4px;
	overflow-wrap: anywhere;
}
.policy-dialog-section li + li {
	margin-top: 6px;
}
.policy-dialog-section code {
	border-radius: 3px;
	padding: 2px 5px;
	background-color: var(--jj-login-dialog-input-bg);
	font-family: monospace;
	font-size: 0.9em;
	color: var(--jj-login-dialog-input-color);
	overflow-wrap: anywhere;
	word-break: break-word;
}
.policy-dialog-quote {
	margin: 12px 0;
	border-left: 3px solid var(--jj-login-dialog-link-color);
	border-radius: 0 4px 4px 0;
	padding: 10px 14px;
	background-color: var(--jj-login-dialog-input-bg);
	color: var(--jj-login-dialog-footer-color);
}
.policy-dialog-quote p + p {
	margin-top: 6px;
}

@media screen and (max-width: 640px) {
	:global(.policy-dialog) {
		width: calc(100vw - 24px);
		max-width: calc(100vw - 24px);
		max-height: calc(100dvh - 24px - env(safe-area-inset-top) - env(safe-area-inset-bottom));
		margin: max(12px, env(safe-area-inset-top)) auto max(12px, env(safe-area-inset-bottom));
	}
	.policy-dialog-header {
		gap: 12px;
		padding: 14px 16px;
	}
	.policy-dialog-title {
		font-size: 18px;
	}
	.policy-dialog-body {
		padding: 16px;
		font-size: 13px;
		line-height: 1.8;
	}
	.policy-dialog-section + .policy-dialog-section {
		margin-top: 20px;
	}
	.policy-dialog-section h3 {
		font-size: 15px;
	}
	.policy-dialog-section ol {
		padding-left: 22px;
	}
}
</style>
