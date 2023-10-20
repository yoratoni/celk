// RIPEMD-160 algorithm benchmarking.

import RIPEMD160_ENGINE from "lib/crypto/RIPEMD160";
import { generateRandomString, measureComputeSpeedFormatted } from "utils/benchmark";
import logger from "utils/logger";


/**
 * Main function for the benchmarking of the RIPEMD-160 algorithm.
 * @param iterations The number of iterations to perform.
 */
export default function main(iterations: number): void {
    logger.info("BENCHMARK: RIPEMD-160 ALGORITHM");

    const ripemd160Engine = new RIPEMD160_ENGINE();
    const randomStrFn = () => generateRandomString(128);
    const randomUTF8Fn = () => ripemd160Engine.strToUTF8(randomStrFn());
    const randomLittleEndianWordsFn = () => ripemd160Engine.UTF8ToLittleEndianWords(randomUTF8Fn());

    measureComputeSpeedFormatted(
        "STRING TO UTF-8",
        ripemd160Engine.strToUTF8,
        iterations,
        () => randomStrFn()
    );

    measureComputeSpeedFormatted(
        "UTF-8 TO LITTLE-ENDIAN WORDS",
        () => ripemd160Engine.UTF8ToLittleEndianWords,
        iterations,
        randomUTF8Fn
    );

    measureComputeSpeedFormatted(
        "LITTLE-ENDIAN WORDS to UTF-8",
        () => ripemd160Engine.littleEndianWordsToUTF8,
        iterations,
        randomLittleEndianWordsFn
    );

    measureComputeSpeedFormatted(
        "UTF-8 TO HEX STRING",
        () => ripemd160Engine.UTF8ToHex,
        iterations,
        randomUTF8Fn
    );

    measureComputeSpeedFormatted(
        "EXECUTE RIPEMD-160",
        () => ripemd160Engine.execute,
        iterations,
        randomStrFn
    );
}