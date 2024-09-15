<script setup lang="ts">
import { ref, computed } from "vue";
import type { Directory } from "../types/types";
import { useDirectoryStore } from "@/stores/directory";
import DirectoryFile from "./DirectoryFile.vue";

const dirStore = useDirectoryStore();

const props = defineProps<{
	directory: Directory;
	directoryParent: Directory | null;
}>();
const isDirectoryOpen = ref(false);
const newDirectoryName = ref("");

// Mapping of directory path to icons
const directoryIconMap: Record<string, string> = {
	bin: "vi-folder-type-binary",
	src: "vi-folder-type-src",
	utils: "vi-folder-type-tools",
};

const directoryIcon = ref(
	directoryIconMap[props.directory.path] || "vi-default-folder"
);

function clickDirectory() {
	dirStore.setActiveDirectory(props.directory);
	dirStore.setParentDirectory(props.directoryParent);
	dirStore.setActiveFile("");

	isDirectoryOpen.value = !isDirectoryOpen.value;
}

const isActiveDirectory = computed(
	() => dirStore.activeDirectory === props.directory && !dirStore.activeFile
);

const isDirectoryAddition = computed(
	() =>
		dirStore.activeDirectory === props.directory &&
		dirStore.isDirectoryAddition
);
</script>

<template>
	<!-- Indent padding for every DirectoryNode -->
	<div class="pl-4 select-none">
		<div
			@click="clickDirectory"
			:class="`hover:bg-neutral-800 hover:cursor-pointer flex items-center ${isActiveDirectory && 'bg-neutral-800'}`"
		>
			<v-icon v-if="isDirectoryOpen" name="bi-chevron-down" />
			<v-icon v-else name="hi-chevron-right" />

			<v-icon :name="directoryIcon" />
			<p class="pl-1">{{ directory.path }}</p>
		</div>

		<div v-if="isDirectoryOpen">
			<div
				v-if="isDirectoryAddition"
				class="flex ml-4 gap-1 border px-1 items-center"
			>
				<v-icon name="bi-chevron-down" />
				<v-icon
					:name="
						directoryIconMap[newDirectoryName] ||
						'vi-default-folder'
					"
				/>

				<input
					type="text"
					class="bg-[#181818] px-1 w-full outline-none"
					v-on:keyup.enter="dirStore.addDirectory(newDirectoryName)"
					v-on:keyup.esc="dirStore.setIsDirectoryAddition(false)"
					v-model="newDirectoryName"
					autofocus
				/>
			</div>

			<DirectoryNode
				v-for="directory in directory.directories"
				:key="directory.path"
				:directory
				:directoryParent="props.directory"
			/>

			<!-- Padding indent added for files in side directory -->
			<div
				:class="`hover:bg-neutral-800 hover:cursor-pointer pl-4`"
				v-for="fileName in props.directory.files"
				:key="fileName"
			>
				<DirectoryFile :fileName :fileDirectory="props.directory" />
			</div>
		</div>
	</div>
</template>
