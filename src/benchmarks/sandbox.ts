/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable arrow-body-style */
import { AS__sha256__execute, memory } from "assembly/build";
import Cache from "helpers/cache";
import { benchmark } from "utils/benchmarks";
import logger from "utils/logger";


const cache = Cache.fromArrayBuffer(memory.buffer);

const input = "0x0450863AD64A87AE8A2FE83C1AF1A8403CB53F53E486D8511DAD8A04887E5B23522CD470243453A299FA9E77237716103ABC11A1DF38855ED6F2EE187E9C582BA6";
if ((input.length - 2) % 2 !== 0) throw new Error("Invalid input length");
const inputBytesLength =  BigInt((input.length - 2) / 2);
cache.writeHex(input);


/**
 * **[FN 0]** Test function to benchmark.
 */
const testFn_0 = () => {
    AS__sha256__execute(0n, inputBytesLength, 1000n);
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