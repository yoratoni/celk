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

    const ranger = new Ranger(0n, 2n ** 256n);

    const secp256k1Engine = new SECP256K1_ENGINE();
    const ripemd160Engine = new RIPEMD160_ENGINE();
    const sha256Engine = new SHA256_ENGINE();
    const base58Engine = new BASE58_ENGINE();




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



    console.log("");
    logger.info("SECP256K1 ALGORITHM (Compressed):");

    // Compressed public key is 33 bytes long.
    const secp256k1Buffer_C = Buffer.alloc(33);

    benchmark(() => secp256k1Engine.executeCompressed(secp256k1Buffer_C, 1n));

    if (secp256k1Buffer_C.toString("hex").toUpperCase() ===
        "0279BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798"
    ) logger.info(">> Compressed public key check passed.");
    else logger.error(">> Compressed public key check failed.");



    console.log("");
    logger.info("SECP256K1 ALGORITHM (Uncompressed):");

    // Uncompressed public key is 65 bytes long.
    const secp256k1Buffer_U = Buffer.alloc(65);

    benchmark(() => secp256k1Engine.executeUncompressed(secp256k1Buffer_U, 1n));

    if (secp256k1Buffer_U.toString("hex").toUpperCase() ===
        "0479BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8"
    ) logger.info(">> Uncompressed public key check passed.");
    else logger.error(">> Uncompressed public key check failed.");



    // console.log("");
    // logger.info("SHA-256 ALGORITHM:");

    // // Input from SECP256K1 algorithm is converted from a buffer to an Uint32Array.
    // // That will be used for the rest of the steps.
    // // Input is 33 / 65 bytes long
    // // Output is 32 bytes long
    // const sha256Buffer = Buffer.alloc(32);

    // benchmark(
    //     () => sha256Engine.execute()
    // );
};


main();