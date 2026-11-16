<template>
	<component
		:is="item.component"
		v-for="item in modal.list"
		:key="item.modalId"
		v-model="item.visible"
		:modal-id="item.modalId"
		v-bind="item.props"
		@confirm="(value: unknown) => modal.confirm(item.modalId, value)"
		@cancel="(reason?: unknown) => modal.cancel(item.modalId, reason)"
		@closed="modal.closed(item.modalId)"
	/>
</template>

<script setup lang="ts">
import { useModal } from "@/composables/useModal";

const modal = useModal();
</script>
