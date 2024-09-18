<script setup lang="ts">
import { useDirectoryStore } from "@/stores/store";
import type { Directory } from "@/types/types";
import {
	fileExtensionIconMap,
	reservedFileIconMap,
} from "@/utils/iconMappings";
import { computed, ref } from "vue";

const props = defineProps<{
	fileName: string;
	fileDirectory: Directory;
}>();

const dirStore = useDirectoryStore();

const fileIcon = ref(
	reservedFileIconMap[props.fileName] ||
		fileExtensionIconMap[props.fileName.split(".").pop() || ""] ||
		"vi-default-file"
);

function clickFile() {
	dirStore.$patch({
		activeDirectory: props.fileDirectory,
		activeFile: props.fileName,
		isAddDirectoryMode: false,
		isAddFileMode: false,
	});
}

const isActiveFile = computed(
	() =>
		dirStore.activeDirectory === props.fileDirectory &&
		dirStore.activeFile === props.fileName
);
</script>

<template>
	<div
		:class="`flex items-center gap-1 pl-4 hover:bg-neutral-800 hover:cursor-pointer ${
			isActiveFile && 'bg-neutral-800'
		}`"
		@click="clickFile"
	>
		<v-icon :name="fileIcon" />
		<p class="whitespace-nowrap overflow-ellipsis overflow-hidden">
			{{ props.fileName }}
		</p>
	</div>
</template>
