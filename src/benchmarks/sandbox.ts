/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable arrow-body-style */

import { sha256 } from "assembly/build";
import Cache from "helpers/cache";
import SHA256_ENGINE from "lib/crypto/algorithms/SHA256";
import { benchmark } from "utils/benchmarks";
import logger from "utils/logger";


const input = new Uint8Array(64);

/**
 * **[FN 0]** Test function to benchmark.
 */
const testFn_0 = () => {
    sha256(input);
};

const engine = new SHA256_ENGINE();
const cache = Cache.alloc(64);

/**
 * **[FN 1]** Test function to benchmark.
 */
const testFn_1 = () => {
    engine.execute(cache);
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