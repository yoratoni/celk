/* eslint-disable arrow-body-style */

import { benchmark } from "helpers/benchmark";


/**
 * Test buffer.
 */
const buffer = Buffer.alloc(4096);


/**
 * **[FN 0]** Test function to benchmark.
 */
const testFn_0 = (arg0: bigint) => {

};

/**
 * **[FN 1]** Test function to benchmark.
 */
const testFn_1 = (arg0: `0x${string}`) => {

};


/**
 * Main function for the sandbox benchmarking.
 */
const main = () => {
    console.log("Starting sandbox benchmarking.");

    console.log("");
    console.log("Benchmarking testFn_0().");
    benchmark(
        () => testFn_0(406406891762530007676983468101857752779095154063922479276071118116148301075720n),
        true
    );

    console.log("Benchmarking testFn_1().");
    benchmark(
        () => testFn_1("0x82895e91fe5b276b0880dc7db44989c14000c1eb"),
        true
    );
};


main();