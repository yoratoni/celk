/* eslint-disable arrow-body-style */

import { benchmark } from "helpers/benchmark";
import { hexToUint8Array, uint8ArrayToBigEndianWords } from "helpers/conversions";
import { bigIntLength } from "helpers/maths";


/**
 * **[FN 0]** Test function to benchmark.
 */
const testFn_0 = (arg0: bigint) => {
    const uint32Array = new Uint32Array(bigIntLength(arg0, 32));

    for (let i = 0; i < uint32Array.length; i++) {
        uint32Array[i] = Number(arg0 & BigInt(0xFFFFFFFF));
        arg0 >>= BigInt(32);
    }

    return uint32Array;
};

/**
 * **[FN 1]** Test function to benchmark.
 */
const testFn_1 = (arg0: `0x${string}`) => {
    const a = hexToUint8Array(arg0);
    return uint8ArrayToBigEndianWords(a);
};


/**
 * Main function for the sandbox benchmarking.
 */
const main = () => {
    console.log("Starting sandbox benchmarking.");

    const inputFn_0 = () => 406406891762530007676983468101857752779095154063922479276071118116148301075720n;
    const inputFn_1 = () => "0x82895e91fe5b276b0880dc7db44989c14000c1eb";

    console.log("");
    console.log("Benchmarking testFn_0().");
    benchmark(
        testFn_0,
        inputFn_0,
        undefined,
        undefined,
        true
    );

    console.log("");
    console.log("Benchmarking testFn_1().");
    benchmark(
        testFn_1,
        inputFn_1,
        undefined,
        undefined,
        true
    );
};


main();