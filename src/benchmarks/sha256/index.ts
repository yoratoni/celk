// SHA256 benchmark

import { GPU as GPUJS } from "gpu.js";

import SHA256Engine from "lib/crypto/sha256";
import { generateRandomString, measureComputeSpeedFormatted } from "utils/benchmark";
import logger from "utils/logger";


/**
 * Main function for the benchmarking of the SHA256 algorithm.
 */
export default function main(): void {
    const gpuInstance = new GPUJS();
    const sha256Engine = new SHA256Engine(gpuInstance);
    const randomStrFn = () => generateRandomString(128);

    measureComputeSpeedFormatted(
        "SHA256 STRING TO UTF-8",
        sha256Engine.strToUTF8,
        8192,
        randomStrFn
    );

    measureComputeSpeedFormatted(
        "SHA256 STRING TO UTF-16",
        () => sha256Engine.strToUTF16,
        8192,
        randomStrFn
    );

    measureComputeSpeedFormatted(
        "SHA256 STRING TO BIG-ENDIAN WORDS",
        () => sha256Engine.strToBigEndianWords,
        8192,
        randomStrFn
    );
}