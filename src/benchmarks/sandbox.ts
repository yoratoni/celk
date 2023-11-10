/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable arrow-body-style */
import { benchmark } from "utils/benchmarks";
import logger from "utils/logger";


/**
 * **[FN 0]** Test function to benchmark.
 */
const testFn_0 = () => {

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