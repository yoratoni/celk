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

    // Time in nanoseconds between each report
    const reportInterval = 1_000_000_000n * BigInt(BENCHMARKS_CONFIG.reportInterval);

    // Corrector to remove the time of the currTime measurement etc..
    const corrector = 1.45;

    // Formatting
    let maxLogLength = 0;

    // Statistics
    let lastReportTime = process.hrtime.bigint();
    let currReportNb = 0;
    let currTime = 0n;
    let iterations = 0n;

    while (currReportNb < BENCHMARKS_CONFIG.nbReports) {
        res = fn();

        currTime = process.hrtime.bigint();
        iterations++;

        // Continue if the time elapsed since the last report is less than the report interval
        if (currTime - lastReportTime < reportInterval) continue;

        // If the time elapsed since the last report is greater than the report interval

        // Calculate the average time per iteration
        const time = (currTime - lastReportTime) / iterations;

        // Update the last report time & report
        lastReportTime = currTime;

        // Format the execution time
        const formattedTime = formatHRTime(time);

        // Calculate the theoretical number of iterations per second
        const iterationsPerSecond = 1_000_000_000n / time;

        // Format the number of iterations per second
        const formattedIterationsPerSecond = formatUnitPerTimeUnit(Number(iterationsPerSecond), "IT", "s", 14, true);

        // Theoretical number of iterations per second (without currTime being measured etc..)
        const formattedTheoreticalIterationsPerSecond = formatUnitPerTimeUnit(Number(iterationsPerSecond) * corrector, "IT", "s", 14, true);

        // Format the result if a function is provided and if the result is valid
        let formattedRes = "N/D";

        if (res) {
            if (formatFn) formattedRes = formatFn(res);
            else formattedRes = `${res}`;
        }

        // Final log
        const log = `EXECUTION: ${formattedTime} | ITERATIONS: ${formattedIterationsPerSecond} | THEORETICAL: ${formattedTheoreticalIterationsPerSecond} | SAMPLE: ${formattedRes}`;

        // Get the longest log length
        if (log.length > maxLogLength) maxLogLength = log.length;

        // Report
        logger.info(log);

        // Reset the number of iterations
        iterations = 0n;

        // Increment the number of reports
        currReportNb++;
    }

    return maxLogLength;
};