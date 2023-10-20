// SECP256K1 algorithm benchmarking.

import SECP256K1_ENGINE from "lib/crypto/SECP256K1";
import { generateRandomPrivateKey, measureComputeSpeedFormatted } from "utils/benchmark";
import logger from "utils/logger";


/**
 * Main function for the benchmarking of the SECP256K1 algorithm.
 * @param iterations The number of iterations to perform.
 */
export default function main(iterations: number): void {
    logger.info("BENCHMARK: SECP256K1 ALGORITHM");

    const secp256k1Engine = new SECP256K1_ENGINE();
    const randomPrivateKey = () => generateRandomPrivateKey();

    measureComputeSpeedFormatted(
        "SECP256K1 MAIN FUNCTION",
        secp256k1Engine.secp256k1,
        iterations,
        randomPrivateKey
    );
}