/* eslint-disable @typescript-eslint/ban-types */
import BENCHMARK_CONFIG from "configs/benchmark.config";
import { bigintToPrivateKey, formatDuration, formatHRTime, formatUnitPerTimeUnit } from "utils/formats";
import logger from "utils/logger";


/**
 * The type of the result of the measureComputeSpeed function.
 */
type isComputeSpeedRes = {
    total: bigint;
    average: bigint;
    speed: number;
};

/**
 * Generates a random string of a given length.
 * @param length The length of the string to generate.
 * @returns The generated string.
 */
export const generateRandomString = (length: number): string => {
    let result = "";
    const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return result;
};

/**
 * Generates a random hexadecimal string of a given length.
 * @param length The length of the string to generate.
 * @returns The generated hexadecimal string.
 */
export const generateRandomHexString = (length: number): `0x${string}` => {
    let result = "";
    const characters = "0123456789ABCDEF";

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return `0x${result}`;
};

/**
 * Generates a random private key (bigint - 64 digits).
 * @returns The generated private key.
 */
export const generateRandomPrivateKey = (): bigint => BigInt(generateRandomHexString(64));

/**
 * Measures the time it takes to run a function (1 iteration) in nanoseconds.
 * @param fn The function to run.
 * @returns The time it took to run the function in nanoseconds.
 */
export const measureComputeSpeedOnce = (fn: Function): bigint => {
    // Access function result to prevent optimization
    let res = undefined;

    const start = process.hrtime.bigint();
    res = fn();
    const end = process.hrtime.bigint();

    // Prevent unused variable warning
    if (res === "EMPTY_FIELD") return 0n;

    return end - start;
};

/**
 * Measures the time it takes to run a function (multiple iterations) in nanoseconds.
 * @param fn The function to run.
 * @param iterations The number of iterations to run the function.
 * @returns Time statistics about the function.
 */
export const measureComputeSpeed = (
    fn: Function,
    iterations: number
): isComputeSpeedRes => {
    let total = 0n;

    for (let i = 0; i < iterations; i++) {
        const tmpSpd = measureComputeSpeedOnce(fn) as bigint;
        total += tmpSpd;
    }

    return {
        total,
        average: total / BigInt(iterations),
        speed: Number(1_000_000_000n / (total / BigInt(iterations)))
    };
};

/**
 * Formatted output of the time it took to run a function (multiple iterations).
 * @param fn The function to run.
 * @param iterations The number of iterations to run the function.
 * @param padding The padding to use for the iteration number (optional, defaults to 12).
 * @returns The length of the log message.
 */
export const measureComputeSpeedFormatted = (
    fn: Function,
    iterations: number,
    padding = 12
): number => {
    const res = measureComputeSpeed(fn, iterations);

    const log = `PRG: ${iterations.toLocaleString("en-US").padStart(padding, " ")
    } | AVG: ${formatHRTime(res.average)} | TOTAL: ${formatHRTime(res.total)
    } | SPEED: ${formatUnitPerTimeUnit(res.speed, "OP")
    }`;

    logger.info(log);
    return log.length;
};

/**
 * Main benchmarking function, executing cycles of different iterations.
 * @param fn The function to run.
 * @param useSandboxCycles Whether to use the sandbox cycles or the normal cycles.
 * @returns The length of the longest log message.
 */
export const benchmark = (fn: Function, useSandboxCycles = false): number => {
    const cycles = useSandboxCycles ? BENCHMARK_CONFIG.sandboxCycles : BENCHMARK_CONFIG.cycles;
    const padding = Math.max(...cycles.map((cycle) => cycle.toLocaleString("en-US").length));

    let longestLogLength = 0;
    let logLength = 0;

    for (const cycle of cycles) {
        logLength = measureComputeSpeedFormatted(fn, cycle, padding);
        if (logLength > longestLogLength) longestLogLength = logLength;
    }

    return longestLogLength;
};

/**
 * Benchmarking function specifically made for the Ranger (Bitcoin private key generator).
 * @param fn The function to run.
 */
export const benchmarkRanger = (fn: () => bigint): void => {
    // Statistics
    const initialTime = Date.now();
    const lengths = {
        pk: 0,
        progress: 0,
        total: 0
    };

    let totalPkps = 0;
    let nbOfPkpsMeasurements = 0;

    // Access function result to prevent optimization
    let res: bigint = 0n;

    for (let i = 1n; i <= BENCHMARK_CONFIG.rangerIterations; i++) {
        res = fn();

        if (i % BENCHMARK_CONFIG.rangerReportInterval === 0n) {
            // Convert the bigint result to a private key string
            const resStr = bigintToPrivateKey(res);

            // Length of the private key (for report formatting)
            lengths.pk = resStr.length;

            // Pad the index with zeros to match the high range length
            const paddedIndex = i.toLocaleString("en-US").padStart(11, " ");

            // Generate the progress part of the report
            const progress = `${paddedIndex}`;
            lengths.progress = progress.length;

            // Elapsed time
            const rawElapsedTime = Date.now() - initialTime;

            // Calculate the average private keys per second
            const rawPkps = Math.round(Number(i) / (rawElapsedTime / 1000));
            const pkps = formatUnitPerTimeUnit(rawPkps);

            // Log the report
            const log = `PRG: ${progress} | PKPS: ${pkps} | Sample: ${resStr}`;
            lengths.total = log.length;
            logger.info(log);

            // PKPS statistics
            totalPkps += rawPkps;
            nbOfPkpsMeasurements++;
        }
    }

    // PKPS statistics
    const avgPkpsFormatted = formatUnitPerTimeUnit(Math.round(totalPkps / nbOfPkpsMeasurements), "k", "s", 11);
    const totalPkpsFormatted = formatUnitPerTimeUnit(totalPkps, "k", null);

    logger.info("=".repeat(lengths.total));
    logger.info(`AVG: ${avgPkpsFormatted.padStart(lengths.progress, " ")} | ALPK: ${totalPkpsFormatted} | Time: ${formatDuration(Date.now() - initialTime).padStart(lengths.pk + 2, " ")}`);
};