<script setup lang="ts">
import { useDirectoryStore } from "@/stores/directory";
import type { Directory } from "@/types/types";
import { computed, ref } from "vue";

const props = defineProps<{
	fileName: string;
	fileDirectory: Directory;
}>();

const dirStore = useDirectoryStore();

const reservedFileIconMap: Record<string, string> = {
	".editorconfig": "vi-file-type-editorconfig",
	".gitignore": "vi-file-type-git",
	".prettierrc": "vi-file-type-light-prettier",
	"package.json": "vi-file-type-npm",
	"tsconfig.json": "vi-file-type-tsconfig",
	"yarn.lock": "vi-file-type-yarn",
};

const fileIconMap: Record<string, string> = {
	ts: "vi-file-type-typescript",
	md: "vi-file-type-markdown",
	cmd: "fa-cogs",
	json: "vi-file-type-json",
	log: "vi-file-type-log",
	xml: "vi-file-type-xml",
};

const fileIcon = ref(
	reservedFileIconMap[props.fileName] ||
		fileIconMap[props.fileName.split(".").pop() || ""] ||
		"vi-default-file"
);

function clickFile() {
	dirStore.$patch({ activeDirectory: props.fileDirectory });
	dirStore.$patch({ activeFile: props.fileName });
}

const isActiveFile = computed(
	() =>
		dirStore.activeDirectory === props.fileDirectory &&
		dirStore.activeFile === props.fileName
);
</script>

<template>
	<div
		:class="`whitespace-nowrap overflow-ellipsis overflow-hidden hover:overflow-visible ${isActiveFile && 'bg-neutral-800'}`"
		@click="clickFile"
	>
		<v-icon :name="fileIcon" />
		<span class="pl-1">
			{{ props.fileName }}
		</span>
	</div>
</template>
