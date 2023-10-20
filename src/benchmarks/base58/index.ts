// BASE58 binary-to-text encoder benchmarking.

import BASE58_ENGINE from "lib/crypto/BASE58";
import { generateRandomString, measureComputeSpeedFormatted } from "utils/benchmark";
import logger from "utils/logger";


/**
 * Main function for the benchmarking of the BASE58 binary-to-text encoder.
 * @param iterations The number of iterations to perform.
 */
export default function main(iterations: number): void {
    logger.info("BENCHMARK: BASE58 BINARY-TO-TEXT ENCODER");

    const base58Engine = new BASE58_ENGINE();
    const randomStrFn = () => generateRandomString(128);

    measureComputeSpeedFormatted(
        "STRING TO UTF-8",
        base58Engine.strToUTF8,
        iterations,
        () => randomStrFn()
    );

    measureComputeSpeedFormatted(
        "EXECUTE BASE58",
        () => base58Engine.execute,
        iterations,
        () => base58Engine.strToUTF8(randomStrFn())
    );
}