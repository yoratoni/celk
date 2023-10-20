// SHA-256 algorithm benchmarking.

import SHA256_ENGINE from "lib/crypto/SHA256";
import { generateRandomString, measureComputeSpeedFormatted } from "utils/benchmark";
import logger from "utils/logger";


/**
 * Main function for the benchmarking of the SHA-256 algorithm.
 * @param iterations The number of iterations to perform.
 */
export default function main(iterations: number): void {
    logger.info("BENCHMARK: SHA-256 ALGORITHM");

    const sha256Engine = new SHA256_ENGINE();
    const randomStrFn = () => generateRandomString(128);
    const randomUTF8Fn = () => sha256Engine.strToUTF8(randomStrFn());
    const randomBigEndianWordsFn = () => sha256Engine.UTF8ToBigEndianWords(randomUTF8Fn());

    measureComputeSpeedFormatted(
        "STRING TO UTF-8",
        sha256Engine.strToUTF8,
        iterations,
        () => randomStrFn()
    );

    measureComputeSpeedFormatted(
        "UTF-8 TO BIG-ENDIAN WORDS",
        () => sha256Engine.UTF8ToBigEndianWords,
        iterations,
        randomUTF8Fn
    );

    measureComputeSpeedFormatted(
        "BIG-ENDIAN WORDS to UTF-8",
        () => sha256Engine.bigEndianWordsToUTF8,
        iterations,
        randomBigEndianWordsFn
    );

    measureComputeSpeedFormatted(
        "UTF-8 TO HEX STRING",
        () => sha256Engine.UTF8ToHex,
        iterations,
        randomUTF8Fn
    );

    measureComputeSpeedFormatted(
        "SHA-256 MAIN FUNCTION",
        () => sha256Engine.sha256,
        iterations,
        randomStrFn
    );
}