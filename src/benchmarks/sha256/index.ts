// SHA256 algorithm benchmarking.

import CPU_SHA256_ENGINE from "lib/crypto/CPU_SHA256";
import { generateRandomString, measureComputeSpeedFormatted } from "utils/benchmark";
import logger from "utils/logger";


/**
 * Main function for the benchmarking of the SHA256 algorithm.
 * @param iterations The number of iterations to perform.
 */
export default function main(iterations: number): void {
    logger.info("BENCHMARK: CPU SHA256 ALGORITHM");

    const cpuSha256Engine = new CPU_SHA256_ENGINE();
    const randomStrFn = () => generateRandomString(128);
    const randomUTF8Fn = () => cpuSha256Engine.strToUTF8(randomStrFn());
    const randomBigEndianWordsFn = () => cpuSha256Engine.UTF8ToBigEndianWords(randomUTF8Fn());

    measureComputeSpeedFormatted(
        "STRING TO UTF-8",
        cpuSha256Engine.strToUTF8,
        iterations,
        () => randomStrFn()
    );

    measureComputeSpeedFormatted(
        "UTF-8 TO BIG-ENDIAN WORDS",
        () => cpuSha256Engine.UTF8ToBigEndianWords,
        iterations,
        randomUTF8Fn
    );

    measureComputeSpeedFormatted(
        "BIG-ENDIAN WORDS to UTF-8",
        () => cpuSha256Engine.bigEndianWordsToUTF8,
        iterations,
        randomBigEndianWordsFn
    );

    measureComputeSpeedFormatted(
        "UTF-8 TO HEX STRING",
        () => cpuSha256Engine.UTF8ToHex,
        iterations,
        randomUTF8Fn
    );

    measureComputeSpeedFormatted(
        "SHA256 MAIN FUNCTION",
        () => cpuSha256Engine.sha256,
        iterations,
        randomStrFn
    );
}