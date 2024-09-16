<script setup lang="ts">
import { useDirectoryStore } from "@/stores/directory";
import DirectoryNode from "@/components/DirectoryNode.vue";
import { generateFileStructure } from "@/utils/directory";
import { ref } from "vue";

const isLoading = ref(false);

const dirStore = useDirectoryStore();

if (!dirStore.directoryRoot.isSaved) {
	fetchFilenames();
}

async function fetchFilenames() {
	try {
		isLoading.value = true;

		const response = await fetch(
			"https://ab-file-explorer.athleticnext.workers.dev/?file=regular"
		);
		const data = await response.json();

		if (data) {
			const { filepaths } = data;

			generateFileStructure(filepaths, dirStore.directoryRoot);

			dirStore.saveDirectoryLocalStorage();
		}
	} catch (error) {
		console.log(error);
	} finally {
		isLoading.value = false;
	}
}

function deleteActiveEntity() {
	if (dirStore.activeFile) {
		dirStore.deleteActiveFile();
	} else {
		dirStore.deleteActiveDirectory();
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
		<h1 class="text-center text-4xl mt-12 mb-8">File Explorer</h1>

		<div class="flex justify-center gap-2 mb-2 *:p-1 *:cursor-pointer">
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
			<div class="hover:bg-neutral-800" @click="deleteActiveEntity">
				<v-icon name="px-trash" /> Delete
			</div>
		</div>

		<div v-if="isLoading" class="text-center">Loading...</div>
		<div
			v-else
			class="m-auto max-w-72 max-h-[75vh] overflow-y-auto border border-neutral-700 py-3 pr-3"
		>
			<DirectoryNode
				:directory="dirStore.directoryRoot"
				:directoryParent="null"
			/>
		</div>
	</main>
</template>
