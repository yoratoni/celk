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
 * Format a number on a unit per time unit basis.
 *
 * Note: the time unit can be set to null to only display the unit.
 * @param nb The number to format.
 * @param unit The unit to use (optional, defaults to "k" for keys).
 * @param timeUnit The time unit to use (optional, defaults to "s" for seconds).
 */
export const formatUnitPerTimeUnit = (nb: number, unit = "k", timeUnit: string | null = "s"): string => {
    const precision = BENCHMARK_CONFIG.percentagesPrecision;
    const padding = BENCHMARK_CONFIG.formatUnitPerTimeUnitPadding;
    const strUnit = timeUnit ? `${unit}/${timeUnit}` : unit;

    // T = tera
    if (nb >= Math.pow(10, 12)) {
        return `${(Math.round(nb / Math.pow(10, 12))).toLocaleString(
            "en-US",
            { minimumFractionDigits: precision, maximumFractionDigits: precision }
        )} T${strUnit}`.padStart(padding, " ");
    }

    // G = giga
    if (nb >= Math.pow(10, 9)) {
        return `${(Math.round(nb / Math.pow(10, 9))).toLocaleString(
            "en-US",
            { minimumFractionDigits: precision, maximumFractionDigits: precision }
        )} G${strUnit}`.padStart(padding, " ");
    }

    // M = mega
    if (nb >= Math.pow(10, 6)) {
        return `${(nb / Math.pow(10, 6)).toLocaleString(
            "en-US",
            { minimumFractionDigits: precision, maximumFractionDigits: precision }
        )} M${strUnit}`.padStart(padding, " ");
    }

    // K = kilo
    if (nb >= Math.pow(10, 3)) {
        return `${(nb / Math.pow(10, 3)).toLocaleString(
            "en-US",
            { minimumFractionDigits: precision, maximumFractionDigits: precision }
        )} K${strUnit}`.padStart(padding, " ");
    }

    return `${Math.round(nb).toLocaleString(
        "en-US",
        { minimumFractionDigits: precision, maximumFractionDigits: precision }
    )} ${strUnit}`.padStart(padding, " ");
};

/**
 * Format a time in ms, into a responsive string with the en-US locale format.
 * @param time The time in ms.
 * @param decimalsForSeconds The number of decimals to use for seconds (optional, defaults to 2).
 * @param decimalsForMilliseconds The number of decimals to use for milliseconds (optional, defaults to 3).
 * @param decimalsForMicroseconds The number of decimals to use for microseconds (optional, defaults to 3).
 * @returns The formatted string.
 */
export const formatTime = (
    time: number,
    decimalsForSeconds = 2,
    decimalsForMilliseconds = 3,
    decimalsForMicroseconds = 0
): string => {
    const padding = BENCHMARK_CONFIG.formatTimePadding;

    // Seconds
    if (time >= 1000) {
        return `${(time / 1000).toLocaleString("en-US", {
            minimumFractionDigits: decimalsForSeconds,
            maximumFractionDigits: decimalsForSeconds
        })}s`.padStart(padding, " ");
    }

    // Milliseconds
    if (time >= 1) {
        return `${time.toLocaleString("en-US", {
            minimumFractionDigits: decimalsForMilliseconds,
            maximumFractionDigits: decimalsForMilliseconds
        })}ms`.padStart(padding, " ");
    }

    // Microseconds
    return `${(time * 1000).toLocaleString("en-US", {
        minimumFractionDigits: decimalsForMicroseconds,
        maximumFractionDigits: decimalsForMicroseconds
    })}μs`.padStart(padding, " ");
};

/**
 * Format a timestamp in the format: "xxxx:xx:xx:xx".
 * @param timestamp the timestamp to format (in ms).
 * @returns The formatted string.
 */
