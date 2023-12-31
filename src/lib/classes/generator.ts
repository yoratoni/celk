import { memory } from "assembly/build";
import BENCHMARKS_CONFIG from "configs/benchmarks.config";
import MEMORY_TABLE from "constants/memory";
import Cache from "helpers/cache";
import { bigIntDiv } from "helpers/maths";
import RIPEMD160_ENGINE from "lib/crypto/algorithms/RIPEMD160";
import SECP256K1_ENGINE from "lib/crypto/algorithms/SECP256K1";
import SHA256_ENGINE from "lib/crypto/algorithms/SHA256";
import BASE58_ENGINE from "lib/crypto/encoders/BASE58";
import PKG_ENGINE from "lib/crypto/generators/PKG";
import General from "types/general";
import { formatHRTime } from "utils/formats";
import logger from "utils/logger";


/**
 * Used to generate Bitcoin addresses (mainnet).
 */
export default class Generator {
    private pkg: PKG_ENGINE;
    private secp256k1Engine: SECP256K1_ENGINE;
    private sha256Engine: SHA256_ENGINE;
    private ripemd160Engine: RIPEMD160_ENGINE;
    private base58Engine: BASE58_ENGINE;

    // The generator generation mode
    private mode: General.IsGeneratorGenMode;

    /**
     * Reusable cache used as a cache for all operations (186 bytes).
     *
     * See [here](https://github.com/yoratoni/celk#about-the-cache) for more information.
     */
    private cache = Cache.fromArrayBuffer(memory.buffer, 0, 186);

    /** Number of bytes for the public key. */
    private pkB: 33 | 65;


    /**
     * Construct a new Bitcoin address generator.
     * @param privateKeyGenMode The private key generation mode (PKG).
     * @param privateKeyLowRange The low range of the private key.
     * @param privateKeyHighRange The high range of the private key.
     * @param publicKeyGenMode The public key generation mode (compressed or uncompressed).
     * @param generatorGenMode The generator generation mode (public key, RIPEMD-160 hash or Bitcoin address).
     */
    constructor(
        privateKeyGenMode: General.IsPrivateKeyGenMode,
        privateKeyLowRange: bigint,
        privateKeyHighRange: bigint,
        publicKeyGenMode: General.IsPublicKeyGenMode,
        generatorGenMode: General.IsGeneratorGenMode
    ) {
        this.pkg = new PKG_ENGINE(
            privateKeyGenMode,
            MEMORY_TABLE.PKG.writeTo.bytes,
            privateKeyLowRange,
            privateKeyHighRange
        );

        this.secp256k1Engine = new SECP256K1_ENGINE(publicKeyGenMode);
        this.sha256Engine = new SHA256_ENGINE();
        this.ripemd160Engine = new RIPEMD160_ENGINE();
        this.base58Engine = new BASE58_ENGINE();

        // The generator generation mode
        this.mode = generatorGenMode;

        // Initialize the public key bytes (33 for compressed, 65 for uncompressed)
        this.pkB = (publicKeyGenMode === "COMPRESSED") ? 33 : 65;
    }


    /**
     * Change the Generator generation mode.
     * @param generatorGenMode The new Generator generation mode.
     */
    setGeneratorGenMode = (generatorGenMode: General.IsGeneratorGenMode): void => {
        this.mode = generatorGenMode;
    };

