/* eslint-disable arrow-body-style */

import { benchmark } from "helpers/benchmark";
import { hexToUint8Array, uint8ArrayToBigEndianWords } from "helpers/conversions";
import { bigIntLength } from "helpers/maths";


/**
 * Test buffer.
 */
const buffer = Buffer.alloc(4096);


/**
 * **[FN 0]** Test function to benchmark.
 */
const testFn_0 = (arg0: bigint) => {
    return new Uint32Array(buffer.buffer, 0);
};

/**
 * **[FN 1]** Test function to benchmark.
 */
const testFn_1 = (arg0: `0x${string}`) => {
    return uint8ArrayToBigEndianWords(hexToUint8Array(arg0));
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
        undefined,
        undefined,
        true
    );

    console.log("Benchmarking testFn_1().");
    benchmark(
        () => testFn_1("0x82895e91fe5b276b0880dc7db44989c14000c1eb"),
        undefined,
        undefined,
        true
    );
};


main();