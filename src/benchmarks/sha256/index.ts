// SHA256 benchmark

import { GPU as GPUJS } from "gpu.js";

import SHA256Engine from "lib/crypto/sha256";
import { generateRandomString, measureComputeSpeedFormatted, measureComputeSpeedOnceFormatted } from "utils/benchmark";
import logger from "utils/logger";


/**
 * Main function for the benchmarking of the SHA256 algorithm.
 */
export default function main(): void {
    const gpuInstance = new GPUJS();
    const sha256Engine = new SHA256Engine(gpuInstance);

    measureComputeSpeedOnceFormatted(
        "SHA256 STRING TO UTF-8",
        sha256Engine.strToUTF8,
        () => generateRandomString(32)
    );

    // measureComputeSpeedFormatted(
    //     "SHA256 STRING TO UTF-8",
    //     sha256Engine.strToUTF8,
    //     4,
    //     () => generateRandomString(100)
    // );

    // measureComputeSpeedFormatted(
    //     "SHA256 STRING TO UTF-16",
    //     () => sha256Engine.strToUTF16,
    //     100000
    // );
}