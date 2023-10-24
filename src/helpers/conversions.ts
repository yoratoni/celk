// A library for data conversion.

/**
 * Writes an array of big-endian words into a buffer.
 * @param input The buffer.
 * @param bigEndianWords The array of big-endian words.
 * @param writeToOffset The offset to write to (optional, defaults to 0).
 */
export const bigEndianWordsToBuffer = (input: Buffer, bigEndianWords: number[], writeToOffset = 0) => {
    for (let i = 0; i < bigEndianWords.length * 32; i += 8) {
        input[writeToOffset + i / 8] = (bigEndianWords[i >> 5] >>> (24 - i % 32)) & 0xFF;
    }
};

/**
 * Writes an array of little-endian words into a buffer.
 * @param input The buffer.
 * @param littleEndianWords The array of little-endian words.
 * @param writeToOffset The offset to write to (optional, defaults to 0).
 */
export const littleEndianWordsToBuffer = (input: Buffer, littleEndianWords: number[], writeToOffset = 0) => {
    for (let i = 0; i < littleEndianWords.length * 32; i += 8) {
        input[writeToOffset + i / 8] = (littleEndianWords[i >> 5] >>> (i % 32)) & 0xFF;
    }
};

/**
 * Converts an hexadecimal string into an Uint8Array.
 * @param input The hexadecimal string to convert.
 * @returns The Uint8Array.
 */
export const hexToUint8Array = (input: `0x${string}`): Uint8Array => Uint8Array.from(Buffer.from(input.substring(2), "hex"));

/**
 * Converts an Uint8Array to an hexadecimal string.
 * @param input The Uint8Array to convert.
 * @returns The hexadecimal string.
 */
export const uint8ArrayToHex = (input: Uint8Array): `0x${string}` => `0x${Buffer.from(input).toString("hex")}`;