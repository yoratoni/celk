import { benchmark } from "helpers/benchmark";
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

    // Engines
    const secp256k1Engine = new SECP256K1_ENGINE();
    const ripemd160Engine = new RIPEMD160_ENGINE();
    const sha256Engine = new SHA256_ENGINE();
    const base58Engine = new BASE58_ENGINE();

    // Test values
    const secp256k1_input = 1n;
    const secp256k1_compressedOutput = "0279BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798";
    const secp256k1_uncompressedOutput = "0479BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8";
    const sha256_output = "50929B74C1A04954B78B4B6035E97A5E078A5A0F28EC96D547BFEE9ACE803AC0";
    const ripemd160_output = "91B24BF9F5288532960AC687ABB035127B1D28A5";



    console.log("");
    logger.info("SECP256K1 ALGORITHM (Compressed):");

    // Compressed public key is 33 bytes long.
    const secp256k1Buffer_C = Buffer.alloc(33);

    // Executes once for checking the output
    secp256k1Engine.executeCompressed(secp256k1Buffer_C, secp256k1_input);

    if (secp256k1Buffer_C.toString("hex").toUpperCase() === secp256k1_compressedOutput) logger.info(">> Compressed public key check passed.");
    else logger.error(">> Compressed public key check failed.");

    benchmark(() => secp256k1Engine.executeCompressed(secp256k1Buffer_C, secp256k1_input));



    console.log("");
    logger.info("SECP256K1 ALGORITHM (Uncompressed):");

    // Uncompressed public key is 65 bytes long.
    const secp256k1Buffer_U = Buffer.alloc(65);

    // Executes once for checking the output
    secp256k1Engine.executeUncompressed(secp256k1Buffer_U, secp256k1_input);

    if (secp256k1Buffer_U.toString("hex").toUpperCase() === secp256k1_uncompressedOutput) logger.info(">> Uncompressed public key check passed.");
    else logger.error(">> Uncompressed public key check failed.");

    benchmark(() => secp256k1Engine.executeUncompressed(secp256k1Buffer_U, secp256k1_input));



    console.log("");
    logger.info("SHA-256 ALGORITHM:");

    // Input from SECP256K1 algorithm.
    // Input is 33 to 65 bytes long (compressed / uncompressed public key)
    // Output is 32 bytes long
    const sha256Buffer = Buffer.alloc(65);

    // Secp256k1 uncompressed output into sha256Buffer
    sha256Buffer.write(secp256k1_uncompressedOutput, "hex");

    // Executes once for checking the output
    sha256Engine.execute(sha256Buffer);

    // Subarray is used to get the first 32 bytes of the output (256 bits)
    if (sha256Buffer.subarray(0, 32).toString("hex").toUpperCase() === sha256_output) logger.info(">> SHA-256 check passed.");
    else logger.error(">> SHA-256 check failed.");

    benchmark(() => sha256Engine.execute(sha256Buffer));



    console.log("");
    logger.info("RIPEMD-160 ALGORITHM:");

    // Input from SHA-256 algorithm.
    // Input is always 32 bytes long
    const ripemd160Buffer = Buffer.alloc(32);

    // SHA-256 output into ripemd160Buffer
    ripemd160Buffer.write(sha256_output, "hex");

    // Executes once for checking the output
    ripemd160Engine.execute(ripemd160Buffer);

    // Subarray is used to get the first 20 bytes of the output (160 bits)
    if (ripemd160Buffer.subarray(0, 20).toString("hex").toUpperCase() === ripemd160_output) logger.info(">> RIPEMD-160 check passed.");
    else logger.error(">> RIPEMD-160 check failed.");

    benchmark(() => ripemd160Engine.execute(ripemd160Buffer));




    // logger.info("BASE58 BINARY-TO-TEXT ENCODER:");
    // benchmark(
    //     base58Engine.execute,
    //     randomStrFn,
    //     "0xABC",
    //     "3x"
    // );
};


main();