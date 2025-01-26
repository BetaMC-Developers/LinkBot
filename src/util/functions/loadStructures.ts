import { readdir, stat } from "node:fs/promises";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import type { Predicate } from "../types/index.js";

export default async function loadStructures<Type>(path: string, predicate: Predicate<Type>): Promise<Type[]> {
	const structures: Type[] = [];

	const folderStats = await stat(path);

	if (!folderStats.isDirectory()) {
		throw new Error(`The provided path: "${path}" is not a directory`);
	}

	const items = await readdir(path);

	for (const item of items) {
		const itemPath = join(path, item);
		const itemStats = await stat(itemPath);

		if (itemStats.isDirectory()) {
			const files = await readdir(itemPath).then((files) => files.filter((file) => file.endsWith(".js")));

			for (const file of files) {
				const filePath = join(itemPath, file);
				const fileURL = pathToFileURL(resolve(filePath)).toString();
				const structure = await import(fileURL).then((module) => module.default);

				if (!predicate(structure)) {
					console.warn(`The structure: "${structure}" is not valid, skipping...`);
					continue;
				}

				structures.push(structure);
			}
		} else if (item.endsWith(".js")) {
			const fileURL = pathToFileURL(resolve(itemPath)).toString();
			const structure = await import(fileURL).then((module) => module.default);

			if (!predicate(structure)) {
				console.warn(`The structure: "${structure}" is not valid, skipping...`);
				console.log(fileURL);
				continue;
			}

			structures.push(structure);
		}
	}

	return structures;
}