    /**
     * Bitcoin address debugging generation process with a complete report.
     * @returns The Bitcoin address.
     */
    executeReport = (): void => {
        const VALUES: { [key: string]: string; } = {};
        const TIMES: { [key: string]: bigint; } = {};

        // Run the ghost execution n times to to warm up the engine
        for (let i = 0; i <= BENCHMARKS_CONFIG.generatorGhostExecutionIterations; i++) {
            // PKG
            const pkgStart = process.hrtime.bigint();
            this.pkg.execute(this.cache, MEMORY_TABLE.PKG);
            TIMES.pkg = process.hrtime.bigint() - pkgStart;
            VALUES.pkg = this.cache.subarray(
                MEMORY_TABLE.PKG.writeTo.offset,
                MEMORY_TABLE.PKG.writeTo.end
            ).toString("hex");

            // SECP256K1
            const pblStart = process.hrtime.bigint();
            this.secp256k1Engine.execute(this.cache, MEMORY_TABLE.PBL);
            TIMES.pbl = process.hrtime.bigint() - pblStart;
            VALUES.pbl = this.cache.subarray(
                MEMORY_TABLE.PBL.writeTo.offset,
                MEMORY_TABLE.PBL.writeTo.offset + this.pkB
            ).toString("hex");

            // Stops here if we only want the public key
            if (this.mode === "PUBLIC_KEY") continue;

            // Replace the "bytes" value of the SHA memory slot by the public key size
            MEMORY_TABLE.SHA.readFrom.bytes = this.pkB;

            // SHA-256 (executed only on PkB size but space still reserved for uncompressed public key)
            const shaStart = process.hrtime.bigint();
            this.sha256Engine.execute(this.cache, MEMORY_TABLE.SHA);
            TIMES.sha = process.hrtime.bigint() - shaStart;
            VALUES.sha = this.cache.subarray(
                MEMORY_TABLE.SHA.writeTo.offset,
                MEMORY_TABLE.SHA.writeTo.end
            ).toString("hex");

            // RIPEMD-160
            const ripStart = process.hrtime.bigint();
            this.ripemd160Engine.execute(this.cache, MEMORY_TABLE.RIP);
            TIMES.rip = process.hrtime.bigint() - ripStart;
            VALUES.rip = this.cache.subarray(
                MEMORY_TABLE.RIP.writeTo.offset,
                MEMORY_TABLE.RIP.writeTo.end
            ).toString("hex");

            // Stops here if we only want the RIPEMD-160 hash
            if (this.mode === "RIPEMD-160") continue;

            // Double SHA-256 checksum (step 1)
            const sc1Start = process.hrtime.bigint();
            this.sha256Engine.execute(this.cache, MEMORY_TABLE.SC1);
            TIMES.sc1 = process.hrtime.bigint() - sc1Start;
            VALUES.sc1 = this.cache.subarray(
                MEMORY_TABLE.SC1.writeTo.offset,
                MEMORY_TABLE.SC1.writeTo.end
            ).toString("hex");

            // Double SHA-256 checksum (step 2 -> overwrites step 1)
            const sc2Start = process.hrtime.bigint();
            this.sha256Engine.execute(this.cache, MEMORY_TABLE.SC2);
            TIMES.sc2 = process.hrtime.bigint() - sc2Start;
            VALUES.sc2 = this.cache.subarray(
                MEMORY_TABLE.SC2.writeTo.offset,
                MEMORY_TABLE.SC2.writeTo.end
            ).toString("hex");

            // Take the first 4 bytes of the double SHA-256 checksum
            const chkStart = process.hrtime.bigint();
            this.cache.writeUint32BE(
                this.cache.readUint32BE(MEMORY_TABLE.CHECKSUM.readFrom.offset),
                MEMORY_TABLE.CHECKSUM.writeTo.offset
            );
            TIMES.chk = process.hrtime.bigint() - chkStart;
            VALUES.chk = this.cache.subarray(
                MEMORY_TABLE.CHECKSUM.writeTo.offset,
                MEMORY_TABLE.CHECKSUM.writeTo.end
            ).toString("hex");

            // Base58 encoding
            const adrStart = process.hrtime.bigint();
            VALUES.adr = this.base58Engine.encode(this.cache, MEMORY_TABLE.FINAL_BTC_HASH);
            TIMES.rad = process.hrtime.bigint() - adrStart;
            VALUES.rad = this.cache.subarray(97, 122).toString("hex");
        }

        // Report variables
        const totalTime = Object.values(TIMES).reduce((a, b) => a + b);
        let maxLogLength = 0;

        // Report
        for (const [key, value] of Object.entries(TIMES)) {
            const percentage = bigIntDiv(value, totalTime, 6).result * 100;
            const paddedPercentage = percentage.toFixed(2).padStart(6, " ");

            const log = `(${key.toUpperCase()}) EXECUTION: ${formatHRTime(value)} | WORKLOAD: ${paddedPercentage}% | SAMPLE: ${`0x${VALUES[key]}`.padStart(VALUES.pbl.length + 2, " ")}`;

            if (percentage >= 50) logger.error(log);
            else if (percentage >= 8) logger.warn(log);
            else if (percentage >= 1) logger.debug(log);
            else logger.info(log);

            // Get the longest log length
            if (log.length > maxLogLength) maxLogLength = log.length;
        }

        // Conclusion
        logger.info("=".repeat(maxLogLength));
        switch (this.mode) {
            case "PUBLIC_KEY":
                logger.info(`(PBL) EXECUTION: ${formatHRTime(totalTime)} | WORKLOAD: 100.00% | RESULT: 0x${VALUES.pbl}`);
                break;
            case "RIPEMD-160":
                logger.info(`(RIP) EXECUTION: ${formatHRTime(totalTime)} | WORKLOAD: 100.00% | RESULT: ${("0x" + VALUES.rip).padStart(VALUES.pbl.length + 2, " ")}`);
                break;
            case "ADDRESS":
                logger.info(`(ADR) EXECUTION: ${formatHRTime(totalTime)} | WORKLOAD: 100.00% | RESULT: ${VALUES.adr.padStart(VALUES.pbl.length + 2, " ")}`);
                break;
        }
        console.log("");
    };

