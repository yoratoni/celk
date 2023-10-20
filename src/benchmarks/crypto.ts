import Generator from "lib/classes/generator";
import BASE58_ENGINE from "lib/crypto/BASE58";
import RIPEMD160_ENGINE from "lib/crypto/RIPEMD160";
import SECP256K1_ENGINE from "lib/crypto/SECP256K1";
import SHA256_ENGINE from "lib/crypto/SHA256";
import { benchmark, generateRandomHexString, generateRandomPrivateKey, generateRandomString } from "utils/benchmark";
import logger from "utils/logger";


/**
 * Main function for the benchmarking of the encoders / algorithms.
 */
export default function main(): void {
    const base58Engine = new BASE58_ENGINE();
    const ripemd160Engine = new RIPEMD160_ENGINE();
    const secp256k1Engine = new SECP256K1_ENGINE();
    const sha256Engine = new SHA256_ENGINE();
    const generator = new Generator();

    const randomStrFn = () => generateRandomString(128);
    const randomHexStrFn = () => generateRandomHexString(128);
    const randomPrivateKeyFn = () => generateRandomPrivateKey();

    // logger.info("BASE58 BINARY-TO-TEXT ENCODER:");
    // benchmark(
    //     base58Engine.execute,
    //     randomStrFn
    // );

    // logger.info("RIPEMD-160 ALGORITHM:");
    // benchmark(
    //     ripemd160Engine.execute,
    //     randomHexStrFn
    // );

    // logger.info("SECP256K1 ALGORITHM:");
    // benchmark(
    //     secp256k1Engine.execute,
    //     randomPrivateKeyFn
    // );

    // logger.info("SHA-256 ALGORITHM:");
    // benchmark(
    //     sha256Engine.execute,
    //     randomHexStrFn
    // );

    const privateKey = "0xEDCC6224FEE390A57C76C13A9BECC9502A6F3B1BF6F72B6ED11B83A0F0E3E9FC";

    const test = generator.execute(privateKey);
    console.log(test);


    // logger.info("BENCHMARK: ADDRESS GENERATOR");
    // benchmark(
    //     generator.execute,
    //     randomPrivateKeyFn
    // );
}