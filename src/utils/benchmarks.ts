/* eslint-disable @typescript-eslint/ban-types */
import BENCHMARKS_CONFIG from "configs/benchmarks.config";
import { bigIntDiv } from "helpers/maths";
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

    // Time in nanoseconds between each report
    const reportInterval = 1_000_000_000n * BigInt(BENCHMARKS_CONFIG.reportInterval);

    // Formatting
    let maxLogLength = 0;

    // Statistics
    let lastReportTime = process.hrtime.bigint();
    let currReportNb = 0;
    let timeBeforeFn = 0n;
    let currTime = 0n;

    while (currReportNb < BENCHMARKS_CONFIG.nbReports) {
        timeBeforeFn = process.hrtime.bigint();
        res = fn();
        currTime = process.hrtime.bigint();

        // Continue if the time elapsed since the last report is less than the report interval
        if (currTime - lastReportTime < reportInterval) continue;

        // If the time elapsed since the last report is greater than the report interval

        // Update the last report time & report
        lastReportTime = currTime;

        // Format the execution time
        const formattedTime = formatHRTime(currTime - timeBeforeFn);

        // Calculate the theoretical number of iterations per second
        const iterationsPerSecond = bigIntDiv(1_000_000_000n, currTime - timeBeforeFn).result;

        // Format the number of iterations per second
        const formattedIterationsPerSecond = formatUnitPerTimeUnit(Number(iterationsPerSecond), "IT", "s", 14, true);

        // Format the result if a function is provided and if the result is valid
        let formattedRes = "N/D";

        if (res) {
            if (formatFn) formattedRes = formatFn(res);
            else formattedRes = `${res}`;
        }

        // Final log
        const log = `EXECUTION: ${formattedTime} | ITERATIONS: ${formattedIterationsPerSecond} | SAMPLE: ${formattedRes}`;

        // Get the longest log length
        if (log.length > maxLogLength) maxLogLength = log.length;

        // Report
        logger.info(log);

        // Increment the number of reports
        currReportNb++;
    }

    return maxLogLength;
};