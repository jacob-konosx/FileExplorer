// Mapping of directory path to icons
export const directoryIconMap: Record<string, string> = {
	bin: "vi-folder-type-binary",
	src: "vi-folder-type-src",
	utils: "vi-folder-type-tools",
};

export const reservedFileIconMap: Record<string, string> = {
	".editorconfig": "vi-file-type-editorconfig",
	".gitignore": "vi-file-type-git",
	".prettierrc": "vi-file-type-light-prettier",
	"package.json": "vi-file-type-npm",
	"tsconfig.json": "vi-file-type-tsconfig",
	"yarn.lock": "vi-file-type-yarn",
};

export const fileExtensionIconMap: Record<string, string> = {
	ts: "vi-file-type-typescript",
	md: "vi-file-type-markdown",
	cmd: "fa-cogs",
	json: "vi-file-type-json",
	log: "vi-file-type-log",
	xml: "vi-file-type-xml",
};
