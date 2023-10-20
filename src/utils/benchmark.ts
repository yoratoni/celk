/* eslint-disable @typescript-eslint/ban-types */
import BENCHMARK_CONFIG from "configs/benchmark.config";
import logger from "utils/logger";


/**
 * The type of the result of the measureComputeSpeed function.
 */
type isComputeSpeedRes = {
    total: number;
    average: number;
};

/**
 * Generates a random string of a given length.
 * @param length The length of the string to generate.
 * @returns The generated string.
 */
export function generateRandomString(length: number): string {
    let result = "";
    const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return result;
}

/**
 * Generates a random hexadecimal string of a given length.
 * @param length The length of the string to generate.
 * @returns The generated hexadecimal string.
 */
export function generateRandomHexString(length: number): `0x${string}` {
    let result = "";
    const characters = "0123456789ABCDEF";

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return `0x${result}`;
}

/**
 * Generates a random private key (bigint - 64 digits).
 * @returns The generated private key.
 */
export function generateRandomPrivateKey(): bigint {
    return BigInt(generateRandomHexString(64));
}

/**
 * Format a time in ms, into a responsive string with the en-US locale format.
 * @param time The time in ms.
 */
export function formatTime(time: number): string {
    if (time > 1000) {
        return `${(time / 1000).toLocaleString("en-US", { minimumFractionDigits: 2 })}s`;
    }

    // EN US format with 6 decimals
    return `${time.toLocaleString("en-US", { minimumFractionDigits: 6 })}ms`;
}

/**
 * Measures the time it takes to run a function (1 iteration) in milliseconds.
 * @param fn The function to run.
 * @param inputFn The function to get the input from (optional).
 * @returns The time it took to run the function in milliseconds.
 */
export function measureComputeSpeedOnce(
    fn: Function,
    inputFn?: Function
): number {
    let input: unknown = undefined;
    if (inputFn) input = inputFn();

    // Access function result to prevent optimization
    let res = undefined;

    const start = performance.now();
    res = fn(input);
    const end = performance.now();

    // Prevent unused variable warning
    if (res === "EMPTY_FIELD") return 0;

    return end - start;
}

/**
 * Measures the time it takes to run a function (multiple iterations) in milliseconds.
 * @param fn The function to run.
 * @param iterations The number of iterations to run the function.
 * @param inputFn The function to get the input from at each iteration (optional).
 * @returns The time it took to run the function in milliseconds (average).
 */
export function measureComputeSpeed(
    fn: Function,
    iterations: number,
    inputFn?: Function
): isComputeSpeedRes {
    let total = 0;

    for (let i = 0; i < iterations; i++) {
        total += measureComputeSpeedOnce(fn, inputFn) as number;
    }

    return {
        total,
        average: total / iterations
    };
}

/**
 * Formatted output of the time it took to run a function (1 iteration).
 * @param fn The function to run.
 * @param inputFn The function to get the input from (optional).
 */
export function measureComputeSpeedOnceFormatted(
    fn: Function,
    inputFn?: Function
): void {
    const res = measureComputeSpeedOnce(fn, inputFn);
    logger.info(`[1] Avg: ${formatTime(res)} | Total: ${formatTime(res)}`);
}

/**
 * Formatted output of the time it took to run a function (multiple iterations).
 * @param fn The function to run.
 * @param iterations The number of iterations to run the function.
 * @param inputFn The function to get the input from at each iteration (optional).
 */
export function measureComputeSpeedFormatted(
    fn: Function,
    iterations: number,
    inputFn?: Function
): void {
    const res = measureComputeSpeed(fn, iterations, inputFn);
    logger.info(`[${iterations.toLocaleString("en-US")}] Avg: ${formatTime(res.average)} | Total: ${formatTime(res.total)}`);
}

/**
 * Main benchmarking function, executing from 1 to 50,000 iterations of a given function.
 */
export function benchmark(
    fn: Function,
    inputFn?: Function
) {
    measureComputeSpeedOnceFormatted(fn, inputFn);

    for (const cycle of BENCHMARK_CONFIG.cycles) {
        measureComputeSpeedFormatted(fn, cycle, inputFn);
    }

    console.log("");
}