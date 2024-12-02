const colors = {
	Red: "\u001B[31m",
	Green: "\u001B[32m",
	Yellow: "\u001B[33m",
	Blue: "\u001B[34m",
	Magenta: "\u001B[35m",
	Cyan: "\u001B[36m",
	Gray: "\u001B[90m",
};

const Reset = "\u001B[0m";

const colorFunctions = Object.fromEntries(
	Object.entries(colors).map(([colorName, colorValue]) => [
		colorName,
		(text: string) => `${colorValue}${text}${Reset}`,
	]),
);

export const { Red, Green, Yellow, Blue, Magenta, Cyan, Gray } = colorFunctions;
