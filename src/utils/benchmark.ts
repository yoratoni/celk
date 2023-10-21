/* eslint-disable @typescript-eslint/ban-types */
import BENCHMARK_CONFIG from "configs/benchmark.config";
import FINDER_CONFIG from "configs/finder.config";
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
 * Format a number of generated stuff (addresses or private keys) per second (as xK/s).
 * @param stuffPerSecond The number of stuff generated per second.
 * @returns The formatted string.
 */
export function formatStuffPerSecond(stuffPerSecond: number): string {
    const precision = BENCHMARK_CONFIG.percentagesPrecision;
    const padding = BENCHMARK_CONFIG.stuffPerSecondPadding;

    // T = tera
    if (stuffPerSecond >= Math.pow(10, 12)) {
        return `${(Math.round(stuffPerSecond / Math.pow(10, 12))).toLocaleString(
            "en-US",
            { minimumFractionDigits: precision, maximumFractionDigits: precision }
        )} Tk/s`.padStart(padding, " ");
    }

    // G = giga
    if (stuffPerSecond >= Math.pow(10, 9)) {
        return `${(Math.round(stuffPerSecond / Math.pow(10, 9))).toLocaleString(
            "en-US",
            { minimumFractionDigits: precision, maximumFractionDigits: precision }
        )} Gk/s`.padStart(padding, " ");
    }

    // M = mega
    if (stuffPerSecond >= Math.pow(10, 6)) {
        return `${(stuffPerSecond / Math.pow(10, 6)).toLocaleString(
            "en-US",
            { minimumFractionDigits: precision, maximumFractionDigits: precision }
        )} MK/s`.padStart(padding, " ");
    }

    // K = kilo
    if (stuffPerSecond >= Math.pow(10, 3)) {
        return `${(stuffPerSecond / Math.pow(10, 3)).toLocaleString(
            "en-US",
            { minimumFractionDigits: precision, maximumFractionDigits: precision }
        )} Kk/s`.padStart(padding, " ");
    }

    return `${Math.round(stuffPerSecond).toLocaleString(
        "en-US",
        { minimumFractionDigits: precision, maximumFractionDigits: precision }
    )} k/s`.padStart(padding, " ");
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
 * Format a timestamp in the format: "xxxx:xx:xx:xx".
 * @param timestamp the timestamp to format (in ms).
 * @returns The formatted string.
 */
export function formatTimestamp(timestamp: number): string {
    let seconds = Math.floor((timestamp) / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    hours = hours - (days * 24);
    minutes = minutes - (days * 24 * 60) - (hours * 60);
    seconds = seconds - (days * 24 * 60 * 60) - (hours * 60 * 60) - (minutes * 60);

    return `${days.toString().padStart(4, "0")
    }:${hours.toString().padStart(2, "0")
    }:${minutes.toString().padStart(2, "0")
    }:${seconds.toString().padStart(2, "0")}`;
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
 * Benchmarking function specifically made for the Bitcoin address generator.
 * @param fn The function to run.
 * @param privateKeyFn The function to get the input from at each iteration.
 */
export function benchmarkGenerator(fn: Function, privateKeyFn: Function) {
    let input = privateKeyFn();

    // Statistics
    const initialTime = Date.now();

    // Access function result to prevent optimization
    let res = undefined;

    for (let i = 1n; i < Infinity; i++) {
        res = fn(input);

        if (i % BENCHMARK_CONFIG.generatorReportInterval === 0n) {
            // Formatted high range
            const formattedHighRange = BENCHMARK_CONFIG.generatorIterations.toLocaleString("en-US");

            // Pad the index with zeros to match the high range length
            const paddedIndex = i.toLocaleString("en-US").padStart(formattedHighRange.length, " ");

            // Generate the progress part of the report
            const progress = `${paddedIndex} / ${formattedHighRange}`;

            // Elapsed time
            const rawElapsedTime = Date.now() - initialTime;

            // Calculate the average addresses per second
            const aps = formatStuffPerSecond(Math.round(Number(i) / (rawElapsedTime / 1000)));

            // Log the report
            logger.info(`PRG: ${progress} | APS: ${aps} | Sample: ${res}`);

            // Change the input
            input = privateKeyFn();
        }
    }
}

/**
 * Tiny benchmarking function specifically made for the Bitcoin address generator (finder report).
 * @param fn The function to run.
 * @param privateKeyFn The function to get the input from at each iteration.
 */
export function tinyBenchmarkGenerator(fn: Function, privateKeyFn: Function) {
    let input = "0x0";

    let total = 0;
    let avg = 0;
    let addressesPerSecond = "";

    // Access function result to prevent optimization
    let res = undefined;

    for (let i = 1; i < FINDER_CONFIG.tinyBenchmarkGeneratorIterations; i++) {
        input = privateKeyFn();

        const start = performance.now();
        res = fn(input);
        const end = performance.now();

        const time = end - start;
        total += time;
        avg = total / i;
        addressesPerSecond = formatStuffPerSecond(1000 / avg);
    }

    console.log("");
    logger.info(`>> Tiny benchmarking generator (${FINDER_CONFIG.tinyBenchmarkGeneratorIterations} iterations):`);
    logger.info(`   >> Avg: ${formatTime(avg, 2, 2)}`);
    logger.info(`   >> Total: ${formatTime(total, 2, 2)}`);
    logger.info(`   >> APS: ${addressesPerSecond}`);
    logger.info(`   >> LAST_PRV: ${input}`);
    logger.info(`   >> LAST_ADR: ${res}`);
    console.log("");
}

/**
 * Benchmarking function specifically made for the Ranger (Bitcoin private key generator).
 * @param fn The function to run.
 */
export function benchmarkRanger(fn: Function) {
    // Statistics
    const initialTime = Date.now();

    // Access function result to prevent optimization
    let res = undefined;

    for (let i = 1n; i <= BENCHMARK_CONFIG.rangerIterations; i++) {
        res = fn();

        if (i % BENCHMARK_CONFIG.rangerReportInterval === 0n) {
            // Formatted high range
            const formattedHighRange = BENCHMARK_CONFIG.rangerIterations.toLocaleString("en-US");

            // Pad the index with zeros to match the high range length
            const paddedIndex = i.toLocaleString("en-US").padStart(formattedHighRange.length, " ");

            // Generate the progress part of the report
            const progress = `${paddedIndex} / ${formattedHighRange}`;

            // Elapsed time
            const rawElapsedTime = Date.now() - initialTime;

            // Calculate the average private keys per second
            const pkps = formatStuffPerSecond(Math.round(Number(i) / (rawElapsedTime / 1000)));

            // Log the report
            logger.info(`PRG: ${progress} | PKPS: ${pkps} | Sample: ${res}`);
        }
    }
}