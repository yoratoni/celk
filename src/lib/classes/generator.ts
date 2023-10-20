import BASE58_ENGINE from "lib/crypto/BASE58";
import RIPEMD160_ENGINE from "lib/crypto/RIPEMD160";
import SECP256K1_ENGINE from "lib/crypto/SECP256K1";
import SHA256_ENGINE from "lib/crypto/SHA256";


/**
 * Address generator class which is used to generate Bitcoin addresses (mainnet).
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
     * Construct a new address generator.
     */
    constructor() {
        this.base58Engine = new BASE58_ENGINE();
        this.ripemd160Engine = new RIPEMD160_ENGINE();
        this.secp256k1Engine = new SECP256K1_ENGINE();
        this.sha256Engine = new SHA256_ENGINE();
    }


    /**
     * Generate a Bitcoin address from a private key.
     * @param privateKey The private key to generate the address from.
     * @returns The Bitcoin address.
     * @link [Get an address from a private key](https://www.oreilly.com/library/view/mastering-bitcoin-2nd/9781491954379/ch04.html).
     * @link [Bitcoin address](https://en.bitcoin.it/wiki/Technical_background_of_version_1_Bitcoin_addresses).
     */
    execute = (privateKey: `0x${string}`): string => {
        // SECP256K1
        const publicKey = this.secp256k1Engine.execute(privateKey);

        // SHA-256
        const step0 = this.sha256Engine.execute(publicKey);

        // RIPEMD-160
        const step1 = this.ripemd160Engine.execute(step0);

        console.log(step1);

        // Version byte
        const step2 = `0x00${step1.substring(2)}` as `0x${string}`;

        // Double SHA-256 checksum
        const step3 = this.sha256Engine.execute(step2);
        const step4 = this.sha256Engine.execute(step3);

        // Take the first 4 bytes without the 0x prefix
        const checksum = step4.substring(2, 10);

        // Add checksum
        const step5 = `${step2}${checksum}` as `0x${string}`;

        // Base58 encoding
        const address = this.base58Engine.execute(step5);

        return address;
    };
}