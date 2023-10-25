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
