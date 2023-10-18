/*
 * A GPU accelerated TypeScript implementation of the Secure Hash Algorithm, SHA-256, as defined
 * in FIPS 180-2.
 *
 * Version 2.2 Copyright Angel Marin, Paul Johnston 2000 - 2009.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet.
 * Distributed under the BSD License.
 * See http://pajhome.org.uk/crypt/md5 for details.
 * Also http://anmar.eu.org/projects/jssha2/
 *
 * Based on the SHA256 explanation from Quadibloc.
 * See http://www.quadibloc.com/crypto/mi060501.htm
 * And the JS implementation from Bryan Chow.
 * See https://gist.github.com/bryanchow/1649353
 *
 * hex
 * - hex_sha256
 * - rstr2hex
 * - rstr_sha256
 *   - binb2rstr
 *   - binb_sha256
 *     > safeAdd
 *     > sha256_Gamma0256 / sha256_Gamma1256
 *     > sha256_Sigma0256 / sha256_Sigma1256
 *     > sha256_K
 *     > sha256_Ch
 *     > sha256_Maj
 *   - rstr2binb
 * - str2rstr_utf8
 */

import { GPU as GPUJS } from "gpu.js";


/**
 * GPU accelerated SHA-256 engine, supplying the final SHA-256 function.
 */
export default class SHA256Engine {
    private _gpuInstance: GPUJS;
    private _encoder: TextEncoder;


    /**
     * Construct a new SHA-256 engine.
     */
    constructor(gpuInstance: GPUJS) {
        this._gpuInstance = gpuInstance;
        this._encoder = new TextEncoder();
    }

    /**
     * 64-bit words constants.
     */
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
     * Initial hash values.
     */
    private readonly H: number[] = [
        0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A,
        0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19
    ];

    /**
     * **[GPU]** Perform the "circular shift right" (CSR) operation, needed for the hash computation.
     * @param x The number to shift.
     * @param n The number of bits to shift.
     * @returns The shifted number.
     */
    private CSR = (x: number, n: number): number => (x >>> n) | (x << (32 - n));

    /**
     * **[GPU]** Perform the "logical right shift" (LRS) operation, needed for the hash computation.
     * @param x The number to shift.
     * @param n The number of bits to shift.
     * @returns The shifted number.
     */
    private LRS = (x: number, n: number): number => (x >>> n);

    /**
     * **[GPU]** Perform the "choose" operation, needed for the hash computation.
     * @param x The first number.
     * @param y The second number.
     * @param z The third number.
     * @returns The result of the "choose" operation.
     */
    private choose = (x: number, y: number, z: number): number => (x & y) ^ ((~x) & z);

    /**
     * **[GPU]** Perform the "majority" operation, needed for the hash computation.
     * @param x The first number.
     * @param y The second number.
     * @param z The third number.
     * @returns The result of the "majority" operation.
     */
    private majority = (x: number, y: number, z: number): number => (x & y) ^ (x & z) ^ (y & z);


    /** **[GPU]** Perform the "SIGMA 0" operation. */
    private sigma0 = (x: number): number => this.CSR(x, 2) ^ this.CSR(x, 13) ^ this.CSR(x, 22);

    /** **[GPU]** Perform the "SIGMA 1" operation. */
    private sigma1 = (x: number): number => this.CSR(x, 6) ^ this.CSR(x, 11) ^ this.CSR(x, 25);

    /** **[GPU]** Perform the "GAMMA 0" operation. */
    private gamma0 = (x: number): number => this.CSR(x, 7) ^ this.CSR(x, 18) ^ this.LRS(x, 3);

    /** **[GPU]** Perform the "GAMMA 1" operation. */
    private gamma1 = (x: number): number => this.CSR(x, 17) ^ this.CSR(x, 19) ^ this.LRS(x, 10);


    /**
     * **[GPU]** Safe addition operation, needed for the hash computation.
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
     * Encode a string as UTF-8.
     * @param str The string to encode.
     * @returns The UTF-8 encoded string as an Uint8Array.
     */
    strToUTF8 = (str: string): Uint8Array => {
        const utf8 = new Uint8Array(str.length);
        this._encoder.encodeInto(str, utf8);

        return utf8;
    };

    /**
     * Converts an Uint8Array raw UTF8 string to an array of big-endian words.
     * @param utf8 The UTF-8 encoded string.
     * @returns The array of big-endian words.
     */
    utf8ToBigEndianWords = (utf8: Uint8Array): number[] => {
        const output = Array(utf8.length >> 2);

        for (let i = 0; i < output.length; i++) {
            output[i] = 0;
        }

        for (let i = 0; i < utf8.length * 8; i += 8) {
            output[i >> 5] |= (utf8[i / 8] & 0xFF) << (24 - i % 32);
        }

        return output;
    };

    /**
     * **[GPU]** SHA-256 internal hash computation.
     * @param m The message to hash.
     * @param l The length of the message.
     */
    private sha256Internal = (m: number[], l: number) => {
        // const hash = 
    };
}