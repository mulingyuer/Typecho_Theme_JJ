<template>
	<el-dialog
		v-model="visible"
		class="mobile-search-dialog"
		:show-close="false"
		:align-center="true"
		append-to-body
		transition="jj-dialog-fade"
		aria-label="搜索"
		@open="onOpen"
		@opened="onOpened"
		@close="onClose"
		@closed="onClosed"
	>
		<header class="mobile-search-header">
			<h2 class="mobile-search-title">搜索</h2>
			<el-button class="mobile-search-close" text aria-label="关闭搜索" @click="close">
				<i class="jj-icon jj-icon-guanbi" aria-hidden="true"></i>
			</el-button>
		</header>
		<div class="mobile-search-body">
			<form
				ref="formRef"
				class="mobile-search-form"
				method="post"
				:action="action"
				role="search"
				@submit="submitSearch"
			>
				<el-input
					ref="inputRef"
					v-model="keyword"
					name="s"
					maxlength="40"
					autocomplete="off"
					placeholder="输入关键字搜索"
				>
					<template #prefix>
						<i class="jj-icon jj-icon-sousuo" aria-hidden="true"></i>
					</template>
				</el-input>
				<el-button class="mobile-search-submit" type="primary" native-type="submit">
					<i class="jj-icon jj-icon-sousuo" aria-hidden="true"></i>
					<span>搜索</span>
				</el-button>
			</form>
			<section v-if="history.length" class="mobile-search-history" aria-labelledby="mobile-search-history-title">
				<div class="mobile-search-history-head">
					<h3 id="mobile-search-history-title">搜索历史</h3>
					<button type="button" class="mobile-search-clear" @click="clearHistory">清空</button>
				</div>
				<ul class="mobile-search-history-list">
					<li v-for="item in history" :key="item" class="mobile-search-history-item">
						<button type="button" :title="item" @click="searchHistory(item)">{{ item }}</button>
					</li>
				</ul>
			</section>
			<p v-else class="mobile-search-empty">暂无搜索历史</p>
		</div>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { ElButton, ElDialog, ElInput } from "element-plus";
import { useSearchHistory } from "@/composables/useSearchHistory";
import { dataStore } from "@/store/data";

defineProps<{ modalId: symbol; action: string }>();
const visible = defineModel<boolean>({ required: true });
const emit = defineEmits<{ cancel: [reason?: unknown]; closed: [] }>();
const keyword = ref("");
const formRef = ref<HTMLFormElement>();
const inputRef = ref<InstanceType<typeof ElInput>>();
const { history, addHistory, clearHistory } = useSearchHistory();
function close() {
	if (!visible.value) return;
	visible.value = false;
}

/** 每次打开都清空旧关键词，包括关闭动画尚未结束时重新打开的情况。 */
function onOpen() {
	keyword.value = "";
}

/** 等焦点陷阱和过渡完成后再聚焦，避免焦点被弹窗容器抢回。 */
function onOpened() {
	inputRef.value?.focus();
}

/** 所有关闭方式统一由 ElDialog 的 close 事件进入 useModal 取消协议。 */
function onClose() {
	emit("cancel", "close");
}

function onClosed() {
	emit("closed");
}

function submitSearch(event: Event) {
	event.preventDefault();
	search(keyword.value);
}

function searchHistory(value: string) {
	search(value);
}

/** 保留 Typecho 原生 POST 搜索，不经过 axios，也不改变后端路由。 */
function search(value: string) {
	const query = value.trim();
	if (!query || !formRef.value) return;
	keyword.value = query;
	addHistory(query);
	// 同步原生表单值，确保实际提交内容与写入历史的 trim 后关键词一致。
	const input = formRef.value.elements.namedItem("s");
	if (input instanceof HTMLInputElement) input.value = query;
	formRef.value.submit();
}

// 切到桌面端时走同一关闭流程，让 ElDialog 负责滚动锁和焦点恢复。
watch(
	() => dataStore.windowWidth,
	(width) => {
		if (width > 960 && visible.value) close();
	}
);
</script>

