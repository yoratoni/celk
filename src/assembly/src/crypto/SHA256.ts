import { IsMemorySlot } from "../../../constants/memory";
import { loadUint32BE } from "../helpers/storage";


/**
 * An AssemblyScript implementation of the Secure Hash Algorithm, SHA-256, as defined in FIPS 180-4.
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
class SHA256_ENGINE {
    /** 64-bit words constant. */
    private readonly K: u32[] = [
        0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5,
        0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3, 0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174,
        0xE49B69C1, 0xEFBE4786, 0x0FC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA,
        0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 0x06CA6351, 0x14292967,
        0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13, 0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85,
        0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070,
        0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3,
        0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2
    ];

    /** Initial hash values. */
    private readonly INITIAL_H: u32[] = [
        0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A,
        0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19
    ];

    /** The current number of blocks left to process. */
    private blocksToProcess: usize;

    /** The current block number. */
    private blockNumber = 0;

    /** Stores the hash values (H[0]..H[7]). */
    private H = new Uint32Array(8);

    /** Working variables storage (a..h) */
    private WoV = new Uint32Array(8);


    /**
     * Initialize the SHA-256 engine.
     * @param slot The memory slot to use.
     */
    constructor(slot: IsMemorySlot) {
        // Calculate the initial number of blocks to process
        // (+ 1 bit for the padding indicator + 64 bits for the message length)
        this.blocksToProcess = Math.ceil((slot.readFrom.bytes * 8 + 1 + 64) / 512);
    }


    /** Perform the `Ch` (choose) operation. */
    private Ch = (x: number, y: number, z: number): number => (x & y) ^ (~x & z);

    /** Perform the `Maj` (majority) operation. */
    private Maj = (x: number, y: number, z: number): number => (x & y) ^ (x & z) ^ (y & z);

    /** Perform the `Σ(0)` operation. */
    private SIG0 = (x: number): number => rotr(x, 2) ^ rotr(x, 13) ^ rotr(x, 22);

    /** Perform the `Σ(1)` operation. */
    private SIG1 = (x: number): number => rotr(x, 6) ^ rotr(x, 11) ^ rotr(x, 25);

    /** Perform the `σ(0)` operation. */
    private sig0 = (x: number): number => rotr(x, 7) ^ rotr(x, 18) ^ (x >>> 3);

    /** Perform the `σ(1)` operation. */
    private sig1 = (x: number): number => rotr(x, 17) ^ rotr(x, 19) ^ (x >>> 10);

    /**
     * Reads an unsigned 32-bit integer from the given memory slot,
     * by imitating the padding of the block without having to copy / fill anything.
     * @param slot The memory slot to read from.
     * @param blockOffset The current offset in the block (as a number of Uint32 values).
     */
    private readUint32BE = (slot: IsMemorySlot, offsetInBlock: u32): u32 => {
        // Calculate the offset in the memory slot
        const offsetInSlot = slot.readFrom.offset + offsetInBlock * 4;

        // Check if the offset is within the slot
        if (offsetInSlot < slot.readFrom.end) {
            // Read the value from the slot
            return loadUint32BE(slot.readFrom.offset, offsetInBlock);
        }
    };

    /**
     * Hash a single block.
     */
    private hashBlock = (): void => {
        // Initialize the hash values / working variables
        this.H.set(this.INITIAL_H);
        this.WoV.set(this.INITIAL_H);

    };

    /**
     * Execute the SHA-256 algorithm on the given memory slot.
     */
    execute = (): void => {


    };
}