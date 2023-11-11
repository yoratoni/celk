import { AS__sha256__execute } from "assembly/build";
import { IsMemorySlot } from "constants/memory";


/**
 * A wrapper around my AssemblyScript implementation of the Secure Hash Algorithm, SHA-256, as defined in FIPS 180-4.
 *
 * Based on the FIPS 180-4 specification:
 * - https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.180-4.pdf
 *
 * Here's a good explanation of the algorithm:
 * - https://enlear.academy/blockchain-deep-dive-into-sha-256-secure-hash-algorithm-256-bit-824ac0e90b24
 *
 * And here's a tool that shows all the steps of the algorithm:
 * - https://sha256algorithm.com/
 */
export default class SHA256_ENGINE {
    /**
     * Wraps the execute function of the AssemblyScript implementation of SHA-256,
     * reading & writing directly from the WebAssembly memory buffer at the given slot.
     * @param slot The memory slot to read from and write to.
     */
    execute = (slot: IsMemorySlot): void => AS__sha256__execute(
        BigInt(slot.readFrom.offset),
        BigInt(slot.readFrom.bytes),
        BigInt(slot.writeTo.offset),
    );
}