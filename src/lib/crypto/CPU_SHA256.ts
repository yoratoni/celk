/*
 * A CPU TypeScript implementation of the Secure Hash Algorithm, SHA-256, as defined in FIPS 180-2.

 * Based on the SHA256 explanation by Quadibloc.
 *   See http://www.quadibloc.com/crypto/mi060501.htm
 * And the JS implementation by Bryan Chow.
 *   See https://gist.github.com/bryanchow/1649353
 */


export default class CPU_SHA256_ENGINE {
    private _encoder: TextEncoder;

    /** 64-bit words constants. */
    private readonly K: number[] = [
        0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5,
        0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3, 0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174,
        0xE49B69C1, 0xEFBE4786, 0x0FC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA,
        0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 0x06CA6351, 0x14292967,
        0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13, 0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85,
        0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070,
        0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3,
        0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2
    ];


    /**
     * Construct a new CPU SHA-256 engine.
     */
    constructor() {
        this._encoder = new TextEncoder();
    }


    /**
     * Perform the "circular shift right" (CSR) operation, needed for the hash computation.
     * @param x The number to shift.
     * @param n The number of bits to shift.
     * @returns The shifted number.
     */
    private CSR = (x: number, n: number): number => (x >>> n) | (x << (32 - n));

    /**
     * Perform the "logical right shift" (LRS) operation, needed for the hash computation.
     * @param x The number to shift.
     * @param n The number of bits to shift.
     * @returns The shifted number.
     */
    private LRS = (x: number, n: number): number => (x >>> n);

    /**
     * Perform the "choose" operation, needed for the hash computation.
     * @param x The first number.
     * @param y The second number.
     * @param z The third number.
     * @returns The result of the "choose" operation.
     */
    private choose = (x: number, y: number, z: number): number => (x & y) ^ ((~x) & z);

    /**
     * Perform the "majority" operation, needed for the hash computation.
     * @param x The first number.
     * @param y The second number.
     * @param z The third number.
     * @returns The result of the "majority" operation.
     */
    private majority = (x: number, y: number, z: number): number => (x & y) ^ (x & z) ^ (y & z);

    /** Perform the "SIGMA 0" operation. */
    private sigma0 = (x: number): number => this.CSR(x, 2) ^ this.CSR(x, 13) ^ this.CSR(x, 22);

    /** Perform the "SIGMA 1" operation. */
    private sigma1 = (x: number): number => this.CSR(x, 6) ^ this.CSR(x, 11) ^ this.CSR(x, 25);

    /** Perform the "GAMMA 0" operation. */
    private gamma0 = (x: number): number => this.CSR(x, 7) ^ this.CSR(x, 18) ^ this.LRS(x, 3);

    /** Perform the "GAMMA 1" operation. */
    private gamma1 = (x: number): number => this.CSR(x, 17) ^ this.CSR(x, 19) ^ this.LRS(x, 10);

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
     * SHA-256 internal hash computation.
     * @param m The message to hash.
     * @param l The length of the message.
     * @returns The hash of the message.
     */
    private _sha256 = (m: number[], l: number) => {
        const HASH = [
            0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A,
            0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19
        ];

        const W = new Array(64);
        let a, b, c, d, e, f, g, h;
        let i, j, t1, t2;

        // Append padding
        m[l >> 5] |= 0x80 << (24 - l % 32);
        m[((l + 64 >> 9) << 4) + 15] = l;

        for (i = 0; i < m.length; i += 16) {
            a = HASH[0];
            b = HASH[1];
            c = HASH[2];
            d = HASH[3];
            e = HASH[4];
            f = HASH[5];
            g = HASH[6];
            h = HASH[7];

            for (j = 0; j < 64; j++) {
                if (j < 16) {
                    W[j] = m[j + i];
                } else {
                    W[j] = this.safeAdd(
                        this.safeAdd(
                            this.safeAdd(
                                this.gamma1(W[j - 2]),
                                W[j - 7]
                            ),
                            this.gamma0(W[j - 15])
                        ),
                        W[j - 16]
                    );
                }

                t1 = this.safeAdd(
                    this.safeAdd(
                        this.safeAdd(
                            this.safeAdd(
                                h,
                                this.sigma1(e)
                            ),
                            this.choose(e, f, g)
                        ),
                        this.K[j]
                    ),
                    W[j]
                );

                t2 = this.safeAdd(this.sigma0(a), this.majority(a, b, c));

                // Update working variables
                h = g;
                g = f;
                f = e;
                e = this.safeAdd(d, t1);
                d = c;
                c = b;
                b = a;
                a = this.safeAdd(t1, t2);

            }

            HASH[0] = this.safeAdd(a, HASH[0]);
            HASH[1] = this.safeAdd(b, HASH[1]);
            HASH[2] = this.safeAdd(c, HASH[2]);
            HASH[3] = this.safeAdd(d, HASH[3]);
            HASH[4] = this.safeAdd(e, HASH[4]);
            HASH[5] = this.safeAdd(f, HASH[5]);
            HASH[6] = this.safeAdd(g, HASH[6]);
            HASH[7] = this.safeAdd(h, HASH[7]);
        }

        return HASH;
    };

    /**
     * **[CPU]** Encode a string as UTF-8.
     * @param input The string to encode.
     * @returns The UTF-8 encoded string as an Uint8Array.
     */
    strToUTF8 = (input: string): Uint8Array => {
        const UTF8 = new Uint8Array(input.length);
        this._encoder.encodeInto(input, UTF8);

        return UTF8;
    };

    /**
     * **[CPU]** Converts an Uint8Array raw UTF-8 string to an array of big-endian words.
     * @param input The UTF-8 encoded string.
     * @returns The array of big-endian words.
     */
    UTF8ToBigEndianWords = (input: Uint8Array): number[] => {
        const output = new Array(input.length >> 2);

        for (let i = 0; i < input.length * 8; i += 8) {
            output[i >> 5] |= (input[i / 8] & 0xFF) << (24 - i % 32);
        }

        return output;
    };

    /**
     * **[CPU]** Converts an array of big-endian words to an UTF-8 Uint8Array.
     * @param input The array of big-endian words.
     * @returns The UTF-8 Uint8Array.
     */
    bigEndianWordsToUTF8 = (input: number[]): Uint8Array => {
        const output = new Uint8Array(input.length * 4);

        for (let i = 0; i < input.length * 32; i += 8) {
            output[i / 8] = (input[i >> 5] >>> (24 - i % 32)) & 0xFF;
        }

        return output;
    };

    /**
     * **[CPU]** Converts an UTF-8 Uint8Array to an hex string (final SHA-256 hash).
     * @param input The UTF-8 Uint8Array.
     * @returns The hex string.
     */
    UTF8ToHex = (input: Uint8Array): string => {
        const hex = new Array(input.length * 2);

        for (let i = 0; i < input.length; i++) {
            hex[i * 2] = (input[i] >>> 4).toString(16);
            hex[i * 2 + 1] = (input[i] & 0xF).toString(16);
        }

        return hex.join("").toUpperCase();
    };

    /**
     * **[CPU]** Main function for the SHA-256 hash computation.
     * @param input The string to hash.
     * @returns The hash of the string.
     */
    sha256 = (input: string): string => {
        const UTF8 = this.strToUTF8(input);
        const bigEndianWords = this.UTF8ToBigEndianWords(UTF8);

        const hash = this._sha256(bigEndianWords, UTF8.length * 8);

        const rawOutput = this.bigEndianWordsToUTF8(hash);
        return this.UTF8ToHex(rawOutput);
    };
}