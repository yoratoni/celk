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
 * Based on the SHA256 pseudocode from Wikipedia.
 * See https://en.wikipedia.org/wiki/SHA-2
 * Also https://csrc.nist.gov/files/pubs/fips/180-4/final/docs/fips180-4.pdf
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

    // List of Sigma & Gamma SHA-256 operations
    private sigma_0_256 = (x: number): number => this.CSR(x, 2) ^ this.CSR(x, 13) ^ this.CSR(x, 22);
    private sigma_1_256 = (x: number): number => this.CSR(x, 6) ^ this.CSR(x, 11) ^ this.CSR(x, 25);
    private gamma_0_256 = (x: number): number => this.CSR(x, 7) ^ this.CSR(x, 18) ^ this.LRS(x, 3);
    private gamma_1_256 = (x: number): number => this.CSR(x, 17) ^ this.CSR(x, 19) ^ this.LRS(x, 10);
    private sigma_0_512 = (x: number): number => this.CSR(x, 28) ^ this.CSR(x, 34) ^ this.CSR(x, 39);
    private sigma_1_512 = (x: number): number => this.CSR(x, 14) ^ this.CSR(x, 18) ^ this.CSR(x, 41);
    private gamma_0_512 = (x: number): number => this.CSR(x, 1) ^ this.CSR(x, 8) ^ this.LRS(x, 7);
    private gamma_1_512 = (x: number): number => this.CSR(x, 19) ^ this.CSR(x, 61) ^ this.LRS(x, 6);

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
     * Encode a string as UTF-16.
     * @param str The string to encode.
     * @returns The UTF-16 encoded string as an Uint16Array.
     */
    strToUTF16 = (str: string): Uint16Array => {
        const utf16 = new Uint16Array(str.length);

        for (let i = 0; i < str.length; i++) {
            utf16[i] = str.charCodeAt(i);
        }

        return utf16;
    };

    /**
     * Convert a raw string to an array of big-endian words.
     * Characters >255 have their high-byte silently ignored.
     * @param str The string to convert.
     * @returns The array of big-endian words.
     */
    strToBigEndianWords = (input: string): number[] => {
        const output = Array(input.length >> 2);

        for (let i = 0; i < output.length; i++) {
            output[i] = 0;
        }

        for (let i = 0; i < input.length * 8; i += 8) {
            output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (24 - i % 32);
        }

        return output;
    };
}