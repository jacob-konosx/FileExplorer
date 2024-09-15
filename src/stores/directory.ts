import { ref, type Ref } from "vue";
import { defineStore } from "pinia";
import type { Directory } from "@/types/types";

export const useDirectoryStore = defineStore("directoryStore", () => {
	const activeDirectory: Ref<Directory | null> = ref(null);
	const parentDirectory: Ref<Directory | null> = ref(null);
	const activeFile: Ref<string | null> = ref(null);
	const isDirectoryAddition = ref(false);
	const isFileAddition = ref(false);

	function setActiveDirectory(directory: Directory) {
		activeDirectory.value = directory;
	}
	function setParentDirectory(directory: Directory | null) {
		parentDirectory.value = directory;
	}

	function setActiveFile(file: string) {
		activeFile.value = file;
	}

	function deleteActiveDirectory() {
		if (parentDirectory.value) {
			parentDirectory.value.directories =
				parentDirectory.value.directories.filter(
					(dir) => dir !== activeDirectory.value
				);

			activeDirectory.value = null;
		}
	}

	function deleteActiveFile() {
		activeDirectory.value!.files = activeDirectory.value!.files.filter(
			(file) => file !== activeFile.value
		);
		activeFile.value = null;
	}

	function addDirectory(directoryName: string) {
		activeDirectory.value?.directories.unshift({
			path: directoryName,
			files: [],
			directories: [],
		});

		isDirectoryAddition.value = false;
	}

	function addFile(fileName: string) {
		activeDirectory.value?.files.unshift(fileName);

		isFileAddition.value = false;
	}

	function setIsDirectoryAddition(bool: boolean) {
		isDirectoryAddition.value = bool;
	}

	return {
		activeDirectory,
		activeFile,
		setActiveDirectory,
		setActiveFile,
		deleteActiveDirectory,
		setParentDirectory,
		addDirectory,
		addFile,
		deleteActiveFile,
		isDirectoryAddition,
		isFileAddition,
		setIsDirectoryAddition,
	};
});
