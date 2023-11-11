import { safeAdd } from "../helpers/maths";
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

    /** Where to read inside the memory buffer. */
    private readOffset: u64 = 0;

    /** How many bytes to read inside the memory buffer. */
    private readBytes: u64 = 0;

    /** Where to write inside the memory buffer. */
    private writeOffset: u64 = 0;

    /** The block length, in bytes (a multiple of 512 bits). */
    private blockLength: u64 = 0;

    /** The index of the current chunk in the block. */
    private chunkIndex: u32 = 0;

    /** Number of words that can be read from the u8 input data without having to pad it. */
    private wordsToRead: u32 = 0;

    /** Number of bytes that needs to be read as a word from the u8 data, followed by padding. */
    private remainingBytesToRead: u8 = 0;

    /** An array that stores 4 bytes, used for the conversion of 4 u8 into a single u32. */
    private u8Storage: Uint8Array = new Uint8Array(4);

    /** Store the message schedule (W[0]..W[63]). */
    private W: Uint32Array = new Uint32Array(64);

    /** Stores the hash values (H[0]..H[7]). */
    private H: Uint32Array = new Uint32Array(8);

    /** Working variables storage (a..h) */
    private WoV: Uint32Array = new Uint32Array(8);



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
     * Reads a word (Uint32) from the memory buffer by imitating the padding of the block as described in FIPS 180-4.
     * The goal is to be able to read the data directly from the memory without having to copy any data.
     * @param wordIndex The index of the word to read (0 => 15/31/..).
     */
    private readUint32BE(wordIndex: u32): u32 {
        // In this case, we can directly read the data as a word
        if (wordIndex < this.wordsToRead) {
            return loadUint32BE(<usize>this.readOffset, wordIndex);
        }

        // In this case, we have to read the data byte by byte and generate a word from it,
        // we have to start padding the data as there's no enough data to read a full word
        if (wordIndex == this.wordsToRead) {
            // Add remaining bytes to the storage
            for (let i: u8 = 0; i < this.remainingBytesToRead; i++) {
                this.u8Storage[i] = loadUint8(<usize>this.readOffset, wordIndex * 4 + i);
            }

            // Add padding
            this.u8Storage[this.remainingBytesToRead] = 0x80;

            // Add 0s
            for (let i: u8 = <u8>(this.remainingBytesToRead + 1); i < 4; i++) {
                this.u8Storage[i] = 0x00;
            }

            // Convert the storage into a word
            return (<u32>this.u8Storage[0] << 24) | (<u32>this.u8Storage[1] << 16) | (<u32>this.u8Storage[2] << 8) | (<u32>this.u8Storage[3]);
        }

        // In this case, we return padding (0s) until we reach the length of the message
        if (wordIndex * 4 < this.blockLength - 8) return 0;

        // Length of the message (first 32 bits)
        if (wordIndex * 4 == this.blockLength - 8) return <u32>(this.readBytes * 8 >>> 32);

        // Length of the message (last 32 bits)
        return <u32>(this.readBytes * 8 & 0xFFFFFFFF);
    };

    /**
     * Hash a single chunk.
     */
    private hashChunk(): void {
        // Initialize the working variables (FIPS 180-4, 6.2.2, step 2)
        this.WoV.set(this.H);

        // Main loop (FIPS 180-4, 6.2.2, step 1 & 3)
        for (let i = 0; i < 64; i++) {
            if (i < 16) {
                // Copy the chunk into the message schedule (FIPS 180-4, 6.2.2, step 1 - "0 ≤ t ≤ 15")
                this.W[i] = this.readUint32BE(this.chunkIndex * 16 + i);
            } else {
                // Extend the first 16 words into the remaining 48 words (FIPS 180-4, 6.2.2, step 1 - "16 ≤ t ≤ 63")
                this.W[i] = this.sig1(this.W[i - 2]) + this.W[i - 7] + this.sig0(this.W[i - 15]) + this.W[i - 16];
            }

            // Compression function main loop (FIPS 180-4, 6.2.2, step 3)
            const T1 = this.WoV[7] + this.SIG1(this.WoV[4]) + this.Ch(this.WoV[4], this.WoV[5], this.WoV[6]) + this.K[i] + this.W[i];
            const T2 = this.SIG0(this.WoV[0]) + this.Maj(this.WoV[0], this.WoV[1], this.WoV[2]);
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
     * Sets the initial values for a single execution of the SHA-256 algorithm.
     */
    private setInitialValues(): void {
        // Calculate the block length
        this.blockLength = <u64>Math.ceil((<f64>this.readBytes * 8.0 + 1.0 + 64.0) / 512.0) * 64;

        // Set the chunk index to 0
        this.chunkIndex = 0;

        // Calculate the number of words that can be read from the u8 input data without having to pad it.
        this.wordsToRead = <u32>Math.floor(<f64>this.readBytes / 4.0);

        // Calculate the number of bytes that needs to be read as a word from the u8 data, followed by padding.
        this.remainingBytesToRead = <u8>(this.readBytes % 4);

        // Initialize the hash values (FIPS 180-4, 5.3.3)
        this.H.set(this.INITIAL_H);
    }

    /**
     * Execute the SHA-256 algorithm on the WebAssembly memory buffer.
     * @param readOffset Where to read inside the buffer.
     * @param readBytes How many bytes to read inside the buffer.
     * @param writeOffset Where to write inside the buffer (32 bytes).
     */
    execute(readOffset: u64, readBytes: u64, writeOffset: u64): void {
        this.readOffset = readOffset;
        this.readBytes = readBytes;
        this.writeOffset = writeOffset;

        // Set the initial values
        this.setInitialValues();

        // Compute each chunk
        while (this.chunkIndex * 16 < this.blockLength / 4) {
            this.hashChunk();
            this.chunkIndex++;
        }

        // Write the hash to the memory buffer
        for (let i: u8 = 0; i < 8; i++) {
            storeUint32BE(<usize>this.writeOffset, i, this.H[i]);
        }
    };
}

/** Stores the instance of the SHA-256 engine. */
let instance: SHA256_ENGINE = new SHA256_ENGINE();

/**
 * Execute the SHA-256 algorithm.
 * @param readOffset Where to read inside the memory buffer.
 * @param readBytes How many bytes to read inside the memory buffer.
 * @param writeOffset Where to write inside the memory buffer.
 * @param debugMode The debug mode (optional, defaults to `false`).
 */
export function execute(readOffset: u64, readBytes: u64, writeOffset: u64): void {
    if (!instance) {
        console.warn("SHA256_ENGINE instance not found, creating a new one.");
        instance = new SHA256_ENGINE();
    }

    instance.execute(readOffset, readBytes, writeOffset);
}