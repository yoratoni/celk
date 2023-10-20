// RIPEMD-160 algorithm benchmarking.

import CPU_RIPEMD160_ENGINE from "lib/crypto/CPU_RIPEMD160";
import { generateRandomString, measureComputeSpeedFormatted } from "utils/benchmark";
import logger from "utils/logger";


/**
 * Main function for the benchmarking of the RIPEMD-160 algorithm.
 * @param iterations The number of iterations to perform.
 */
export default function main(iterations: number): void {
    logger.info("BENCHMARK: CPU RIPEMD-160 ALGORITHM");

    const cpuRipemd160Engine = new CPU_RIPEMD160_ENGINE();
    const randomStrFn = () => generateRandomString(128);
    const randomUTF8Fn = () => cpuRipemd160Engine.strToUTF8(randomStrFn());
    const randomLittleEndianWordsFn = () => cpuRipemd160Engine.UTF8ToLittleEndianWords(randomUTF8Fn());

    measureComputeSpeedFormatted(
        "STRING TO UTF-8",
        cpuRipemd160Engine.strToUTF8,
        iterations,
        () => randomStrFn()
    );

    measureComputeSpeedFormatted(
        "UTF-8 TO LITTLE-ENDIAN WORDS",
        () => cpuRipemd160Engine.UTF8ToLittleEndianWords,
        iterations,
        randomUTF8Fn
    );

    measureComputeSpeedFormatted(
        "LITTLE-ENDIAN WORDS to UTF-8",
        () => cpuRipemd160Engine.littleEndianWordsToUTF8,
        iterations,
        randomLittleEndianWordsFn
    );

    measureComputeSpeedFormatted(
        "UTF-8 TO HEX STRING",
        () => cpuRipemd160Engine.UTF8ToHex,
        iterations,
        randomUTF8Fn
    );

    measureComputeSpeedFormatted(
        "RIPEMD-160 MAIN FUNCTION",
        () => cpuRipemd160Engine.ripemd160,
        iterations,
        randomStrFn
    );
}