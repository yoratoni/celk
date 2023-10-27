/**
 * A TypeScript implementation of the binary-to-text encoder, BASE58.
 *
 * Based on the JS implementation by Jim Myhrberg:
 *   - https://github.com/jimeh/node-base58/blob/master/src/base58.js
 */
export default class BASE58_ENGINE {
    private readonly ALPHABET: string = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";  // BTC BASE58 alphabet
    private readonly BASE: u8 = this.ALPHABET.length;

}