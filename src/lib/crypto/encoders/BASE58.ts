/**
 * A TypeScript implementation of the binary-to-text encoder, BASE58.
 *
 * Based on the JS implementation by Jim Myhrberg:
 *   - https://github.com/jimeh/node-base58/blob/master/src/base58.js
 */
export default class BASE58_ENGINE {
    private readonly ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";  // BTC BASE58 alphabet
    private readonly BASE = this.ALPHABET.length;


    /**
     * Construct a new BASE58 engine.
     */
    constructor() {}


    /**
     * Execute the BASE58 encoder.
     * @param cache The cache to use as input.
     * @param bytesToTakeFromCache The number of bytes to take from the cache as [start, end].
     * @returns The BASE58 encoded version of the bytes.
     */
    execute = (cache: Buffer, bytesToTakeFromCache: [number, number]): string => {
        const bytes = cache.subarray(...bytesToTakeFromCache);
        const digits = [0];

        for (let i = 0; i < bytes.length; i++) {
            for (let j = 0; j < digits.length; j++) {
                digits[j] <<= 8;
            }

            digits[0] += bytes[i];
            let carry = 0;

            for (let k = 0; k < digits.length; k++) {
                digits[k] += carry;
                carry = (digits[k] / this.BASE) | 0;
                digits[k] %= this.BASE;
            }

            while (carry) {
                digits.push(carry % this.BASE);
                carry = (carry / this.BASE) | 0;
            }
        }

        for (let i = 0; i < bytes.length && bytes[i] === 0; i++) {
            digits.push(0);
        }

        return digits.reverse().map((digit) => this.ALPHABET[digit]).join("");
    };
}