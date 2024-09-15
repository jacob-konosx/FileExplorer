export type Directory = {
	path: string;
	files: string[];
	directories: Directory[];
	isSaved?: boolean;
};
