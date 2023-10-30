import Cache from "helpers/cache";
import BASE58_ENGINE from "lib/crypto/encoders/BASE58";


/**
 * Writes an array of big endian words into a cache.
 * @param input The cache.
 * @param bigEndianWords The array of big endian words.
 * @param writeToOffset The offset to write to (optional, defaults to 0).
 */
export const bigEndianWordsToCache = (input: Cache, bigEndianWords: number[], writeToOffset = 0) => {
    for (let i = 0; i < bigEndianWords.length * 32; i += 8) {
        input[writeToOffset + i / 8] = (bigEndianWords[i >> 5] >>> (24 - i % 32)) & 0xFF;
    }
};

/**
 * Writes an array of little-endian words into a cache.
 * @param input The cache.
 * @param littleEndianWords The array of little-endian words.
 * @param writeToOffset The offset to write to (optional, defaults to 0).
 */
export const littleEndianWordsToCache = (input: Cache, littleEndianWords: number[], writeToOffset = 0) => {
    for (let i = 0; i < littleEndianWords.length * 32; i += 8) {
        input[writeToOffset + i / 8] = (littleEndianWords[i >> 5] >>> (i % 32)) & 0xFF;
    }
};

/**
 * Converts a Bitcoin address to its RIPEMD-160 hash (Cache).
 * @param address The Bitcoin address.
 * @returns The RIPEMD-160 hash.
 */
export const addressToRIPEMD160 = (address: string): Cache => {
    const base58Engine = new BASE58_ENGINE();

    // Decode the BASE58 address
    const decoded = base58Engine.decode(address);

    // Extract the RIPEMD-160 hash (Remove the network byte and checksum)
    return decoded.subarray(1, 21);
};