<style scoped lang="scss">
/* Dialog 被 Teleport 到 body，外层容器必须使用 :global 才能命中。 */
:global(.mobile-search-dialog) {
	width: min(calc(100vw - 32px), 560px);
	max-height: calc(100dvh - 32px - env(safe-area-inset-top));
	margin: max(16px, env(safe-area-inset-top)) auto 16px;
	border: 1px solid var(--jj-header-nav-border-color);
	border-radius: 12px;
	background: var(--jj-header-bg-color);
	box-shadow: 0 16px 40px rgba(0, 0, 0, 0.12);
	display: flex;
	flex-direction: column;
	overflow: hidden;
}

:global(.mobile-search-dialog > .el-dialog__header) {
	display: none;
}

:global(.mobile-search-dialog > .el-dialog__body) {
	padding: 0;
	overflow-y: auto;
}

.mobile-search-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 18px 20px 10px;
}
.mobile-search-title {
	font-size: 18px;
	font-weight: 500;
	line-height: 28px;
	color: var(--jj-header-menu-text-color);
}
.mobile-search-close {
	width: 32px;
	height: 32px;
	padding: 0;
	font-size: 18px;
	color: var(--jj-header-comment-color);
}
.mobile-search-body {
	padding: 10px 20px 20px;
}
.mobile-search-form {
	display: flex;
	align-items: center;
	gap: 10px;
}
:deep(.mobile-search-form .el-input) {
	flex: 1;
	min-width: 0;
}
:deep(.mobile-search-form .el-input__wrapper) {
	min-height: 48px;
	padding: 1px 14px;
	border-radius: 6px;
	background: var(--jj-header-search-btn-bg);
	box-shadow: 0 0 0 1px transparent inset;
}
:deep(.mobile-search-form .el-input__wrapper.is-focus) {
	background: var(--jj-header-bg-color);
	box-shadow: 0 0 0 1px var(--jj-header-text-active) inset;
}
:deep(.mobile-search-form .el-input__prefix) {
	color: var(--jj-header-comment-color);
	font-size: 18px;
}
:deep(.mobile-search-form .el-input__inner) {
	height: 46px;
	font-size: 14px;
	color: var(--jj-header-menu-text-color);
}
.mobile-search-submit {
	flex-shrink: 0;
	height: 48px;
	padding: 0 18px;
	border-radius: 6px;
	background: var(--jj-header-text-active);
}
.mobile-search-history {
	margin-top: 20px;
}
.mobile-search-history-head {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 12px;
	font-size: 13px;
	line-height: 22px;
	color: var(--jj-search-history-title-color);
}
.mobile-search-history-head h3 {
	font-size: inherit;
	font-weight: normal;
}
.mobile-search-clear {
	border: 0;
	padding: 0;
	background: transparent;
	font-size: inherit;
	color: var(--jj-header-text-active);
	cursor: pointer;
}
.mobile-search-history-list {
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
}
.mobile-search-history-item {
	min-width: 0;
	max-width: 100%;
}
.mobile-search-history-item button {
	display: block;
	max-width: 100%;
	border: 0;
	border-radius: 6px;
	padding: 8px 12px;
	background: var(--jj-header-search-btn-bg);
	font-size: 13px;
	line-height: 20px;
	color: var(--jj-search-history-text-color);
	cursor: pointer;
	@include one-line();
	&:hover,
	&:active,
	&:focus-visible {
		background: var(--jj-header-search-btn-bg-active);
		color: var(--jj-header-text-active);
		outline: none;
	}
}
.mobile-search-empty {
	padding: 20px 0 8px;
	font-size: 13px;
	text-align: center;
	color: var(--jj-header-comment-color);
}

@media screen and (min-width: 961px) {
	:global(.mobile-search-dialog) {
		display: none;
	}
}

@media screen and (max-width: 480px) {
	:global(.mobile-search-dialog) {
		width: calc(100vw - 24px);
	}
	.mobile-search-header {
		padding: 14px 14px 8px;
	}
	.mobile-search-body {
		padding: 8px 14px 16px;
	}
	.mobile-search-form {
		gap: 8px;
	}
	.mobile-search-submit {
		padding: 0 14px;
	}
}
</style>
