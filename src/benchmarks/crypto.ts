import dedent from "dedent-js";
import minimist from "minimist";
import secp256k1 from "secp256k1";

import BENCHMARKS_CONFIG from "configs/benchmarks.config";
import Cache from "helpers/cache";
import RIPEMD160_ENGINE from "lib/crypto/algorithms/RIPEMD160";
import SHA256_ENGINE from "lib/crypto/algorithms/SHA256";
import BASE58_ENGINE from "lib/crypto/encoders/BASE58";
import PKG_ENGINE from "lib/crypto/generators/PKG";
import General from "types/general";
import { benchmark } from "utils/benchmarks";
import { bigintToPrivateKey } from "utils/formats";
import logger from "utils/logger";


/**
 * Main function for the benchmarking of the encoders / algorithms.
 */
const execute = (mode: General.IsCryptoBenchmarkMode) => {
    logger.info("Starting crypto benchmarks...");
    logger.info(`>> Number of reports per benchmark: ${BENCHMARKS_CONFIG.nbReports}`);
    logger.info(`>> Report interval: ${BENCHMARKS_CONFIG.reportInterval} second(s)`);
    logger.info(`>> Benchmark mode: '${mode}'`);

    // Reusable variables
    let testPassed = true;

    // Test values
    const secp256k1_compressedOutput = "0x02B23790A42BE63E1B251AD6C94FDEF07271EC0AADA31DB6C3E8BD32043F8BE384";
    const secp256k1_uncompressedOutput = "0x04B23790A42BE63E1B251AD6C94FDEF07271EC0AADA31DB6C3E8BD32043F8BE384FC6B694919D55EDBE8D50F88AA81F94517F004F4149ECB58D10A473DEB19880E";
    const sha256_output = "0x776FED35A3E1CF19DC0FDED97AF8BE0898B061559F994C75D7CE8129A3462E92";
    const ripemd160_output = "0x621BCDEADDACC0C8EF640D0B44C5C45CC0DCA1F0";
    const rawAddress = "0x00621BCDEADDACC0C8EF640D0B44C5C45CC0DCA1F083731B27";
    const address = "19wkXgUJjR82ZSdn9gufFNRM2f2A3aAMuQ";


    if (mode === "all" || mode === "pkg") {
        const pkgEngine = new PKG_ENGINE("FULL_RANDOM", 32, 1n, 2n ** 256n - 1n);
        const pkgCache = Cache.alloc(32);

        const slot = {
            readFrom: { offset: -1, bytes: -1, end: -1 },
            writeTo: { offset: 0, bytes: 32, end: 32 }
        };

        console.log("");
        logger.info("> PRIVATE KEY GENERATOR (Full random mode):");
        benchmark(
            () => pkgEngine.execute(pkgCache, slot),
            (input: bigint) => bigintToPrivateKey(input)
        );


        console.log("");
        logger.info("> PRIVATE KEY GENERATOR (Ascending mode):");
        pkgEngine.setPrivateKeyGenMode("ASCENDING");
        benchmark(
            () => pkgEngine.execute(pkgCache, slot),
            (input: bigint) => bigintToPrivateKey(input)
        );

        console.log("");
        logger.info("> PRIVATE KEY GENERATOR (Descending mode):");
        pkgEngine.setPrivateKeyGenMode("DESCENDING");
        benchmark(
            () => pkgEngine.execute(pkgCache, slot),
            (input: bigint) => bigintToPrivateKey(input)
        );
    }


    if (mode === "all" || mode === "algorithms" || mode === "secp256k1") {
        // Input
        const pkgEngine = new PKG_ENGINE("DESCENDING", 32, 0n, 2n ** 255n);
        const pkgCache = Cache.alloc(32);

        const slot = {
            readFrom: { offset: -1, bytes: -1, end: -1 },
            writeTo: { offset: 0, bytes: 32, end: 32 }
        };

        pkgEngine.execute(pkgCache, slot);


        console.log("");
        logger.info("> SECP256K1 ALGORITHM (Compressed, highest possible private key):");
        logger.info("  > Private key: 0x" + pkgCache.toString("hex").toUpperCase());

        // Executes once for checking the output
        // eslint-disable-next-line import/no-named-as-default-member
        let res = secp256k1.publicKeyCreate(pkgCache, true);

        if ("0x" + Buffer.from(res).toString("hex").toUpperCase() === secp256k1_compressedOutput) testPassed = true;
        else testPassed = false;

        benchmark(
            // eslint-disable-next-line import/no-named-as-default-member
            () => secp256k1.publicKeyCreate(pkgCache, true),
            (input: Uint8Array) => Cache.fromArrayBuffer(input).toString("hex"),
            testPassed
        );


        console.log("");
        logger.info("> SECP256K1 ALGORITHM (Uncompressed, highest possible private key):");
        logger.info("  > Private key: 0x" + pkgCache.toString("hex").toUpperCase());

        // Executes once for checking the output
        // eslint-disable-next-line import/no-named-as-default-member
        res = secp256k1.publicKeyCreate(pkgCache, false);

        if ("0x" + Buffer.from(res).toString("hex").toUpperCase() === secp256k1_uncompressedOutput) testPassed = true;
        else testPassed = false;

        benchmark(
            // eslint-disable-next-line import/no-named-as-default-member
            () => secp256k1.publicKeyCreate(pkgCache, false),
            (input: Uint8Array) => Cache.fromArrayBuffer(input).toString("hex"),
            testPassed
        );
    }


    if (mode === "all" || mode === "algorithms" || mode === "sha256") {
        console.log("");
        logger.info("> SHA-256 ALGORITHM (65 bytes input):");
        const sha256Engine = new SHA256_ENGINE();

        // Input from SECP256K1 algorithm.
        // Input is 33 to 65 bytes long (compressed / uncompressed public key)
        // Output is 32 bytes long
        const sha256Cache = Cache.alloc(65);

        // Secp256k1 uncompressed output into sha256Cache
        sha256Cache.writeHex(secp256k1_uncompressedOutput);

        const slot = {
            readFrom: { offset: 0, bytes: 65, end: 65 },
            writeTo: { offset: 0, bytes: 32, end: 32 }
        };

        // Executes once for checking the output
        sha256Engine.execute(sha256Cache, slot);

        // Subarray is used to get the first 32 bytes of the output (256 bits)
        if (sha256Cache.subarray(0, 32).toString("hex").toUpperCase() === sha256_output) testPassed = true;
        else testPassed = false;

        // Secp256k1 uncompressed output into sha256Cache
        sha256Cache.writeHex(secp256k1_uncompressedOutput);

        benchmark(() => sha256Engine.execute(sha256Cache, slot), undefined, testPassed);
    }


    if (mode === "all" || mode === "algorithms" || mode === "ripemd160") {
        console.log("");
        logger.info("> RIPEMD-160 ALGORITHM (32 bytes input):");
        const ripemd160Engine = new RIPEMD160_ENGINE();

        // Input from SHA-256 algorithm.
        // Input is always 32 bytes long
        const ripemd160Cache = Cache.alloc(32);

        // SHA-256 output into ripemd160Cache
        ripemd160Cache.writeHex(sha256_output);

        const slot = {
            readFrom: { offset: 0, bytes: 32, end: 32 },
            writeTo: { offset: 0, bytes: 20, end: 20 }
        };

        // Executes once for checking the output
        ripemd160Engine.execute(ripemd160Cache, slot);

        // Subarray is used to get the first 20 bytes of the output (160 bits)
        if (ripemd160Cache.subarray(0, 20).toString("hex").toUpperCase() === ripemd160_output) testPassed = true;
        else testPassed = false;

        // SHA-256 output into ripemd160Cache
        ripemd160Cache.writeHex(sha256_output);

        benchmark(() => ripemd160Engine.execute(ripemd160Cache, slot), undefined, testPassed);
    }


    if (mode === "all" || mode === "encoders" || mode === "base58") {
        console.log("");
        logger.info("> BASE58 ENCODER:");
        const base58Engine = new BASE58_ENGINE();

        // Input from raw address.
        // Input is always 25 bytes long
        const base58Cache = Cache.alloc(25);

        // Raw address into base58Cache
        base58Cache.writeHex(rawAddress);

        const slot = {
            readFrom: { offset: 0, bytes: 25, end: 25 },
            writeTo: { offset: -1, bytes: -1, end: -1 }
        };

        // Encode once for checking the output
        const addr = base58Engine.encode(base58Cache, slot);

        if (addr === address) testPassed = true;
        else testPassed = false;

        benchmark(() => base58Engine.encode(base58Cache, slot), undefined, testPassed);
    }

    console.log("");
};

/**
 * Main function.
 * @param args Arguments from the command line.
 */
const main = (
    args: string[]
) => {
    const argv = minimist(args.slice(2));

    if (argv.help || argv.h) {
        console.log(dedent`
            Usage: yarn benchmark:crypto --[options]

            options:
                --mode, -m:     Benchmark mode. Possible values: "all", "pkg", "algorithms", "encoders", "secp256k1", "sha256", "ripemd160", "base58". Default: "all"
                --help, -h:     Show help.
        `.trim());
        process.exit(0);
    };

    const mode = argv.mode || argv.m || "all" as General.IsCryptoBenchmarkMode;
    execute(mode);
};

main(process.argv);