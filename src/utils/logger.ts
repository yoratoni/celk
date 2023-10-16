import { createLogger, format, transports } from "winston";

import GLOBAL_CONFIG from "configs/global.config";


const loggerFormat = format.combine(
    format.timestamp({
        format: GLOBAL_CONFIG.dateFormat
    }),
    format.printf((info) => `[${info.timestamp}] [${info.level.toUpperCase()}] ${info.message}`),
    format.colorize({
        all: true
    })
);

/**
 * Main Winston logger instance.
 */
const logger = createLogger({
    format: loggerFormat,
    transports: [
        new transports.Console({
            level: GLOBAL_CONFIG.verbose ? "silly" : "info"
        })
    ],
});


export default logger;