<script setup lang="ts">
import { ref } from "vue";
import { useDirectoryStore } from "@/stores/directory";
import DirectoryNode from "@/components/DirectoryNode.vue";
import type { Directory } from "@/types/types";

const loading = ref(false);

const dirStore = useDirectoryStore();

const { directoryRoot } = dirStore;

if (!directoryRoot.isSaved) {
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

			directoryRoot.isSaved = true;
			dirStore.saveDirectoryLocalStorage();
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
			directoryRoot.files.push(splits[0]);
			return;
		}

		// Get the path excluding the file name
		const desiredPath = splits.slice(0, -1);
		const fileName = splits[splits.length - 1];

		if (fileName.includes(".")) {
			const fileDir = getDirectoryRecursively(directoryRoot, desiredPath);
			fileDir.files.push(fileName);
		} else {
			// Generate empty directory with splits - full path
			getDirectoryRecursively(directoryRoot, splits);
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

function deleteActiveDirectory() {
	if (dirStore.activeFile === "") {
		dirStore.deleteActiveDirectory();
	} else {
		dirStore.deleteActiveFile();
	}

	dirStore.saveDirectoryLocalStorage();
}

window.addEventListener("keydown", (e) => {
	if (e.key == "Escape") {
		dirStore.$patch({ isAddDirectoryMode: false });
		dirStore.$patch({ isAddFileMode: false });
	}
});
</script>

<template>
	<main>
		<div class="max-[15vh] mb-4">
			<h1 class="mt-12 mb-8 text-center text-4xl">File Explorer</h1>

			<div
				class="flex m-auto justify-center mb-3 gap-2 *:p-1 *:px-2 *:cursor-pointer"
			>
				<div
					class="hover:bg-neutral-800"
					@click="dirStore.$patch({ isAddFileMode: true })"
				>
					<v-icon name="px-file-plus" /> Add file
				</div>
				<div
					class="hover:bg-neutral-800"
					@click="dirStore.$patch({ isAddDirectoryMode: true })"
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
			<DirectoryNode :directory="directoryRoot" :directoryParent="null" />
		</div>
	</main>
</template>

<style scoped></style>
