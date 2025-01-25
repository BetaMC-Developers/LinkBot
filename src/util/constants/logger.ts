import { Logger } from "@1blckhrt/logger";

const logger = new Logger({
	enableColors: true,
	logToFile: true,
	prefix: "BMC",
	useTimestamps: true,
});

export default logger;
