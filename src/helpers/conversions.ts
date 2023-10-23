// A library for data conversion.

/**
 * Converts an hexadecimal string into an Uint8Array.
 * @param input The hexadecimal string to convert.
 * @returns The Uint8Array.
 */
export const hexToUint8Array = (input: `0x${string}`): Uint8Array => Uint8Array.from(Buffer.from(input.substring(2), "hex"));

/**
 * Converts an hexadecimal string into an Uint32Array.
 * @param input The hexadecimal string to convert.
 * @returns The Uint32Array.
 */
export const hexToUint32Array = (input: `0x${string}`): Uint32Array => Uint32Array.from(Buffer.from(input.substring(2), "hex"));

/**
 * Converts an Uint8Array to an hexadecimal string.
 * @param input The Uint8Array to convert.
 * @returns The hexadecimal string.
 */
export const uint8ArrayToHex = (input: Uint8Array): `0x${string}` => `0x${Buffer.from(input).toString("hex")}`;

/**
 * Converts an Uint32Array to an hexadecimal string.
 * @param input The Uint32Array to convert.
 * @returns The hexadecimal string.
 */
export const uint32ArrayToHex = (input: Uint32Array): `0x${string}` => `0x${Buffer.from(input).toString("hex")}`;

/**
 * Converts an Uint8Array to an array of big-endian words.
 * @param input The Uint8Array.
 * @returns The array of big-endian words.
 */
export const uint8ArrayToBigEndianWords = (input: Uint8Array): number[] => {
    const output = new Array(input.length >> 2);

    for (let i = 0; i < input.length * 8; i += 8) {
        output[i >> 5] |= (input[i / 8] & 0xFF) << (24 - i % 32);
    }

    return output;
};

/**
 * Converts an array of big-endian words to an Uint8Array.
 * @param input The array of big-endian words.
 * @returns The Uint8Array.
 */
export const bigEndianWordsToUint8Array = (input: number[]): Uint8Array => {
    const output = new Uint8Array(input.length * 4);

    for (let i = 0; i < input.length * 32; i += 8) {
        output[i / 8] = (input[i >> 5] >>> (24 - i % 32)) & 0xFF;
    }

    return output;
};

/**
 * Converts an Uint8Array to an array of little-endian words.
 * @param input The Uint8Array.
 * @returns The array of little-endian words.
 */
export const uint8ArrayToLittleEndianWords = (input: Uint8Array): number[] => {
    const output = new Array(input.length >> 2);

    for (let i = 0; i < input.length * 8; i += 8) {
        output[i >> 5] |= (input[i / 8] & 0xFF) << (i % 32);
    }

    return output;
};

/**
 * Converts an array of little-endian words to an Uint8Array.
 * @param input The array of little-endian words.
 * @returns The Uint8Array.
 */
export const littleEndianWordsToUint8Array = (input: number[]): Uint8Array => {
    const output = new Uint8Array(input.length * 4);

    for (let i = 0; i < input.length * 32; i += 8) {
        output[i / 8] = (input[i >> 5] >>> (i % 32)) & 0xFF;
    }

    return output;
};