export const formatTimestamp = (timestamp: number): string => {
    let seconds = Math.floor((timestamp) / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    hours = hours - (days * 24);
    minutes = minutes - (days * 24 * 60) - (hours * 60);
    seconds = seconds - (days * 24 * 60 * 60) - (hours * 60 * 60) - (minutes * 60);

    return `${days.toString().padStart(2, "0")
    }:${hours.toString().padStart(2, "0")
    }:${minutes.toString().padStart(2, "0")
    }:${seconds.toString().padStart(2, "0")}`;
};

/**
 * Measures the time it takes to run a function (1 iteration) in milliseconds.
 * @param fn The function to run.
 * @param inputFn The function to get the input from.
 * @returns The time it took to run the function in milliseconds.
 */
export const measureComputeSpeedOnce = (fn: Function, inputFn: Function): number => {
    const input = inputFn();

    // Access function result to prevent optimization
    let res = undefined;

    const start = performance.now();
    res = fn(input);
    const end = performance.now();

    // Prevent unused variable warning
    if (res === "EMPTY_FIELD") return 0;

    return end - start;
};

/**
 * Measures the time it takes to run a function (multiple iterations) in milliseconds.
 * @param fn The function to run.
 * @param iterations The number of iterations to run the function.
 * @param inputFn The function to get the input from at each iteration (optional).
 * @returns The time it took to run the function in milliseconds (average).
 */
export const measureComputeSpeed = (
    fn: Function,
    iterations: number,
    inputFn: Function
): isComputeSpeedRes => {
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
};

/**
 * Formatted output of the time it took to run a function (1 iteration).
 * @param fn The function to run.
 * @param inputFn The function to get the input from.
 * @param padding The padding to use for the iteration number (optional, defaults to 12).
 */
export const measureComputeSpeedOnceFormatted = (fn: Function, inputFn: Function, padding = 12): void => {
    const res = measureComputeSpeedOnce(fn, inputFn);
    const iteration = "1".padStart(padding, " ");

    logger.info(`[${iteration}] Avg: ${formatTime(res)} | Total: ${formatTime(res)}`);
};

/**
 * Formatted output of the time it took to run a function (multiple iterations).
 * @param fn The function to run.
 * @param iterations The number of iterations to run the function.
 * @param inputFn The function to get the input from at each iteration.
 * @param padding The padding to use for the iteration number (optional, defaults to 12).
 */
export const measureComputeSpeedFormatted = (
    fn: Function,
    iterations: number,
    inputFn: Function,
    padding = 12
): void => {
    const res = measureComputeSpeed(fn, iterations, inputFn);

    logger.info(
        `[${iterations.toLocaleString("en-US").padStart(padding, " ")}] Avg: ${formatTime(res.average)} | Total: ${formatTime(res.total)}`
    );
};

/**
 * Main benchmarking function, executing cycles of different iterations.
 * @param fn The function to run.
 * @param inputFn The function to get the input from at each iteration.
 * @param inputForCorrectness The input for the correctness test.
 * @param expectedForCorrectness The expected output for the correctness test.
 */
export const benchmark = (
    fn: Function,
    inputFn: Function,
    inputForCorrectness: unknown,
    expectedForCorrectness: unknown
): void => {
    // Correctness test
    const res = fn(inputForCorrectness);

    if (res === expectedForCorrectness) logger.info(`[OK]: ${inputForCorrectness} -> ${res}`);
    else logger.error(`[KO] ${inputForCorrectness} -> ${res} (expected: ${expectedForCorrectness})`);

    const padding = Math.max(...BENCHMARK_CONFIG.cycles.map((cycle) => cycle.toLocaleString("en-US").length));

    // 1 iteration test
    measureComputeSpeedOnceFormatted(fn, inputFn, padding);

    // Multiple iterations tests
    for (const cycle of BENCHMARK_CONFIG.cycles) {
        measureComputeSpeedFormatted(fn, cycle, inputFn, padding);
    }

    console.log("");
};

/**
 * Benchmarking function specifically made for the Bitcoin address generator.
 * @param fn The function to run.
 * @param privateKeyFn The function to get the input from at each iteration.
 */
export const benchmarkGenerator = (fn: Function, privateKeyFn: Function): void => {
    let input = privateKeyFn();

    // Statistics
    const initialTime = Date.now();

    // Access function result to prevent optimization
    let res = undefined;

    for (let i = 1n; i <= BENCHMARK_CONFIG.generatorIterations; i++) {
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
            const aps = formatUnitPerTimeUnit(Math.round(Number(i) / (rawElapsedTime / 1000)));

            // Log the report
            logger.info(`PRG: ${progress} | APS: ${aps} | Sample: ${res}`);

            // Change the input
            input = privateKeyFn();
        }
    }
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
            // Convert the bigint result to a string
            const resStr = `0x${res.toString(16).padStart(64, "0")}`;

            // Length of the private key (for report formatting)
            lengths.pk = resStr.length;

            // Formatted high range
            const formattedHighRange = BENCHMARK_CONFIG.rangerIterations.toLocaleString("en-US");

            // Pad the index with zeros to match the high range length
            const paddedIndex = i.toLocaleString("en-US").padStart(formattedHighRange.length, " ");

            // Generate the progress part of the report
            const progress = `${paddedIndex} / ${formattedHighRange}`;
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
    const avgPkpsFormatted = formatUnitPerTimeUnit(Math.round(totalPkps / nbOfPkpsMeasurements));
    const totalPkpsFormatted = formatUnitPerTimeUnit(totalPkps, "k", null);


    logger.info("=".repeat(lengths.total));
    logger.info(`AVG: ${avgPkpsFormatted.padStart(lengths.progress, " ")} | ALPK: ${totalPkpsFormatted} | Time: ${formatTimestamp(Date.now() - initialTime).padStart(lengths.pk + 2, " ")}`);
    logger.info("=".repeat(lengths.total));
};