/* eslint-disable @typescript-eslint/ban-types */
import BENCHMARKS_CONFIG from "configs/benchmarks.config";
import { formatHRTime, formatUnitPerTimeUnit } from "utils/formats";
import logger from "utils/logger";


/**
 * Main benchmarking function.
 * @param fn The function to run.
 * @param formatFn The function to format the result (optional).
 * @returns The length of the log (for further formatting).
 */
export const benchmark = (
    fn: () => unknown,
    formatFn?: (input: unknown) => string
): number => {
    let res: unknown;

    // Formatting
    let maxLogLength = 0;

    // Statistics
    let currTime = 0n;
    const initialTime = process.hrtime.bigint();

    for (let i = 1n; i <= BENCHMARKS_CONFIG.iterations; i++) {
        res = fn();

        if (i % BENCHMARKS_CONFIG.reportInterval === 0n) {
            currTime = process.hrtime.bigint() - currTime - initialTime;

            // Format the execution time
            const formattedTime = formatHRTime(currTime);

            // Format the result if a function is provided and if the result is valid
            let formattedRes = "...";

            if (res) {
                if (formatFn) formattedRes = formatFn(res);
                else formattedRes = `${res}`;
            }

            // Final log
            const log = `TIME: ${formattedTime} | SAMPLE: ${formattedRes}`;

            // Get the longest log length
            if (log.length > maxLogLength) maxLogLength = log.length;

            // Report
            logger.info(log);
        }
    }

    return maxLogLength;
};