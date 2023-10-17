/* eslint-disable @typescript-eslint/ban-types */
import logger from "utils/logger";


/**
 * Generates a random string of a given length.
 * @param length The length of the string to generate.
 * @returns The generated string.
 */
export function generateRandomString(length: number): string {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return result;
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

    if (inputFn) {
        input = inputFn();
    }

    console.log(input);

    const start = performance.now();
    fn(input);
    const end = performance.now();

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
): number {
    let total = 0;

    for (let i = 0; i < iterations; i++) {
        total += measureComputeSpeedOnce(fn, inputFn) as number;
    }

    return total / iterations;
}

/**
 * Formatted output of the time it took to run a function (1 iteration) in milliseconds.
 * @param benchmarkName The name of the benchmark.
 * @param fn The function to run.
 * @param inputFn The function to get the input from (optional).
 */
export function measureComputeSpeedOnceFormatted(
    benchmarkName: string,
    fn: Function,
    inputFn?: Function
): void {
    const res = measureComputeSpeedOnce(fn, inputFn);

    logger.info(`>> Benchmark: ${benchmarkName}`);
    logger.info(`   >> Time: ${formatTime(res)}`);
}

/**
 * Formatted output of the time it took to run a function (multiple iterations) in milliseconds.
 * @param benchmarkName The name of the benchmark.
 * @param fn The function to run.
 * @param iterations The number of iterations to run the function.
 * @param inputFn The function to get the input from at each iteration (optional).
 */
export function measureComputeSpeedFormatted(
    benchmarkName: string,
    fn: Function,
    iterations: number,
    inputFn?: Function
): void {
    const res = measureComputeSpeed(fn, iterations, inputFn);

    logger.info(`>> Benchmark: ${benchmarkName}`);
    logger.info(`   >> Iterations: ${iterations}`);
    logger.info(`   >> Average time: ${formatTime(res)}`);
}