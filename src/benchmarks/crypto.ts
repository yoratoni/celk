import {
    benchmark,
    generateRandomHexString,
    generateRandomString
} from "helpers/benchmark";
import RIPEMD160_ENGINE from "lib/algorithms/RIPEMD160";
import SECP256K1_ENGINE from "lib/algorithms/SECP256K1";
import SHA256_ENGINE from "lib/algorithms/SHA256";
import Ranger from "lib/classes/ranger";
import BASE58_ENGINE from "lib/encoders/BASE58";
import logger from "utils/logger";


/**
 * Main function for the benchmarking of the encoders / algorithms.
 */
const main = () => {
    logger.info("Starting benchmarking of the encoders / algorithms.");
    console.log("");

    const ranger = new Ranger(0n, 2n ** 256n);

    const base58Engine = new BASE58_ENGINE();
    const ripemd160Engine = new RIPEMD160_ENGINE();
    const secp256k1Engine = new SECP256K1_ENGINE();
    const sha256Engine = new SHA256_ENGINE();

    const randomStrFn = () => generateRandomString(128);
    const randomHexStrFn = () => generateRandomHexString(128);
    const randomPrivateKeyFn = () => ranger.executeFullRandom();

    // logger.info("BASE58 BINARY-TO-TEXT ENCODER:");
    // benchmark(
    //     base58Engine.execute,
    //     randomStrFn,
    //     "0xABC",
    //     "3x"
    // );

    // logger.info("RIPEMD-160 ALGORITHM:");
    // benchmark(
    //     ripemd160Engine.execute,
    //     randomHexStrFn,
    //     "0xABC",
    //     "0x82895e91fe5b276b0880dc7db44989c14000c1eb"
    // );

    logger.info("SECP256K1 ALGORITHM (Compressed):");
    benchmark(
        secp256k1Engine.executeCompressed,
        randomPrivateKeyFn,
        256n,
        BigInt("0x038282263212c609d9ea2a6e3e172de238d8c39cabd5ac1ca10646e23fd5f51508")
    );

    // logger.info("SHA-256 ALGORITHM:");
    // benchmark(
    //     sha256Engine.execute,
    //     randomHexStrFn,
    //     "0xABC",
    //     "0x087d80f7f182dd44f184aa86ca34488853ebcc04f0c60d5294919a466b463831"
    // );
};


main();