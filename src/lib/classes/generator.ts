import BASE58_ENGINE from "lib/algorithms/BASE58";
import RIPEMD160_ENGINE from "lib/algorithms/RIPEMD160";
import SECP256K1_ENGINE from "lib/algorithms/SECP256K1";
import SHA256_ENGINE from "lib/algorithms/SHA256";
import logger from "utils/logger";


/**
 * Used to generate Bitcoin addresses (mainnet).
 *
 * Based on the three algorithms & 1 encoder implemented by myself:
 *   - BASE58
 *   - RIPEMD-160
 *   - SECP256K1
 *   - SHA-256
 */
export default class Generator {
    private base58Engine: BASE58_ENGINE;
    private ripemd160Engine: RIPEMD160_ENGINE;
    private secp256k1Engine: SECP256K1_ENGINE;
    private sha256Engine: SHA256_ENGINE;


    /**
     * Construct a new Bitcoin address generator.
     */
    constructor() {
        this.base58Engine = new BASE58_ENGINE();
        this.ripemd160Engine = new RIPEMD160_ENGINE();
        this.secp256k1Engine = new SECP256K1_ENGINE();
        this.sha256Engine = new SHA256_ENGINE();
    }


    /**
     * Bitcoin address debugging generation process.
     * @param privateKey The private key to generate the address from.
     * @param compressedPublicKey Whether to use the compressed public key or not (optional, defaults to true).
     * @returns The Bitcoin address.
     */
    executeDebug = (privateKey: `0x${string}`, compressedPublicKey = true): string => {
        logger.info(`PRV: ${privateKey}`);

        // SECP256K1 (compressed / uncompressed)
        const publicKey = compressedPublicKey ?
            this.secp256k1Engine.execute(privateKey) :
            this.secp256k1Engine.executeUncompressed(privateKey);

        logger.info(`PBL: ${publicKey}`);

        // SHA-256
        const step0 = this.sha256Engine.execute(publicKey);

        logger.info(`SHA: ${step0}`);

        // RIPEMD-160
        const step1 = this.ripemd160Engine.execute(step0);

        logger.info(`RIP: ${step1}`);

        // Version byte
        const step2 = `0x00${step1.substring(2)}` as `0x${string}`;

        logger.info(`VRS: ${step2}`);

        // Double SHA-256 checksum
        const step3 = this.sha256Engine.execute(step2);
        const step4 = this.sha256Engine.execute(step3);

        logger.info(`SC1: ${step3}`);
        logger.info(`SC2: ${step4}`);

        // Take the first 4 bytes without the 0x prefix
        const checksum = step4.substring(2, 10);

        logger.info(`CHK: ${checksum}`);

        // Add checksum
        const step5 = `${step2}${checksum}` as `0x${string}`;

        logger.info(`+CK: ${step5}`);

        // Base58 encoding
        const address = this.base58Engine.execute(step5);

        logger.info(`ADR: ${address}`);

        return address;
    };


    /**
     * Generate a Bitcoin address from a private key.
     * @param privateKey The private key to generate the address from.
     * @param compressedPublicKey Whether to use the compressed public key or not (optional, defaults to true).
     * @returns The Bitcoin address.
     */
    execute = (privateKey: `0x${string}`, compressedPublicKey = true): string => {
        const publicKey = compressedPublicKey ? this.secp256k1Engine.execute(privateKey) : this.secp256k1Engine.executeUncompressed(privateKey);
        const p1 = `0x00${this.ripemd160Engine.execute(this.sha256Engine.execute(publicKey)).substring(2)}` as `0x${string}`;
        const checksum = this.sha256Engine.execute(this.sha256Engine.execute(p1)).substring(2, 10);
        return this.base58Engine.execute(`${p1}${checksum}` as `0x${string}`);
    };
}