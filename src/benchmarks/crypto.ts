import RIPEMD160_ENGINE from "lib/algorithms/RIPEMD160";
import SECP256K1_ENGINE from "lib/algorithms/SECP256K1";
import SHA256_ENGINE from "lib/algorithms/SHA256";
import BASE58_ENGINE from "lib/encoders/BASE58";
import {
    benchmark,
    generateRandomHexString,
    generateRandomPrivateKey,
    generateRandomString
} from "utils/benchmark";
import logger from "utils/logger";


/**
 * Main function for the benchmarking of the encoders / algorithms.
 */
function main() {
    logger.info("Starting benchmarking of the encoders / algorithms.");
    console.log("");

    const base58Engine = new BASE58_ENGINE();
    const ripemd160Engine = new RIPEMD160_ENGINE();
    const secp256k1Engine = new SECP256K1_ENGINE();
    const sha256Engine = new SHA256_ENGINE();

    const randomStrFn = () => generateRandomString(128);
    const randomHexStrFn = () => generateRandomHexString(128);
    const randomPrivateKeyFn = () => generateRandomPrivateKey();

    logger.info("BASE58 BINARY-TO-TEXT ENCODER:");
    benchmark(
        base58Engine.execute,
        randomStrFn
    );

    logger.info("RIPEMD-160 ALGORITHM:");
    benchmark(
        ripemd160Engine.execute,
        randomHexStrFn
    );

    logger.info("SECP256K1 ALGORITHM:");
    benchmark(
        secp256k1Engine.execute,
        randomPrivateKeyFn
    );

    logger.info("SHA-256 ALGORITHM:");
    benchmark(
        sha256Engine.execute,
        randomHexStrFn
    );
}


main();