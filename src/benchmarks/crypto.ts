import RIPEMD160_ENGINE from "lib/algorithms/RIPEMD160";
import SECP256K1_ENGINE from "lib/algorithms/SECP256K1";
import SHA256_ENGINE from "lib/algorithms/SHA256";
import BASE58_ENGINE from "lib/encoders/BASE58";
import {
    benchmark,
    generateRandomHexString,
    generateRandomString
} from "utils/benchmark";
import logger from "utils/logger";


/**
 * Main function for the benchmarking of the encoders / algorithms.
 */
const main = () => {
    logger.info("Starting benchmarking of the encoders / algorithms.");
    console.log("");

    const base58Engine = new BASE58_ENGINE();
    const ripemd160Engine = new RIPEMD160_ENGINE();
    const secp256k1Engine = new SECP256K1_ENGINE();
    const sha256Engine = new SHA256_ENGINE();

    const randomStrFn = () => generateRandomString(128);
    const randomHexStrFn = () => generateRandomHexString(128);
    const randomPrivateKeyFn = () => generateRandomHexString(64);

    logger.info("BASE58 BINARY-TO-TEXT ENCODER:");
    benchmark(
        base58Engine.execute,
        randomStrFn,
        "0xABC",
        "3x"
    );

    logger.info("RIPEMD-160 ALGORITHM:");
    benchmark(
        ripemd160Engine.execute,
        randomHexStrFn,
        "0xABC",
        "0x82895e91fe5b276b0880dc7db44989c14000c1eb"
    );

    logger.info("SECP256K1 ALGORITHM:");
    benchmark(
        secp256k1Engine.execute,
        randomPrivateKeyFn,
        "0xABC",
        "0x023ef30130654689a64c864d6dd38760481c55fc525e2c6c7084e2d2d3d4d51be9"
    );

    logger.info("SHA-256 ALGORITHM:");
    benchmark(
        sha256Engine.execute,
        randomHexStrFn,
        "0xABC",
        "0x087d80f7f182dd44f184aa86ca34488853ebcc04f0c60d5294919a466b463831"
    );
};


main();