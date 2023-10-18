// SHA256 benchmark

import { GPU as GPUJS } from "gpu.js";

import SHA256Engine from "lib/crypto/sha256";
import { generateRandomString, measureComputeSpeedFormatted } from "utils/benchmark";
import logger from "utils/logger";


/**
 * Main function for the benchmarking of the SHA256 algorithm.
 * @param iterations The number of iterations to perform.
 */
export default function main(iterations: number): void {
    const gpuInstance = new GPUJS();
    const sha256Engine = new SHA256Engine(gpuInstance);
    const randomStrFn = () => generateRandomString(128);
    const randomUTF8Fn = () => sha256Engine.strToUTF8(randomStrFn());
    const randomBigEndianWordsFn = () => sha256Engine.UTF8ToBigEndianWords(randomUTF8Fn());

    measureComputeSpeedFormatted(
        "SHA256 STRING TO UTF-8",
        sha256Engine.strToUTF8,
        iterations,
        () => randomStrFn()
    );

    measureComputeSpeedFormatted(
        "SHA256 UTF-8 (Uint8Array) TO BIG-ENDIAN WORDS",
        () => sha256Engine.UTF8ToBigEndianWords,
        iterations,
        randomUTF8Fn
    );

    measureComputeSpeedFormatted(
        "SHA256 BIG-ENDIAN WORDS to UTF-8",
        () => sha256Engine.bigEndianWordsToUTF8,
        iterations,
        randomBigEndianWordsFn
    );

    measureComputeSpeedFormatted(
        "SHA256 MAIN FUNCTION (CPU)",
        () => sha256Engine.CPU_sha256,
        iterations,
        randomStrFn
    );

    console.log("");
    logger.info("VM TESTS: SHA256 ALGORITHM (CPU)");

    // VM Test 1 ("")
    const VMTest1 = sha256Engine.CPU_sha256("");
    logger.info(">> SHA256 VM TEST 1: EMPTY STRING");
    const VMTest1Comparison = VMTest1 === "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

    if (!VMTest1Comparison) {
        logger.error(`  >> FAILED: ${VMTest1}`);
    } else {
        logger.info("   >> PASSED");
    }

    // VM Test 2 ("abc")
    const VMTest2 = sha256Engine.CPU_sha256("abc");
    logger.info(">> SHA256 VM TEST 2: \"abc\"");
    const VMTest2Comparison = VMTest2 === "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad";

    if (!VMTest2Comparison) {
        logger.error(`  >> FAILED: ${VMTest2}`);
    } else {
        logger.info("   >> PASSED");
    }
}