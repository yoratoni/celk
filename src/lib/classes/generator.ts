import RIPEMD160_ENGINE from "lib/crypto/RIPEMD160";
import SECP256K1_ENGINE from "lib/crypto/SECP256K1";
import SHA256_ENGINE from "lib/crypto/SHA256";


/**
 * Main generator class which is used to generate Bitcoin addresses (mainnet).
 *
 * Based on the three algorithms implemented by myself:
 *   - RIPEMD160.ts
 *   - SECP256K1.ts
 *   - SHA256.ts
 */
export default class Generator {
    private ripemd160Engine: RIPEMD160_ENGINE;
    private secp256k1Engine: SECP256K1_ENGINE;
    private sha256Engine: SHA256_ENGINE;


    /**
     * Construct a new generator.
     */
    constructor() {
        this.ripemd160Engine = new RIPEMD160_ENGINE();
        this.secp256k1Engine = new SECP256K1_ENGINE();
        this.sha256Engine = new SHA256_ENGINE();
    }


    /**
     * Generate a Bitcoin address from a private key.
     * @param privateKey The private key to generate the address from.
     * @returns The Bitcoin address.
     * @link [Get an address from a private key](https://www.crypto-lyon.fr/how-to-get-an-address-from-a-private-key-on-bitcoin.html).
     */
    generate = (privateKey: string): string => {
        const publicKey = this.secp256k1Engine.secp256k1(privateKey);

        // SHA-256 + RIPEMD-160
        const publicKeyHash_0 = this.sha256Engine.sha256(publicKey);                // SHA-256
        const publicKeyHash_1 = this.ripemd160Engine.ripemd160(publicKeyHash_0);    // RIPEMD-160
        const publicKeyHash_2 = `00${publicKeyHash_1}`;                             // Network byte

        // Double SHA-256 checksum
        const publicKeyHash_3 = this.sha256Engine.sha256(publicKeyHash_2);          // SHA-256
        const publicKeyHash_4 = this.sha256Engine.sha256(publicKeyHash_3);          // SHA-256
        const checksum = publicKeyHash_4.substring(0, 8);                           // Checksum

        // Base58 encoding
        const publicKeyHash_5 = `${publicKeyHash_2}${checksum}`;                    // Add checksum

        return "";
    };
}