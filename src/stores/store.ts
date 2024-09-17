import { ref, type Ref } from "vue";
import { defineStore } from "pinia";
import type { Directory } from "@/types/types";

export const useDirectoryStore = defineStore("directoryStore", () => {
	const directoryRoot: Ref<Directory> = ref(
		JSON.parse(localStorage.getItem("directory")!) || {
			path: "root",
			files: [],
			directories: [],
			isSaved: false,
		}
	);
	const activeDirectory = ref(directoryRoot.value);
	const activeDirectoryParent: Ref<Directory | null> = ref(null);
	const activeFile: Ref<string | null> = ref(null);
	const isAddDirectoryMode = ref(false);
	const isAddFileMode = ref(false);

	function deleteActiveDirectory() {
		if (activeDirectoryParent.value) {
			activeDirectoryParent.value.directories =
				activeDirectoryParent.value.directories.filter(
					(dir) => dir !== activeDirectory.value
				);
		}
	}

	function deleteActiveFile() {
		activeDirectory.value.files = activeDirectory.value.files.filter(
			(file) => file !== activeFile.value
		);

		activeFile.value = null;
	}

	function addDirectory(directoryName: string) {
		// Does directory already exist as a child
		if (
			activeDirectory.value.directories.find(
				(dir) => dir.path.toLowerCase() === directoryName.toLowerCase()
			)
		)
			return;

		const createdDirectory: Directory = {
			path: directoryName,
			files: [],
			directories: [],
		};

		activeDirectory.value.directories.unshift(createdDirectory);

		activeDirectory.value = createdDirectory;

		isAddDirectoryMode.value = false;
		saveDirectoryLocalStorage();
	}

	function addFile(fileName: string) {
		if (
			activeDirectory.value.files.find(
				(file) =>
					file.toLocaleLowerCase() === fileName.toLocaleLowerCase()
			)
		)
			return;

		activeDirectory.value.files.unshift(fileName);

		activeFile.value = fileName;

		isAddFileMode.value = false;
		saveDirectoryLocalStorage();
	}

	function saveDirectoryLocalStorage() {
		localStorage.setItem("directory", JSON.stringify(directoryRoot.value));
	}

	return {
		activeDirectory,
		activeFile,
		deleteActiveDirectory,
		activeDirectoryParent,
		addDirectory,
		addFile,
		deleteActiveFile,
		isAddDirectoryMode,
		isAddFileMode,
		directoryRoot,
		saveDirectoryLocalStorage,
	};
});
