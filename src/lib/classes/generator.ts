import BENCHMARK_CONFIG from "configs/benchmarks.config";
import { bigIntDiv } from "helpers/maths";
import RIPEMD160_ENGINE from "lib/crypto/algorithms/RIPEMD160";
import SECP256K1_ENGINE from "lib/crypto/algorithms/SECP256K1";
import SHA256_ENGINE from "lib/crypto/algorithms/SHA256";
import BASE58_ENGINE from "lib/crypto/encoders/BASE58";
import General from "types/general";
import { formatHRTime } from "utils/formats";
import logger from "utils/logger";


/**
 * Used to generate Bitcoin addresses (mainnet).
 *
 * Based on the three algorithms & 1 encoder implemented by myself:
 *   - SECP256K1
 *   - SHA-256
 *   - RIPEMD-160
 *   - BASE58
 */
export default class Generator {
    private secp256k1Engine: SECP256K1_ENGINE;
    private sha256Engine: SHA256_ENGINE;
    private ripemd160Engine: RIPEMD160_ENGINE;
    private base58Engine: BASE58_ENGINE;

    private mode: General.IsGeneratorGenMode;

    /**
     * Reusable buffer used as a cache for all operations (186 bytes).
     *
     * Spaces are reserved as follows (end index exclusive):
     * - `000::065` -> SECP256K1 public key (33/65 bytes).
     * - `065::097` -> SHA-256 output (32 bytes).
     * - `097::098` -> 0x00 -> Network byte (1 byte).
     * - `098::118` -> RIPEMD-160 output (20 bytes).
     * - `118::122` -> Checksum (4 bytes).
     * - `122::154` -> Double SHA-256 checksum (step 1 -> 32 bytes).
     * - `122::154` -> Double SHA-256 checksum (step 2 -> 32 bytes -> overwrites step 1).
     *
     * With:
     * - `097::118` being the final RIPEMD-160 hash before double SHA-256 checksum (21 bytes).
     * - `097::122` being the final Bitcoin hash before BASE58 (25 bytes).
     */
    private cache = Buffer.alloc(154).fill(0);

    /** Number of bytes for the public key */
    private pkB: number;


