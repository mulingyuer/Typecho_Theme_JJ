<!--
 * @Author: mulingyuer
 * @Date: 2026-09-27 15:45:34
 * @LastEditTime: 2026-09-27 15:54:17
 * @LastEditors: mulingyuer
 * @Description: spa app
 * @FilePath: \Typecho_Theme_JJ\src\modules\spa\App.vue
 * 怎么可能会有bug！！！
-->
<template>
	<el-config-provider :locale="zhCn">
		<global-modal-renderer />
	</el-config-provider>
</template>

<script setup lang="ts">
import { ElConfigProvider } from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import GlobalModalRenderer from "@/components/GlobalModalRenderer/index.vue";
</script>

<style lang="scss" scoped></style>
