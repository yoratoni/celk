/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable arrow-body-style */

import Cache from "helpers/cache";
import { benchmark } from "utils/benchmarks";
import logger from "utils/logger";


/**
 * Test cache.
 */
const cache = Cache.alloc(4096);

/**
 * Test Buffer.
 */
const buffer = Buffer.alloc(4096);


/**
 * **[FN 0]** Test function to benchmark.
 */
const testFn_0 = () => {
    cache.write("0xFF");
};

/**
 * **[FN 1]** Test function to benchmark.
 */
const testFn_1 = () => {
    buffer.write("0xFF");
};


/**
 * Main function for the sandbox benchmarking.
 */
const main = () => {
    logger.info("Starting sandbox benchmarking.");

    console.log("");
    logger.info("Benchmarking testFn_0:");
    benchmark(
        testFn_0
    );

    console.log("");
    logger.info("Benchmarking testFn_1:");
    benchmark(
        testFn_1
    );
};


main();