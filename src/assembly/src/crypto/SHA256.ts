import { safeAdd } from "../helpers/maths";
import { IsMemorySlot, IsMemorySlotSection } from "../helpers/memory";
import { loadUint32BE, loadUint8, storeUint32BE } from "../helpers/storage";


/**
 * An AssemblyScript implementation of the Secure Hash Algorithm, SHA-256, as defined in FIPS 180-4.
 *
 * **Note:** This implementation simulates the preprocessing of the data, as well as the padding of the blocks,
 * without having to copy any data, by reading the data directly from the memory buffer
 * and imitating the padding depending on the current offset of the data to read.
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
    /** If the engine is initialized. */
    private initialized: bool = false;

    /** Stores the memory slot to use. */
    private slot: IsMemorySlot;

    /** The block length, in bytes (a multiple of 512 bits as described in FIPS 180-4). */
    private blockLen: u64 = 0;

    /** The max offset of the data to read, in bytes. */
    private maxOffset: u64 = 0;

    /**
     * Number of Uint32s of data that can be read before reaching padding in the block,
     * or a part of the data followed by the padding.
     *
     * Example:
     * - If we have 65 bytes, it corresponds to 16.25 Uint32s, so we can read 16 Uint32s of data
     *   before reaching the padding.
     * - 1 byte of data is left, followed by the padding (starting with 0x10000000).
     * - In this case, this value is 16.
     */
    private uint32sToRead: u64 = 0;

    /**
     * Corresponds to the number of bytes of data that can be read after the complete Uint32s of data,
     * before reaching the padding.
     *
     * Example:
     * - If we have 65 bytes, it corresponds to 16.25 Uint32s, so we can read 16 Uint32s of data
     *   before reaching the padding.
     * - 1 byte of data is left, followed by the padding (starting with 0x10000000).
     * - In this case, this value is 1.
     */
    private remainingBytesToRead: u8 = 0;

    /** The index of the current chunk in the block. */
    private chunkIndex: u64 = 0;

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

    /** Store the message schedule (W[0]..W[63]). */
    private W: Uint32Array = new Uint32Array(64);

    /** Stores the hash values (H[0]..H[7]). */
    private H: Uint32Array = new Uint32Array(8);

    /** Working variables storage (a..h) */
    private WoV: Uint32Array = new Uint32Array(8);


    /**
     * Empty constructor, use the `init()` method to initialize the engine.
     */
    constructor() {
        // Empty slot
        this.slot = new IsMemorySlot(
            new IsMemorySlotSection(0, 0, 0),
            new IsMemorySlotSection(0, 0, 0)
        );
    }


    /** Perform the `Ch` (choose) operation. */
    private Ch(x: u32, y: u32, z: u32): u32 {
        return (x & y) ^ (~x & z);
    }

    /** Perform the `Maj` (majority) operation. */
    private Maj(x: u32, y: u32, z: u32): u32 {
        return (x & y) ^ (x & z) ^ (y & z);
    }

    /** Perform the `Σ(0)` operation. */
    private SIG0(x: u32): u32 {
        return rotr(x, 2) ^ rotr(x, 13) ^ rotr(x, 22);
    }

    /** Perform the `Σ(1)` operation. */
    private SIG1(x: u32): u32 {
        return rotr(x, 6) ^ rotr(x, 11) ^ rotr(x, 25);
    }

    /** Perform the `σ(0)` operation. */
    private sig0(x: u32): u32 {
        return rotr(x, 7) ^ rotr(x, 18) ^ (x >>> 3);
    }

    /** Perform the `σ(1)` operation. */
    private sig1(x: u32): u32 {
        return rotr(x, 17) ^ rotr(x, 19) ^ (x >>> 10);
    }

    /**
     * Reads an Uint32 from the memory buffer by imitating the padding of the block as described in FIPS 180-4.
     * The goal is to be able to read the data directly from the memory without having to copy any data.
     * @param offset The offset to read from (as the index of the Uint32 to read in the block).
     */
    readUint32BE(offset: u32): u32 {
        if (offset < 0 || offset > this.maxOffset) throw new Error(`Offset must be between 0 and ${this.maxOffset}, got ${offset}`);

        // In this case, we can directly read the data as a Uint32
        if (offset < this.uint32sToRead) return loadUint32BE(<usize>this.slot.readFrom.offset, offset);

        // In this case, we have to read the data byte by byte and generate an Uint32 from it,
        // we have to start padding the data as there's no enough data to read a full Uint32
        // Example:
        // If we have 1 remaining byte (let's say 0x01), we have to read 3 bytes of padding
        // Which corresponds to "00000001 10000000 00000000 00000000"
        else if (offset == this.uint32sToRead) {
            let result: u32 = 0x80 << <u32>(24 - this.remainingBytesToRead * 8);

            for (let i: u8 = 0; i < this.remainingBytesToRead; i++) {
                result |= <u32>loadUint8(<usize>this.slot.readFrom.offset, i) << (24 - i * 8);
            }

            return result;
        }

        // In this case, we should either return 0s for the padding
        // or, in the case of the last 64-bit block, return the length of the message
        // into the last 2 Uint32s
        else {
            // Padding
            if (offset * 4 < this.blockLen - 8) return 0;

            // Length of the message (first 32 bits)
            if (offset * 4 == this.blockLen - 8) return <u32>((this.slot.readFrom.bytes * 8) >>> 32);

            // Length of the message (last 32 bits)
            return <u32>((this.slot.readFrom.bytes * 8) & 0xFFFFFFFF);
        }
    };

    /**
     * Hash a single chunk.
     */
    private hashChunk(): void {
        // Initialize the working variables (FIPS 180-4, 6.2.2, step 2)
        this.WoV.set(this.INITIAL_H);

        // Main loop doing the message schedule preparation & compression
        for (let i: i32 = 0; i < 64; i++) {
            if (i < 16) {
                // Copy the chunk into the message schedule (FIPS 180-4, 6.2.2, step 1 - "0 ≤ t ≤ 15")
                this.W[i] = this.readUint32BE(<u32>this.chunkIndex * 16 + i);
            } else {
                // Extend the first 16 words into the remaining 48 words (FIPS 180-4, 6.2.2, step 1 - "16 ≤ t ≤ 63")
                this.W[i] = this.sig1(this.W[i - 2]) + this.W[i - 7] + this.sig0(this.W[i - 15]) + this.W[i - 16];
            }

            // Compression function main loop (FIPS 180-4, 6.2.2, step 3)
            const T1 = this.WoV[7] + this.SIG1(this.WoV[4]) + this.Ch(this.WoV[4], this.WoV[5], this.WoV[6]) + this.K[i] + this.W[i];
            const T2 = this.SIG0(this.WoV[0]) + this.Maj(this.WoV[0], this.WoV[1], this.WoV[2]);

            // Update working variables
            this.WoV[7] = this.WoV[6];
            this.WoV[6] = this.WoV[5];
            this.WoV[5] = this.WoV[4];
            this.WoV[4] = this.WoV[3] + T1;
            this.WoV[3] = this.WoV[2];
            this.WoV[2] = this.WoV[1];
            this.WoV[1] = this.WoV[0];
            this.WoV[0] = T1 + T2;
        }

        // Add the compressed chunk to the current hash value (FIPS 180-4, 6.2.2, step 4)
        for (let i: u8 = 0; i < 8; i++) {
            this.H[i] = <u32>safeAdd(this.H[i], this.WoV[i]);
        }
    };

    /**
     * Initialize the SHA-256 engine.
     * @param slot The memory slot to use.
     */
    init(slot: IsMemorySlot): void {
        this.slot = slot;

        // Calculate the block length
        this.blockLen = <u64>Math.ceil((<f64>slot.readFrom.bytes * 8.0 + 1.0 + 64.0) / 512.0) * 64;

        // Calculate the max offset of the data to read
        this.maxOffset = <u64>((this.blockLen / 4) - 1);

        // Calculate the number of Uint32s of data that can be read before reaching padding in the block,
        // or a part of the data followed by the padding.
        this.uint32sToRead = <u64>Math.floor(<f64>slot.readFrom.bytes / 4.0);

        // Calculate the number of bytes of data that can be read after the complete Uint32s of data,
        // before reaching the padding.
        this.remainingBytesToRead = <u8>(slot.readFrom.bytes % 4);

        // Set the engine to initialized
        this.initialized = true;
    }

    /**
     * Execute the SHA-256 algorithm on the given memory slot.
     */
    execute(): void {
        if (!this.initialized) throw new Error("SHA-256 engine not initialized");

        // Initialize the hash values (FIPS 180-4, 5.3.3)
        this.H.set(this.INITIAL_H);

        // Compute each chunk
        while (this.chunkIndex * 16 < this.blockLen / 4) {
            this.hashChunk();

            // Update the chunk index
            this.chunkIndex++;
        }

        // Write the hash to the memory slot
        for (let i: u8 = 0; i < 8; i++) {
            storeUint32BE(<usize>this.slot.writeTo.offset, i, this.H[i]);
        }
    };
}

/** Stores the instance of the SHA-256 engine. */
const instance: SHA256_ENGINE = new SHA256_ENGINE();

/**
 * Initialize the SHA-256 engine.
 * @param readFromOffset The offset to read from.
 * @param readFromBytes The number of bytes to read.
 * @param writeToOffset The offset to write to (32 bytes).
 */
export function init(
    readFromOffset: u64,
    readFromBytes: u64,
    writeToOffset: u64
): void {
    const memorySlot = new IsMemorySlot(
        new IsMemorySlotSection(readFromOffset, readFromBytes, 0),
        new IsMemorySlotSection(writeToOffset, 32, 0)
    );

    instance.init(memorySlot);
}

/**
 * Execute the SHA-256 algorithm on the given memory slot.
 * @throws If the SHA-256 engine is not initialized.
 */
export function execute(): void {
    if (!instance) throw new Error("SHA-256 engine not initialized");

    instance.execute();
}