<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { Ref } from "vue";

type Directory = {
	path: String;
	files: string[];
	directories: Directory[];
	isSaved?: boolean;
};

const loading = ref(false);
const directory: Ref<Directory> = ref(
	JSON.parse(localStorage.getItem("directory")!) || {
		path: "",
		files: [],
		directories: [],
		isSaved: false,
	}
);

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

			directory.value.isSaved = true;
			setLocalDirectory();
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
			directory.value.files.push(splits[0]);
			return;
		}

		// Get the path excluding the file name
		const desiredPath = splits.slice(0, -1);
		const fileName = splits[splits.length - 1];

		insertDirectoryRecursively(directory.value, desiredPath, fileName);
	});
}

function insertDirectoryRecursively(
	currentDirectory: Directory,
	desiredPath: string[],
	fileName: string
) {
	if (desiredPath.length === 0) {
		currentDirectory.files.push(fileName);
		return;
	}

	// Check if there is a desired directory on currentDirectory if not then create it
	if (!currentDirectory.directories.find((d) => d.path === desiredPath[0])) {
		currentDirectory.directories.push({
			path: desiredPath[0],
			files: [],
			directories: [],
		});
	}

	const nextCurrentDirectory = currentDirectory.directories.find((d) => d.path === desiredPath[0])!;

	// Remove first path item
	desiredPath.shift();

	insertDirectoryRecursively(nextCurrentDirectory, desiredPath, fileName);
}

function setLocalDirectory() {
	localStorage.setItem("directory", JSON.stringify(directory.value));
}

onMounted(() => {
	if (!directory.value.isSaved) {
		fetchFilepaths();
	}
});
</script>

<template>
	<header></header>

	<main>
		<h1>File Explorer</h1>
		<pre>{{ JSON.stringify(directory, null, 4) }}</pre>
	</main>
</template>

<style scoped></style>
