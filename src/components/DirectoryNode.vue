<script setup lang="ts">
import { useDirectoryStore } from "@/stores/directory";
import type { Directory } from "@/types/types";
import { ref, computed } from "vue";
import DirectoryFile from "@/components/DirectoryFile.vue";
import {
	directoryIconMap,
	fileExtensionIconMap,
	reservedFileIconMap,
} from "@/utils/iconMappings";

const dirStore = useDirectoryStore();

const props = defineProps<{
	directory: Directory;
	directoryParent: Directory | null;
}>();
const isDirectoryOpen = ref(false);
const inputValue = ref("");

const directoryIcon = ref(
	directoryIconMap[props.directory.path] || "vi-default-folder"
);

function clickDirectory() {
	dirStore.$patch({ activeDirectory: props.directory });
	dirStore.$patch({ activeDirectoryParent: props.directoryParent });
	dirStore.$patch({ activeFile: "" });

	isDirectoryOpen.value = !isDirectoryOpen.value;
}

const isActiveDirectory = computed(
	() => dirStore.activeDirectory === props.directory && !dirStore.activeFile
);

const isAddDirectoryMode = computed(
	() =>
		dirStore.activeDirectory === props.directory &&
		dirStore.isAddDirectoryMode
);

const isAddFileMode = computed(
	() => dirStore.activeDirectory === props.directory && dirStore.isAddFileMode
);

function addDirectory() {
	if (inputValue.value !== "") {
		dirStore.addDirectory(inputValue.value);
		inputValue.value = "";
	}
}

function addFile() {
	if (inputValue.value !== "") {
		dirStore.addFile(inputValue.value);
		inputValue.value = "";
	}
}
</script>

<template>
	<!-- Indent padding for every DirectoryNode -->
	<div class="pl-3 select-none">
		<div
			@click="clickDirectory"
			:class="`hover:bg-neutral-800 hover:cursor-pointer pl-1 gap-1 flex items-center ${isActiveDirectory && 'bg-neutral-800'}`"
		>
			<div v-if="!props.directory.isSaved">
				<v-icon v-if="isDirectoryOpen" name="bi-chevron-down" />
				<v-icon v-else name="hi-chevron-right" />
			</div>

			<v-icon :name="directoryIcon" />
			<p>{{ directory.path }}</p>
		</div>

		<div v-if="isDirectoryOpen || props.directory.isSaved">
			<div
				v-if="isAddDirectoryMode || isAddFileMode"
				class="flex ml-4 gap-1 border px-1 items-center"
			>
				<v-icon v-if="isAddDirectoryMode" name="bi-chevron-down" />

				<v-icon
					v-if="isAddDirectoryMode"
					:name="directoryIconMap[inputValue] || 'vi-default-folder'"
				/>
				<v-icon
					v-else
					:name="
						reservedFileIconMap[inputValue] ||
						fileExtensionIconMap[
							inputValue.split('.').pop() || ''
						] ||
						'vi-default-file'
					"
				/>

				<input
					type="text"
					class="bg-[#181818] px-1 w-full outline-none"
					v-on:keyup.enter="
						isAddDirectoryMode ? addDirectory() : addFile()
					"
					v-model="inputValue"
					autofocus
				/>
			</div>

			<DirectoryNode
				v-for="directory in directory.directories"
				:key="directory.path"
				:directory
				:directoryParent="props.directory"
			/>

			<template v-for="fileName in props.directory.files" :key="fileName">
				<DirectoryFile :fileName :fileDirectory="props.directory" />
			</template>
		</div>
	</div>
</template>
