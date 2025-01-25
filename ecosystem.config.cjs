module.exports = {
	apps: [
		{
			name: "BMC-LinkBot",
			interpreter_args: "--env-file=.env",
			script: "./dist/index.js",
		},
	],
};
