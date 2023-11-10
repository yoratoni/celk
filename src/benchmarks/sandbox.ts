/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable arrow-body-style */
import { memory, sha256__execute } from "assembly/build";
import { benchmark } from "utils/benchmarks";
import logger from "utils/logger";


const cache = new Uint8Array(memory.buffer);
cache[0] = 0x01;

console.log(" Input:", Buffer.from(cache.subarray(0, 32)).toString("hex"));

/**
 * **[FN 0]** Test function to benchmark.
 */
const testFn_0 = () => {
    sha256__execute(0n, 1n, 32n);
};

/**
 * **[FN 1]** Test function to benchmark.
 */
const testFn_1 = () => {

};

/**
 * Main function for the sandbox benchmarking.
 */
const main = () => {
    logger.info("Starting sandbox benchmarking.");

    console.log("");
    logger.info("Benchmarking testFn_0:");
    benchmark(
        testFn_0,
        () => "N/D"
    );

    console.log("");
    logger.info("Benchmarking testFn_1:");
    benchmark(
        testFn_1,
        () => "N/D"
    );
};


main();