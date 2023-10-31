/**
 * An AssemblyScript implementation of the Secure Hash Algorithm, SHA-256, as defined in FIPS 180-4.
 *
 * Original FIPS 180-4 specification:
 * - https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.180-4.pdf
 *
 * Based on the SHA-256 explanation by Quadibloc:
 * - http://www.quadibloc.com/crypto/mi060501.htm
 *
 * And the JS implementation by Bryan Chow:
 * - https://gist.github.com/bryanchow/1649353
 */

import { BE_Uint32ArrayToUint8Array, BE_Uint8ArrayToUint32Array } from "../helpers/conversions";


/** SHA-256 64-bit words constants. */
const K: Uint32Array = new Uint32Array(64);

// Initialize SHA-256 constants
K.set([
    0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5,
    0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3, 0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174,
    0xE49B69C1, 0xEFBE4786, 0x0FC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA,
    0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 0x06CA6351, 0x14292967,
    0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13, 0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85,
    0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070,
    0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3,
    0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2
]);

/**
 * Perform the "circular right shift" (ROTR in FIPS 180-4) operation, needed for the hash computation.
 * @param x The number to shift.
 * @param n The number of bits to shift.
 * @returns The shifted number.
 */
const ROTR = (x: u32, n: u32): u32 => (x >>> n) | (x << (32 - n));

/**
 * Perform the "right shift" (SHR in FIPS 180-4) operation, needed for the hash computation.
 * @param x The number to shift.
 * @param n The number of bits to shift.
 * @returns The shifted number.
 */
const SHR = (x: u32, n: u32): u32 => (x >>> n);

/**
 * Perform the "choose" operation, needed for the hash computation.
 * @param x The first number.
 * @param y The second number.
 * @param z The third number.
 * @returns The result of the "choose" operation.
 */
const choose = (x: u32, y: u32, z: u32): u32 => (x & y) ^ ((~x) & z);

/**
 * Perform the "majority" operation, needed for the hash computation.
 * @param x The first number.
 * @param y The second number.
 * @param z The third number.
 * @returns The result of the "majority" operation.
 */
const majority = (x: u32, y: u32, z: u32): u32 => (x & y) ^ (x & z) ^ (y & z);

/** Perform the "SIGMA 0" operation. */
const sigma0 = (x: u32): u32 => ROTR(x, 2) ^ ROTR(x, 13) ^ ROTR(x, 22);

/** Perform the "SIGMA 1" operation. */
const sigma1 = (x: u32): u32 => ROTR(x, 6) ^ ROTR(x, 11) ^ ROTR(x, 25);

/** Perform the "GAMMA 0" operation. */
const gamma0 = (x: u32): u32 => ROTR(x, 7) ^ ROTR(x, 18) ^ SHR(x, 3);

/** Perform the "GAMMA 1" operation. */
const gamma1 = (x: u32): u32 => ROTR(x, 17) ^ ROTR(x, 19) ^ SHR(x, 10);

/**
 * Safe addition operation, needed for the hash computation.
 * @param x The first number to add.
 * @param y The second number to add.
 * @returns The sum of the two numbers.
 */
const safeAdd = (x: u32, y: u32): u32 => {
    const lsw = (x & 0xFFFF) + (y & 0xFFFF);
    const msw = (x >> 16) + (y >> 16) + (lsw >> 16);

    return (msw << 16) | (lsw & 0xFFFF);
};

/**
 * SHA-256 internal hash computation (Uint32Array => Uint32Array)
 * @param m The message to hash (Uint32Array).
 * @param len The original message length.
 * @returns The hash of the message (Uint32Array).
 */
const _sha256 = (m: Uint32Array, len: u32): Uint32Array => {
    const HASH = new Uint32Array(8);

    // Initialize hash values
    HASH.set([
        0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A,
        0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19
    ]);

    // W Array (message schedule)
    const W: Uint32Array = new Uint32Array(64);

    // Original message length * 8
    const l = len * 8;

    // Indexes
    let i: i32;
    let j: i32;

    // Temporary calculation variables
    let t1: u32;
    let t2: u32;

    // Temporary hash variables
    let a: u32;
    let b: u32;
    let c: u32;
    let d: u32;
    let e: u32;
    let f: u32;
    let g: u32;
    let h: u32;

    // Append padding (big endian)
    m[l >> 5] |= 0x80 << (24 - l % 32);
    m[(((l + 64) >>> 9) << 4) + 15] = l;

    // Process message in 16-word blocks
    for (i = 0; i < m.length; i += 16) {
        a = HASH[0];
        b = HASH[1];
        c = HASH[2];
        d = HASH[3];
        e = HASH[4];
        f = HASH[5];
        g = HASH[6];
        h = HASH[7];

        // Extend the first 16 words into the remaining 48 words w[16..63] of the message schedule array
        for (j = 0; j < 64; j++) {
            if (j < 16) {
                W[j] = m[j + i];
            } else {
                W[j] = safeAdd(
                    safeAdd(
                        safeAdd(
                            gamma1(W[j - 2]),
                            W[j - 7]
                        ),
                        gamma0(W[j - 15])
                    ),
                    W[j - 16]
                );
            }

            t1 = safeAdd(
                safeAdd(
                    safeAdd(
                        safeAdd(
                            h,
                            sigma1(e)
                        ),
                        choose(e, f, g)
                    ),
                    K[j]
                ),
                W[j]
            );

            t2 = safeAdd(sigma0(a), majority(a, b, c));

            // Compute the intermediate hash value H(i)
            h = g;
            g = f;
            f = e;
            e = safeAdd(d, t1);
            d = c;
            c = b;
            b = a;
            a = safeAdd(t1, t2);
        }

        // Add the compressed chunk to the current hash value
        HASH[0] = safeAdd(a, HASH[0]);
        HASH[1] = safeAdd(b, HASH[1]);
        HASH[2] = safeAdd(c, HASH[2]);
        HASH[3] = safeAdd(d, HASH[3]);
        HASH[4] = safeAdd(e, HASH[4]);
        HASH[5] = safeAdd(f, HASH[5]);
        HASH[6] = safeAdd(g, HASH[6]);
        HASH[7] = safeAdd(h, HASH[7]);
    }

    return HASH;
};

/**
 * Hash a message using SHA-256 (Uint8Array => Uint8Array).
 * @param message The message to hash.
 * @returns The hash of the message.
 */
export default function sha256(message: Uint8Array): Uint8Array {
    // Convert the message to an Uint32Array array
    const m = BE_Uint8ArrayToUint32Array(message);

    // Hash the message
    const hash: Uint32Array = _sha256(m, message.length * 8);

    // Convert the hash to an Uint8Array and return it
    return BE_Uint32ArrayToUint8Array(hash);
};