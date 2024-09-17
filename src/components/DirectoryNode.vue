<script setup lang="ts">
import { useDirectoryStore } from "@/stores/store";
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

const visibilityToggle = ref(!props.directoryParent);

// Visibility split to separate reactive computed (read only) state from user toggle click state
const isDirectoryOpen = computed(
	() =>
		isAddDirectoryMode.value ||
		isAddFileMode.value ||
		visibilityToggle.value
);

const inputValue = ref("");

const directoryIcon = ref(
	directoryIconMap[props.directory.path] || "vi-default-folder"
);

function clickDirectory() {
	dirStore.$patch({
		activeDirectory: props.directory,
		activeDirectoryParent: props.directoryParent,
		activeFile: "",
		isAddFileMode: false,
		isAddDirectoryMode: false,
	});

	visibilityToggle.value = !visibilityToggle.value;
}

function addDirectory() {
	if (inputValue.value !== "") {
		dirStore.addDirectory(inputValue.value);

		inputValue.value = "";
		visibilityToggle.value = true;
	}
}

function addFile() {
	if (inputValue.value !== "") {
		dirStore.addFile(inputValue.value);

		inputValue.value = "";
		visibilityToggle.value = true;
	}
}
</script>

<template>
	<!-- Indent padding for every DirectoryNode -->
	<div class="pl-3 select-none min-w-full w-fit">
		<div
			@click="clickDirectory"
			:class="`flex items-center gap-1 px-1 hover:bg-neutral-800 hover:cursor-pointer ${
				isActiveDirectory && 'bg-neutral-800'
			}`"
		>
			<v-icon v-if="isDirectoryOpen" name="bi-chevron-down" />
			<v-icon v-else name="hi-chevron-right" />

			<v-icon :name="directoryIcon" />
			<p>{{ directory.path }}</p>
		</div>

		<div v-if="isDirectoryOpen">
			<div
				v-if="isAddDirectoryMode || isAddFileMode"
				class="flex ml-4 gap-1 items-center"
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
					class="w-full outline-none border px-1 bg-[#181818]"
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
