<script setup lang="ts">
import { ref } from "vue";
import type { Ref } from "vue";
import type { Directory } from "./types/types";
import DirectoryNode from "./components/DirectoryNode.vue";
import { useDirectoryStore } from "./stores/directory";

const loading = ref(false);
const dir: Ref<Directory> = ref(
	JSON.parse(localStorage.getItem("directory")!) || {
		path: "file_explorer",
		files: [],
		directories: [],
		isSaved: false,
	}
);
const dirStore = useDirectoryStore();

if (!dir.value.isSaved) {
	fetchFilepaths();
}

async function fetchFilepaths() {
	try {
		loading.value = true;

		const response = await fetch(
			"https://ab-file-explorer.athleticnext.workers.dev/?file=regular"
		);
		const data = await response.json();

		if (data) {
			const { filepaths } = data;

			generateFileStructure(filepaths);

			dir.value.isSaved = true;
			saveDirectoryLocalStorage();
		}
	} catch (error) {
		console.log(error);
	} finally {
		loading.value = false;
	}
}

function generateFileStructure(filepaths: string[]) {
	filepaths.forEach((filepath) => {
		const splits = filepath.split("/");

		// If file is in currentDirectory add it to files array already
		if (splits.length === 1) {
			dir.value.files.push(splits[0]);
			return;
		}

		// Get the path excluding the file name
		const desiredPath = splits.slice(0, -1);
		const fileName = splits[splits.length - 1];

		if (fileName.includes(".")) {
			const fileDir = getDirectoryRecursively(dir.value, desiredPath);
			fileDir.files.push(fileName);
		} else {
			// Generate empty directory with splits - full path
			getDirectoryRecursively(dir.value, splits);
		}
	});
}

function getDirectoryRecursively(
	currentDirectory: Directory,
	desiredPath: string[]
): Directory {
	// Recursion end condition
	if (desiredPath.length === 0) {
		return currentDirectory;
	}

	// Check if there is a desired directory on currentDirectory if not then create it
	if (!currentDirectory.directories.find((d) => d.path === desiredPath[0])) {
		currentDirectory.directories.push({
			path: desiredPath[0],
			files: [],
			directories: [],
		});
	}

	const nextCurrentDirectory = currentDirectory.directories.find(
		(d) => d.path === desiredPath[0]
	)!;

	// Remove first path item
	desiredPath.shift();

	return getDirectoryRecursively(nextCurrentDirectory, desiredPath);
}

function saveDirectoryLocalStorage() {
	localStorage.setItem("directory", JSON.stringify(dir.value));
}

function deleteActiveDirectory() {
	if (!dirStore.activeFile) {
		dirStore.deleteActiveDirectory();
	} else {
		dirStore.deleteActiveFile();
	}

	saveDirectoryLocalStorage();
}
</script>

<template>
	<main>
		<div class="h-[10vh]">
			<h1 class="mt-20 mb-6 text-center text-4xl">File Explorer</h1>

			<div
				class="flex m-auto justify-center mb-3 gap-2 *:px-2 *:cursor-pointer"
			>
				<div class="hover:bg-neutral-800">
					<v-icon name="px-file-plus" /> Add file
				</div>
				<div
					class="hover:bg-neutral-800"
					@click="dirStore.setIsDirectoryAddition(true)"
				>
					<v-icon name="px-folder-plus" /> Add folder
				</div>
				<div
					class="hover:bg-neutral-800"
					@click="deleteActiveDirectory"
				>
					<v-icon name="px-trash" /> Delete
				</div>
			</div>
		</div>

		<div
			class="m-auto max-w-72 max-h-[75vh] overflow-y-auto border border-neutral-700 p-4"
		>
			<DirectoryNode :directory="dir" :directoryParent="null" />
		</div>
	</main>
</template>

<style scoped></style>
