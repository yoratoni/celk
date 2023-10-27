import BENCHMARK_CONFIG from "configs/benchmark.config";
import { benchmark, benchmarkRanger } from "helpers/benchmark";
import RIPEMD160_ENGINE from "lib/crypto/algorithms/RIPEMD160";
import SECP256K1_ENGINE from "lib/crypto/algorithms/SECP256K1";
import SHA256_ENGINE from "lib/crypto/algorithms/SHA256";
import BASE58_ENGINE from "lib/crypto/encoders/BASE58";
import RANGER_ENGINE from "lib/crypto/generators/RANGER";
import logger from "utils/logger";


/**
 * Main function for the benchmarking of the encoders / algorithms.
 */
const main = () => {
    logger.info("Starting benchmarking of the encoders / algorithms.");

    // Engines
    const rangerEngine = new RANGER_ENGINE("FULL_RANDOM", 1n, 2n ** 256n - 1n);
    const secp256k1Engine = new SECP256K1_ENGINE("COMPRESSED");
    const sha256Engine = new SHA256_ENGINE();
    const ripemd160Engine = new RIPEMD160_ENGINE();
    const base58Engine = new BASE58_ENGINE();

    // Reusable variables
    let logLength = 0;

    // Test values
    const rangerIterations = `${BENCHMARK_CONFIG.rangerIterations.toLocaleString("en-US")} iterations`;
    const secp256k1_input = 452312848583266388373324160190187140051835877600158453279131187530910662655n;
    const secp256k1_compressedOutput = "03513BA6E632B03D116D8BD9B96B1E64D39BA15A3CD56E371A2852D1B1331280D3";
    const secp256k1_uncompressedOutput = "04513BA6E632B03D116D8BD9B96B1E64D39BA15A3CD56E371A2852D1B1331280D3547D6E528F9CDACE903849DF2E9D7AAF5DAE533949F6DF47327E3DD1EF6679E3";
    const sha256_output = "776FED35A3E1CF19DC0FDED97AF8BE0898B061559F994C75D7CE8129A3462E92";
    const ripemd160_output = "621BCDEADDACC0C8EF640D0B44C5C45CC0DCA1F0";
    const rawAddress = "00621BCDEADDACC0C8EF640D0B44C5C45CC0DCA1F083731B27";
    const address = "19wkXgUJjR82ZSdn9gufFNRM2f2A3aAMuQ";



    console.log("");
    logger.info(`> RANGER GENERATOR (Full random mode, ${rangerIterations}):`);
    benchmarkRanger(
        rangerEngine.execute
    );

    console.log("");
    logger.info(`> RANGER GENERATOR (Ascending mode, ${rangerIterations}):`);
    rangerEngine.setPrivateKeyGenMode("ASCENDING");
    benchmarkRanger(
        rangerEngine.execute
    );

    console.log("");
    logger.info(`> RANGER GENERATOR (Descending mode, ${rangerIterations}):`);
    rangerEngine.setPrivateKeyGenMode("DESCENDING");
    benchmarkRanger(
        rangerEngine.execute
    );



    console.log("");
    logger.info("> SECP256K1 ALGORITHM (Compressed, largest private key on 62 bytes):");

    // Compressed public key is 33 bytes long.
    const secp256k1Buffer_C = Buffer.alloc(33);

    logLength = benchmark(() => secp256k1Engine.execute(secp256k1Buffer_C, secp256k1_input));

    // Executes once for checking the output
    secp256k1Engine.execute(secp256k1Buffer_C, secp256k1_input);

    logger.info("=".repeat(logLength));

    if (secp256k1Buffer_C.toString("hex").toUpperCase() === secp256k1_compressedOutput) logger.info("Compressed public key check passed.");
    else logger.error("Compressed public key check failed.");



    console.log("");
    logger.info("> SECP256K1 ALGORITHM (Uncompressed, largest private key on 62 bytes):");
    secp256k1Engine.setPublicKeyGenMode("UNCOMPRESSED");

    // Uncompressed public key is 65 bytes long.
    const secp256k1Buffer_U = Buffer.alloc(65);

    logLength = benchmark(() => secp256k1Engine.execute(secp256k1Buffer_U, secp256k1_input));

    // Executes once for checking the output
    secp256k1Engine.execute(secp256k1Buffer_U, secp256k1_input);

    logger.info("=".repeat(logLength));

    if (secp256k1Buffer_U.toString("hex").toUpperCase() === secp256k1_uncompressedOutput) logger.info("Uncompressed public key check passed.");
    else logger.error("Uncompressed public key check failed.");



    console.log("");
    logger.info("> SHA-256 ALGORITHM:");

    // Input from SECP256K1 algorithm.
    // Input is 33 to 65 bytes long (compressed / uncompressed public key)
    // Output is 32 bytes long
    const sha256Buffer = Buffer.alloc(65);

    // Secp256k1 uncompressed output into sha256Buffer
    sha256Buffer.write(secp256k1_uncompressedOutput, "hex");

    logLength = benchmark(() => sha256Engine.execute(sha256Buffer));

    // Secp256k1 uncompressed output into sha256Buffer
    sha256Buffer.write(secp256k1_uncompressedOutput, "hex");

    // Executes once for checking the output
    sha256Engine.execute(sha256Buffer);

    logger.info("=".repeat(logLength));

    // Subarray is used to get the first 32 bytes of the output (256 bits)
    if (sha256Buffer.subarray(0, 32).toString("hex").toUpperCase() === sha256_output) logger.info("SHA-256 check passed.");
    else logger.error("SHA-256 check failed.");



    console.log("");
    logger.info("> RIPEMD-160 ALGORITHM:");

    // Input from SHA-256 algorithm.
    // Input is always 32 bytes long
    const ripemd160Buffer = Buffer.alloc(32);

    // SHA-256 output into ripemd160Buffer
    ripemd160Buffer.write(sha256_output, "hex");

    logLength = benchmark(() => ripemd160Engine.execute(ripemd160Buffer));

    // SHA-256 output into ripemd160Buffer
    ripemd160Buffer.write(sha256_output, "hex");

    // Executes once for checking the output
    ripemd160Engine.execute(ripemd160Buffer);

    logger.info("=".repeat(logLength));

    // Subarray is used to get the first 20 bytes of the output (160 bits)
    if (ripemd160Buffer.subarray(0, 20).toString("hex").toUpperCase() === ripemd160_output) logger.info("RIPEMD-160 check passed.");
    else logger.error("RIPEMD-160 check failed.");



    console.log("");
    logger.info("> BASE58 ENCODER:");

    // Input from raw address.
    // Input is always 25 bytes long
    const base58Buffer = Buffer.alloc(25);

    // Raw address into base58Buffer
    base58Buffer.write(rawAddress, "hex");

    logLength = benchmark(() => base58Engine.encode(base58Buffer, [0, 25]));

    // Encode once for checking the output
    const addr = base58Engine.encode(base58Buffer, [0, 25]);

    logger.info("=".repeat(logLength));

    if (addr === address) logger.info("BASE58 check passed.");
    else logger.error("BASE58 check failed.");
};


main();