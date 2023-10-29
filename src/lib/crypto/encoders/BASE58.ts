import Cache from "helpers/cache";


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
    constructor() { }


    /**
     * Execute the BASE58 decoder.
     * @param input The BASE58 encoded string to decode.
     * @returns The decoded bytes.
     */
    decode = (input: string): Cache => {
        if (input.length === 0) {
            return Cache.alloc(0);
        }

        const bytes = [0];

        for (let i = 0; i < input.length; i++) {
            const c = input[i];
            const digit = this.ALPHABET.indexOf(c);

            if (digit < 0) {
                throw new Error(`[BASE58] decode: Invalid character found: ${c}`);
            }

            for (let j = 0; j < bytes.length; j++) {
                bytes[j] *= this.BASE;
            }

            bytes[0] += digit;
            let carry = 0;

            for (let k = 0; k < bytes.length; k++) {
                bytes[k] += carry;
                carry = bytes[k] >> 8;
                bytes[k] &= 0xff;
            }

            while (carry) {
                bytes.push(carry & 0xff);
                carry >>= 8;
            }
        }

        for (let i = 0; input[i] === "1" && i < input.length - 1; i++) {
            bytes.push(0);
        }

        return Cache.fromNumbers(bytes.reverse());
    };

    /**
     * Execute the BASE58 encoder.
     * @param cache The cache to use as input.
     * @param bytesToTakeFromCache The number of bytes to take from the cache as [start, end].
     * @returns The BASE58 encoded version of the bytes.
     */
    encode = (cache: Cache, bytesToTakeFromCache: [number, number]): string => {
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