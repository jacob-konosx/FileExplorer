import "./main.css";

import { createApp } from "vue";
import App from "./App.vue";

import { OhVueIcon, addIcons } from "oh-vue-icons";
import {
	ViFileTypeGit,
	ViFileTypeLightPrettier,
	ViFileTypeMarkdown,
	ViFolderTypeBinary,
	FaCogs,
	ViDefaultFolder,
	ViFileTypeNpm,
	ViFolderTypeSrc,
	ViFileTypeTypescript,
	ViFolderTypeTools,
	ViFileTypeTsconfig,
	ViFileTypeEditorconfig,
	ViDefaultFile,
	ViFileTypeLog,
	BiChevronDown,
	HiChevronRight,
	ViFileTypeYarn,
	ViFileTypeJson,
	ViFileTypeXml,
	PxFilePlus,
	PxFolderPlus,
	PxTrash,
} from "oh-vue-icons/icons";
import { createPinia } from "pinia";

addIcons(
	ViFileTypeGit,
	ViFileTypeLightPrettier,
	ViFileTypeMarkdown,
	ViFolderTypeBinary,
	FaCogs,
	ViDefaultFolder,
	ViFileTypeNpm,
	ViFolderTypeSrc,
	ViFileTypeTypescript,
	ViFolderTypeTools,
	ViFileTypeTsconfig,
	ViFileTypeEditorconfig,
	ViDefaultFile,
	ViFileTypeLog,
	ViFileTypeYarn,
	HiChevronRight,
	BiChevronDown,
	ViFileTypeJson,
	ViFileTypeXml,
	PxFilePlus,
	PxFolderPlus,
	PxTrash
);

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.component("v-icon", OhVueIcon);
app.mount("#app");
