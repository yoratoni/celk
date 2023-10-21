/* eslint-disable @typescript-eslint/ban-types */
import BENCHMARK_CONFIG from "configs/benchmark.config";
import logger from "utils/logger";


/**
 * The type of the result of the measureComputeSpeed function.
 */
type isComputeSpeedRes = {
    total: number;
    average: number;
    slowest: number;
    fastest: number;
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
 * Format a number of generated addresses per second (as xK/s).
 * @param addressesPerSecond The number of addresses generated per second.
 * @returns The formatted string.
 */
export function formatAddressesPerSecond(addressesPerSecond: number): string {
    if (addressesPerSecond > Math.pow(10, 12)) return `${(Math.round(addressesPerSecond / Math.pow(10, 12))).toLocaleString("en-US")}TK/s`;     // T = tera
    if (addressesPerSecond > Math.pow(10, 9)) return `${(Math.round(addressesPerSecond / Math.pow(10, 9))).toLocaleString("en-US")}GK/s`;       // G = giga
    if (addressesPerSecond > Math.pow(10, 6)) return `${(Math.round(addressesPerSecond / Math.pow(10, 6))).toLocaleString("en-US")}MK/s`;       // M = mega

    return `${Math.round(addressesPerSecond).toLocaleString("en-US")} K/s`;
}

/**
 * Format a time in ms, into a responsive string with the en-US locale format.
 * @param time The time in ms.
 * @param decimalsForSeconds The number of decimals to use for seconds (optional, defaults to 2).
 * @param decimalsForMilliseconds The number of decimals to use for milliseconds (optional, defaults to 6).
 * @returns The formatted string.
 */
export function formatTime(
    time: number,
    decimalsForSeconds = 2,
    decimalsForMilliseconds = 6
): string {
    if (time > 1000) {
        return `${(time / 1000).toLocaleString("en-US", {
            minimumFractionDigits: decimalsForSeconds,
            maximumFractionDigits: decimalsForSeconds
        })}s`;
    }

    // EN US format with 6 decimals
    return `${time.toLocaleString("en-US", {
        minimumFractionDigits: decimalsForMilliseconds,
        maximumFractionDigits: decimalsForMilliseconds
    })}ms`;
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
    let slowest = 0;
    let fastest = Infinity;

    for (let i = 0; i < iterations; i++) {
        const tmpSpd = measureComputeSpeedOnce(fn, inputFn) as number;
        total += tmpSpd;

        if (tmpSpd > slowest) slowest = tmpSpd;
        if (tmpSpd < fastest) fastest = tmpSpd;
    }

    return {
        total,
        average: total / iterations,
        slowest,
        fastest
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
    logger.info(
        `[${iterations.toLocaleString("en-US")}] Avg: ${formatTime(res.average)} | Total: ${formatTime(res.total)}`
    );
}

/**
 * Main benchmarking function, executing cycles of different iterations.
 * @param fn The function to run.
 * @param inputFn The function to get the input from at each iteration (optional).
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

/**
 * Benchmarking function specifically made for the address generator.
 * @param fn The function to run.
 * @param inputFn The function to get the input from at each iteration (optional).
 */
export function benchmarkAddressGenerator(
    fn: Function,
    privateKeyFn: Function
) {
    let input: string;

    let total = 0;
    let avg = 0;

    // Access function result to prevent optimization
    let res = undefined;

    for (let i = 1; i < Infinity; i++) {
        input = privateKeyFn();

        const start = performance.now();
        res = fn(input);
        const end = performance.now();

        const time = end - start;
        total += time;
        avg = total / i;
        const addressesPerSecond = formatAddressesPerSecond(1000 / avg);

        logger.info(
            `Avg: ${formatTime(avg, 2, 2)} | Total: ${formatTime(total, 2, 2)} | APS: ${addressesPerSecond} | Sample: ${res} | Private key: ${BigInt(input).toString(16)}`
        );
    }
}