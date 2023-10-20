/**
 * A TypeScript implementation of the binary-to-text encoder, BASE58.
 *
 * Based on the JS implementation by Jim Myhrberg:
 *   - https://github.com/jimeh/node-base58/blob/master/src/base58.js
 */
export default class BASE58_ENGINE {
    private readonly ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
    private readonly BASE = this.ALPHABET.length;

    private _encoder: TextEncoder;


    /**
     * Construct a new base58 engine.
     */
    constructor() {
        this._encoder = new TextEncoder();
    }


    /**
     * Encode a string as UTF-8 Uint8Array.
     * @param input The string to encode.
     * @returns The UTF-8 Uint8Array.
     */
    strToUTF8 = (input: string): Uint8Array => {
        const UTF8 = new Uint8Array(input.length);
        this._encoder.encodeInto(input, UTF8);

        return UTF8;
    };

    /**
     * Encode a string to base58.
     * @param str The string to encode.
     * @returns The base58 encoded string.
     */
    execute = (str: string): string => {
        if (str.length === 0) {
            return "";
        }

        const bytes = this.strToUTF8(str);
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