    /**
     * Generate a Bitcoin address from a private key.
     * @returns The public key (cache), RIPEMD-160 hash (cache) or Bitcoin address (string),
     * .
     */
    execute = (): {
        privateKey: bigint;
        value: Cache | string;
    } => {
        // PKG
        const currPrivateKey = this.pkg.execute(this.cache, MEMORY_TABLE.PKG);

        // SECP256K1
        this.secp256k1Engine.execute(this.cache, MEMORY_TABLE.PBL);

        // Stops here if we only want the public key
        if (this.mode === "PUBLIC_KEY") return {
            privateKey: currPrivateKey,
            value: this.cache.subarray(
                MEMORY_TABLE.PBL.readFrom.offset,
                MEMORY_TABLE.PBL.readFrom.offset + this.pkB
            )
        };

        // Replace the "bytes" value of the SHA memory slot by the public key size
        MEMORY_TABLE.SHA.readFrom.bytes = this.pkB;

        // SHA-256 (executed only on PkB size but space still reserved for uncompressed public key)
        this.sha256Engine.execute(this.cache, MEMORY_TABLE.SHA);

        // RIPEMD-160
        this.ripemd160Engine.execute(this.cache, MEMORY_TABLE.RIP);

        // Stops here if we only want the RIPEMD-160 hash
        if (this.mode === "RIPEMD-160") return {
            privateKey: currPrivateKey,
            value: this.cache.subarray(
                MEMORY_TABLE.FINAL_RIPEMD_HASH.readFrom.offset,
                MEMORY_TABLE.FINAL_RIPEMD_HASH.readFrom.offset + MEMORY_TABLE.FINAL_RIPEMD_HASH.readFrom.bytes
            )
        };

        // Double SHA-256 checksum (step 1)
        this.sha256Engine.execute(this.cache, MEMORY_TABLE.SC1);

        // Double SHA-256 checksum (step 2 -> overwrites step 1)
        this.sha256Engine.execute(this.cache, MEMORY_TABLE.SC2);

        // Take the first 4 bytes of the double SHA-256 checksum
        this.cache.writeUint32BE(
            this.cache.readUint32BE(MEMORY_TABLE.CHECKSUM.readFrom.offset),
            MEMORY_TABLE.CHECKSUM.writeTo.offset
        );

        // Base58 encoding
        return {
            privateKey: currPrivateKey,
            value: this.base58Engine.encode(this.cache, MEMORY_TABLE.FINAL_BTC_HASH)
        };
    };
}