/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable arrow-body-style */

import { memory, randomFill } from "assembly/build";
import PKG_ENGINE from "lib/crypto/generators/PKG";
import { benchmark } from "utils/benchmarks";
import logger from "utils/logger";


const mem = new Uint8Array(memory.buffer);

/**
 * **[FN 0]** Test function to benchmark.
 */
const testFn_0 = () => {
    randomFill(0, 32);

    return BigInt(`0x${Buffer.from(mem.subarray(0, 32)).toString("hex")}`) % (1000000000n - 0n) + 0n;
};


const pkg = new PKG_ENGINE("FULL_RANDOM", 0n, 1000000000n);

/**
 * **[FN 1]** Test function to benchmark.
 */
const testFn_1 = () => {
    return pkg.execute();
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
        (input: bigint) => input.toString()
    );

    console.log("");
    logger.info("Benchmarking testFn_1:");
    benchmark(
        testFn_1,
        (input: bigint) => input.toString()
    );
};


main();