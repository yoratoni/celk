/* eslint-disable @typescript-eslint/ban-types */
import BENCHMARKS_CONFIG from "configs/benchmarks.config";
import { bigIntDiv } from "helpers/maths";
import { formatHRTime, formatUnitPerTimeUnit } from "utils/formats";
import logger from "utils/logger";


/**
 * Main benchmarking function.
 * @param fn The function to run.
 * @param formatFn The function to format the result (optional).
 * @param testPassed Whether the test passed (optional).
 * @param unit The unit of the result (optional, defaults to "IT").
 * @returns The length of the log (for further formatting).
 */
export const benchmark = (
    fn: () => unknown,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formatFn?: (input?: any) => string,
    testPassed?: boolean,
    unit: string = "IT"
): number => {
    let res: unknown;
    let formattedRes = "N/D";

    // Time in nanoseconds between each report
    const reportInterval = 1_000_000_000n * BigInt(BENCHMARKS_CONFIG.reportInterval);

    // Formatting
    let maxLogLength = 0;

    // Statistics
    let lastReportTime = process.hrtime.bigint();
    let currReportNb = 0;

    // Averages
    let avgTimeAdder = 0;
    let avgIterationsPerSecondAdder = 0;

    let totalTime = 0n;
    let t0 = 0n;
    let t1 = 0n;

    for (let i = 0; i < Infinity; i++) {
        t0 = process.hrtime.bigint();
        res = fn();
        t1 = process.hrtime.bigint();
        totalTime += t1 - t0;

        if (t1 - lastReportTime >= reportInterval) {
            lastReportTime = t1;

            // Calculate the average execution time
            const averageTime = bigIntDiv(totalTime, BigInt(i)).result;
            avgTimeAdder += averageTime;

            // Format the execution time
            const formattedTime = formatHRTime(averageTime);

            // Calculate the number of iterations per second
            const iterationsPerSecond = 1_000_000_000 / averageTime;
            avgIterationsPerSecondAdder += iterationsPerSecond;

            // Format the number of iterations per second
            const formattedIterationsPerSecond = formatUnitPerTimeUnit(
                1_000_000_000 / averageTime,
                unit,
                "s",
                14,
                true
            );

            // Format the result if a function is provided and if the result is valid
            // Also accept a formatting function only as the function could write elsewhere
            // than in its return value
            if (formatFn || res) {
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

            // Reset the total time & the number of iterations
            totalTime = 0n;
            i = 0;

            // Break if the number of reports is greater than the maximum number of reports
            if (currReportNb >= BENCHMARKS_CONFIG.nbReports) break;
        }
    }

    // Format the average execution time
    const formattedAvgTime = formatHRTime(avgTimeAdder / currReportNb);

    // Format the average number of iterations per second
    const formattedAvgIterationsPerSecond = formatUnitPerTimeUnit(
        avgIterationsPerSecondAdder / currReportNb,
        unit,
        "s",
        14,
        true
    );

    // Test passed ?
    let testPassedStr = "N/D";
    if (testPassed === false) testPassedStr = "KO";
    else if (testPassed === true) testPassedStr = "OK";

    // Conclusion
    const log = `EXECUTION: ${formattedAvgTime} | ITERATIONS: ${formattedAvgIterationsPerSecond} | TEST:   ${testPassedStr.padStart(formattedRes.length, " ")}`;

    logger.info("=".repeat(maxLogLength));
    if (testPassedStr === "N/D" || testPassed) logger.info(log);
    else logger.error(log);

    return maxLogLength;
};