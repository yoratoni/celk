import RIPEMD160_ENGINE from "lib/algorithms/RIPEMD160";
import SECP256K1_ENGINE from "lib/algorithms/SECP256K1";
import SHA256_ENGINE from "lib/algorithms/SHA256";
import BASE58_ENGINE from "lib/encoders/BASE58";
import { formatTime } from "utils/benchmark";
import logger from "utils/logger";


/**
 * Used to generate Bitcoin addresses (mainnet).
 *
 * Based on the three algorithms & 1 encoder implemented by myself:
 *   - RIPEMD-160
 *   - SECP256K1
 *   - SHA-256
 *   - BASE58
 */
export default class Generator {
    private ripemd160Engine: RIPEMD160_ENGINE;
    private secp256k1Engine: SECP256K1_ENGINE;
    private sha256Engine: SHA256_ENGINE;
    private base58Engine: BASE58_ENGINE;

    private secp256k1ExecuteFn: (privateKey: `0x${string}`) => `0x${string}`;


    /**
     * Construct a new Bitcoin address generator.
     * @param compressedPublicKey Whether to use the compressed public key or not (optional, defaults to true).
     */
    constructor(compressedPublicKey = true) {
        this.ripemd160Engine = new RIPEMD160_ENGINE();
        this.secp256k1Engine = new SECP256K1_ENGINE();
        this.sha256Engine = new SHA256_ENGINE();
        this.base58Engine = new BASE58_ENGINE();

        this.secp256k1ExecuteFn = compressedPublicKey ?
            this.secp256k1Engine.execute :
            this.secp256k1Engine.executeUncompressed;
    }

    /**
     * Bitcoin address debugging generation process with a complete report.
     * @param privateKey The private key to generate the address from.
     * @returns The Bitcoin address.
     */
    executeReport = (privateKey: `0x${string}`) => {
        const VALUES: { [key: string]: string } = {
            pbl: "",
            sha: "",
            rip: "",
            vrs: "",
            sc1: "",
            sc2: "",
            chk: "",
            ack: "",
            adr: ""
        };

        const TABLE = {
            pbl: 0,     // Public key generation
            sha: 0,     // SHA-256
            rip: 0,     // RIPEMD-160
            vrs: 0,     // Version byte
            sc1: 0,     // Double SHA-256 checksum
            sc2: 0,     // Double SHA-256 checksum
            chk: 0,     // Take the first 4 bytes without the 0x prefix
            ack: 0,     // Add checksum
            adr: 0      // Base58 encoding
        };

        // SECP256K1 (compressed / uncompressed)
        const pblStart = performance.now();
        VALUES.pbl = this.secp256k1ExecuteFn(privateKey);
        TABLE.pbl = performance.now() - pblStart;

        // SHA-256
        const shaStart = performance.now();
        VALUES.sha = this.sha256Engine.execute(VALUES.pbl as `0x${string}`);
        TABLE.sha = performance.now() - shaStart;

        // RIPEMD-160
        const ripStart = performance.now();
        VALUES.rip = this.ripemd160Engine.execute(VALUES.sha as `0x${string}`);
        TABLE.rip = performance.now() - ripStart;

        // Version byte
        const vrsStart = performance.now();
        VALUES.vrs = `0x00${VALUES.rip.substring(2)}` as `0x${string}`;
        TABLE.vrs = performance.now() - vrsStart;

        // Double SHA-256 checksum (step 1)
        const sc1Start = performance.now();
        VALUES.sc1 = this.sha256Engine.execute(VALUES.vrs as `0x${string}`);
        TABLE.sc1 = performance.now() - sc1Start;

        // Double SHA-256 checksum (step 2)
        const sc2Start = performance.now();
        VALUES.sc2 = this.sha256Engine.execute(VALUES.sc1 as `0x${string}`);
        TABLE.sc2 = performance.now() - sc2Start;

        // Take the first 4 bytes without the 0x prefix
        const chkStart = performance.now();
        VALUES.chk = VALUES.sc2.substring(2, 10);
        TABLE.chk = performance.now() - chkStart;

        // Add checksum
        const ackStart = performance.now();
        VALUES.ack = `${VALUES.vrs}${VALUES.chk}` as `0x${string}`;
        TABLE.ack = performance.now() - ackStart;

        // Base58 encoding
        const adrStart = performance.now();
        VALUES.adr = this.base58Engine.execute(VALUES.ack as `0x${string}`);
        TABLE.adr = performance.now() - adrStart;

        // Report variables
        const total = Object.values(TABLE).reduce((a, b) => a + b, 0);
        let maxLogLength = 0;

        // Report
        for (const [key, value] of Object.entries(TABLE)) {
            const rawPercentage = (value / total) * 100;
            const percentage = rawPercentage.toFixed(2).padStart(6, " ");

            const log = `(${key.toUpperCase()}) TIME: ${formatTime(value)} | WORKLOAD: ${percentage}% | SAMPLE: ${VALUES[key].padStart(VALUES.pbl.length, " ")}`;

            if (rawPercentage >= 50) logger.error(log);
            else if (rawPercentage >= 8) logger.warn(log);
            else if (rawPercentage >= 3) logger.debug(log);
            else logger.info(log);

            // Get the longest log length
            if (log.length > maxLogLength) maxLogLength = log.length;
        }

        // Conclusion
        logger.info("=".repeat(maxLogLength));
        logger.info(`(...) TIME: ${formatTime(total)} | WORKLOAD: 100.00% | RESULT: ${VALUES.adr.padStart(VALUES.pbl.length, " ")}`);
        logger.info("=".repeat(maxLogLength));
    };


    /**
     * Generate a Bitcoin address from a private key.
     * @param privateKey The private key to generate the address from.
     * @returns The Bitcoin address.
     */
    execute = (privateKey: `0x${string}`): string => {
        const publicKey = this.secp256k1ExecuteFn(privateKey);
        const p1 = `0x00${this.ripemd160Engine.execute(this.sha256Engine.execute(publicKey)).substring(2)}` as `0x${string}`;
        const checksum = this.sha256Engine.execute(this.sha256Engine.execute(p1)).substring(2, 10);
        return this.base58Engine.execute(`${p1}${checksum}` as `0x${string}`);
    };
}