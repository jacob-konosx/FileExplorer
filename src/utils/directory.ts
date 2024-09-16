import type { Directory } from "@/types/types";

export function generateFileStructure(
	filepaths: string[],
	directoryRoot: Directory
) {
	filepaths.forEach((filepath) => {
		const pathSplit = filepath.split("/");

		// If file is in currentDirectory add it to files array already
		if (pathSplit.length === 1) {
			directoryRoot.files.push(pathSplit[0]);
			return;
		}

		// Get the path excluding the file name
		const desiredPath = pathSplit.slice(0, -1);
		const fileName = pathSplit[pathSplit.length - 1];

		if (fileName.includes(".")) {
			const fileDir = getDirectoryRecursively(directoryRoot, desiredPath);
			fileDir.files.push(fileName);
		} else {
			// Generate empty directory where splits -> full path
			getDirectoryRecursively(directoryRoot, pathSplit);
		}
	});

	directoryRoot.isSaved = true;
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
