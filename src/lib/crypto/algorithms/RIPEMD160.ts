import { IsMemorySlot } from "constants/memory";
import Cache from "helpers/cache";


/**
 * A TypeScript implementation of the RIPE Message Digest, RIPEMD-160, as defined in "The hash function RIPEMD-160".
 *
 * Based on the "The hash function RIPEMD-160" documents:
 *   - https://homes.esat.kuleuven.be/~bosselae/ripemd160.html
 *   - https://homes.esat.kuleuven.be/~bosselae/ripemd160/pdf/AB-9601/AB-9601.pdf
 *
 * And the TS implementation by Paul Miller:
 *   - https://github.com/paulmillr/noble-hashes/blob/main/src/ripemd160.ts
 */
export default class RIPEMD160_ENGINE {
    private readonly R1 = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
        7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8,
        3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12,
        1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2,
        4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13
    ];
    private readonly R2 = [
        5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12,
        6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2,
        15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13,
        8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14,
        12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11
    ];
    private readonly S1 = [
        11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8,
        7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12,
        11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5,
        11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12,
        9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6
    ];
    private readonly S2 = [
        8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6,
        9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11,
        9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5,
        15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8,
        8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11
    ];

    /** Reusable input array. */
    private inputArray: number[] = [];

    /**
     * Construct a new RIPEMD-160 engine.
     */
    constructor() { }


    /**
     * Perform the "circular shift left" (CSL) operation, needed for the hash computation.
     * @param x The number to shift.
     * @param n The number of bits to shift.
     * @returns The shifted number.
     */
    private CSL = (x: number, n: number): number => (x << n) | (x >>> (32 - n));

    /**
     * Specific algorithm method: "F", required for RIPEMD-160 computation.
     */
    private F = (j: number, x: number, y: number, z: number): number => {
        const res = (0 <= j && j <= 15) ? (x ^ y ^ z) :
            (16 <= j && j <= 31) ? (x & y) | (~x & z) :
                (32 <= j && j <= 47) ? (x | ~y) ^ z :
                    (48 <= j && j <= 63) ? (x & z) | (y & ~z) :
                        (64 <= j && j <= 79) ? x ^ (y | ~z) :
                            "ERROR";

        if (res === "ERROR") {
            throw new Error("[RIPEMD160] F: j is out of range");
        }

        return res;
    };

    /**
     * Specific algorithm method: "K1", required for RIPEMD-160 computation.
     */
    private K1 = (j: number): number => {
        const res = (0 <= j && j <= 15) ? 0x00000000 :
            (16 <= j && j <= 31) ? 0x5a827999 :
                (32 <= j && j <= 47) ? 0x6ed9eba1 :
                    (48 <= j && j <= 63) ? 0x8f1bbcdc :
                        (64 <= j && j <= 79) ? 0xa953fd4e :
                            "ERROR";

        if (res === "ERROR") {
            throw new Error("[RIPEMD160] K1: j is out of range");
        }

        return res;
    };

    /**
     * Specific algorithm method: "K2", required for RIPEMD-160 computation.
     */
    private K2 = (j: number): number => {
        const res = (0 <= j && j <= 15) ? 0x50a28be6 :
            (16 <= j && j <= 31) ? 0x5c4dd124 :
                (32 <= j && j <= 47) ? 0x6d703ef3 :
                    (48 <= j && j <= 63) ? 0x7a6d76e9 :
                        (64 <= j && j <= 79) ? 0x00000000 :
                            "ERROR";

        if (res === "ERROR") {
            throw new Error("[RIPEMD160] K2: j is out of range");
        }

        return res;
    };

    /**
     * Safe addition operation, needed for the hash computation.
     * @param x The first number to add.
     * @param y The second number to add.
     * @returns The sum of the two numbers.
     */
    private safeAdd = (x: number, y: number): number => {
        const lsw = (x & 0xFFFF) + (y & 0xFFFF);
        const msw = (x >> 16) + (y >> 16) + (lsw >> 16);

        return (msw << 16) | (lsw & 0xFFFF);
    };

    /**
     * RIPEMD-160 internal hash computation.
     * @param cache The cache to write to.
     * @param subarray The subarray to use as an input.
     * @param offset The offset to write to.
     */
    private ripemd160 = (cache: Cache, subarray: Cache, offset: number): void => {
        const HASH = [
            0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476,
            0xC3D2E1F0
        ];

        const l = subarray.length * 8;

        let A1, B1, C1, D1, E1;
        let A2, B2, C2, D2, E2;
        let i, j, T;

        // Append padding (Little Endian)
        this.inputArray[l >> 5] |= 0x80 << (l % 32);
        this.inputArray[(((l + 64) >>> 9) << 4) + 14] = l;

        for (i = 0; i < this.inputArray.length; i += 16) {
            A1 = A2 = HASH[0];
            B1 = B2 = HASH[1];
            C1 = C2 = HASH[2];
            D1 = D2 = HASH[3];
            E1 = E2 = HASH[4];

            for (j = 0; j < 80; j++) {
                T = this.safeAdd(A1, this.F(j, B1, C1, D1));
                T = this.safeAdd(T, this.inputArray[i + this.R1[j]]);
                T = this.safeAdd(T, this.K1(j));
                T = this.safeAdd(this.CSL(T, this.S1[j]), E1);

                A1 = E1;
                E1 = D1;
                D1 = this.CSL(C1, 10);
                C1 = B1;
                B1 = T;

                T = this.safeAdd(A2, this.F(79 - j, B2, C2, D2));
                T = this.safeAdd(T, this.inputArray[i + this.R2[j]]);
                T = this.safeAdd(T, this.K2(j));
                T = this.safeAdd(this.CSL(T, this.S2[j]), E2);

                A2 = E2;
                E2 = D2;
                D2 = this.CSL(C2, 10);
                C2 = B2;
                B2 = T;
            }

            T = this.safeAdd(HASH[1], this.safeAdd(C1, D2));
            HASH[1] = this.safeAdd(HASH[2], this.safeAdd(D1, E2));
            HASH[2] = this.safeAdd(HASH[3], this.safeAdd(E1, A2));
            HASH[3] = this.safeAdd(HASH[4], this.safeAdd(A1, B2));
            HASH[4] = this.safeAdd(HASH[0], this.safeAdd(B1, C2));
            HASH[0] = T;
        }

        // Write to cache at offset
        cache.writeLittleEndianWords(HASH, offset);
    };

    /**
     * Converts an input cache to an array of little-endian words
     * using the predefined input array as an output
     * @param cache The input cache.
     */
    private cacheToLittleEndianWords = (cache: Cache): void => {
        for (let i = 0; i < cache.length * 8; i += 8) {
            // Write the byte to the word
            this.inputArray[i >> 5] |= (cache[i / 8] & 0xFF) << (i % 32);
        }
    };

    /**
     * Execute the RIPEMD-160 algorithm.
     * @param cache The cache to use (input & output).
     * @param cache The cache to use (input & output).
     * @param slot The memory slot to write to.
     */
    execute = (cache: Cache, slot: IsMemorySlot): void => {
        // Empty the input array by keeping the reference
        this.inputArray.length = 0;

        const subarray = cache.subarray(slot.readFrom.offset, slot.readFrom.end);
        this.cacheToLittleEndianWords(subarray);
        this.ripemd160(cache, subarray, slot.writeTo.offset);
    };
}