    /**
     * Construct a new Bitcoin address generator.
     * @param publicKeyGenMode The public key generation mode (compressed or uncompressed).
     * @param generatorGenMode The generator generation mode (public key, RIPEMD-160 hash or Bitcoin address).
     */
    constructor(
        publicKeyGenMode: General.IsPublicKeyGenMode,
        generatorGenMode: General.IsGeneratorGenMode
    ) {
        this.secp256k1Engine = new SECP256K1_ENGINE(publicKeyGenMode);
        this.sha256Engine = new SHA256_ENGINE();
        this.ripemd160Engine = new RIPEMD160_ENGINE();
        this.base58Engine = new BASE58_ENGINE();

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
     * @param privateKey The private key to generate the address from.
     * @returns The Bitcoin address.
     */
    executeReport = (privateKey: bigint): void => {
        const VALUES: { [key: string]: string; } = {};
        const TIMES: { [key: string]: bigint; } = {};

        // Run the ghost execution n times to to warm up the engine
        for (let i = 0; i <= BENCHMARK_CONFIG.generatorGhostExecutionIterations; i++) {
            // SECP256K1
            const pblStart = process.hrtime.bigint();
            this.secp256k1Engine.execute(this.cache, privateKey);
            TIMES.pbl = process.hrtime.bigint() - pblStart;
            VALUES.pbl = this.cache.subarray(0, this.pkB).toString("hex");

            // Stops here if we only want the public key
            if (this.mode === "PUBLIC_KEY") continue;

            // SHA-256
            const shaStart = process.hrtime.bigint();
            this.sha256Engine.execute(this.cache, [0, this.pkB], 65);
            TIMES.sha = process.hrtime.bigint() - shaStart;
            VALUES.sha = this.cache.subarray(65, 97).toString("hex");

            // RIPEMD-160
            const ripStart = process.hrtime.bigint();
            this.ripemd160Engine.execute(this.cache, [65, 97], 98);
            TIMES.rip = process.hrtime.bigint() - ripStart;
            VALUES.rip = this.cache.subarray(98, 118).toString("hex");

            // Stops here if we only want the RIPEMD-160 hash
            if (this.mode === "RIPEMD-160") continue;

            // Double SHA-256 checksum (step 1)
            const sc1Start = process.hrtime.bigint();
            this.sha256Engine.execute(this.cache, [97, 118], 122);
            TIMES.sc1 = process.hrtime.bigint() - sc1Start;
            VALUES.sc1 = this.cache.subarray(122, 154).toString("hex");

            // Double SHA-256 checksum (step 2 -> overwrites step 1)
            const sc2Start = process.hrtime.bigint();
            this.sha256Engine.execute(this.cache, [122, 154], 122);
            TIMES.sc2 = process.hrtime.bigint() - sc2Start;
            VALUES.sc2 = this.cache.subarray(122, 154).toString("hex");

            // Take the first 4 bytes of the double SHA-256 checksum
            const chkStart = process.hrtime.bigint();
            this.cache.writeUInt32BE(this.cache.readUInt32BE(122), 118);
            TIMES.chk = process.hrtime.bigint() - chkStart;
            VALUES.chk = this.cache.subarray(118, 122).toString("hex");

            // Base58 encoding
            const adrStart = process.hrtime.bigint();
            VALUES.adr = this.base58Engine.encode(this.cache, [97, 122]);
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

            const log = `(${key.toUpperCase()}) TIME: ${formatHRTime(value)} | WORKLOAD: ${paddedPercentage}% | SAMPLE: ${`0x${VALUES[key]}`.padStart(VALUES.pbl.length + 2, " ")}`;

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
                logger.info(`(PBL) TIME: ${formatHRTime(totalTime)} | WORKLOAD: 100.00% | RESULT: 0x${VALUES.pbl}`);
                break;
            case "RIPEMD-160":
                logger.info(`(RIP) TIME: ${formatHRTime(totalTime)} | WORKLOAD: 100.00% | RESULT: ${("0x" + VALUES.rip).padStart(VALUES.pbl.length + 2, " ")}`);
                break;
            case "ADDRESS":
                logger.info(`(ADR) TIME: ${formatHRTime(totalTime)} | WORKLOAD: 100.00% | RESULT: ${VALUES.adr.padStart(VALUES.pbl.length + 2, " ")}`);
                break;
        }
        console.log("");
    };

    /**
     * Generate a Bitcoin address from a private key.
     * @param privateKey The private key to generate the address from.
     * @returns The public key (buffer), RIPEMD-160 hash (buffer) or Bitcoin address (string).
     */
    execute = (privateKey: bigint): Buffer | string => {
        // SECP256K1
        this.secp256k1Engine.execute(this.cache, privateKey);

        // Stops here if we only want the public key
        if (this.mode === "PUBLIC_KEY") return this.cache.subarray(0, this.pkB);

        // SHA-256
        this.sha256Engine.execute(this.cache, [0, this.pkB], 65);

        // RIPEMD-160
        this.ripemd160Engine.execute(this.cache, [65, 97], 98);

        // Stops here if we only want the RIPEMD-160 hash
        if (this.mode === "RIPEMD-160") return this.cache.subarray(98, 118);

        // Double SHA-256 checksum (step 1)
        this.sha256Engine.execute(this.cache, [97, 118], 122);

        // Double SHA-256 checksum (step 2 -> overwrites step 1)
        this.sha256Engine.execute(this.cache, [122, 154], 122);

        // Take the first 4 bytes of the double SHA-256 checksum
        this.cache.writeUInt32BE(this.cache.readUInt32BE(122), 118);

        // Base58 encoding
        return this.base58Engine.encode(this.cache, [97, 122]);
    };
}