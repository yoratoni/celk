/**
 * Converts a big endian Uint8Array to a big endian Uint32Array.
 * @param input The big endian Uint8Array.
 * @returns The big endian Uint32Array.
 */
export function BE_Uint8ArrayToUint32Array(input: Uint8Array): Uint32Array {
    const output = new Uint32Array(input.length / 4);

    for (let i = 0; i < output.length; i++) {
        output[i] = input[i * 4] << 24 | input[i * 4 + 1] << 16 | input[i * 4 + 2] << 8 | input[i * 4 + 3];
    }

    return output;
}

/**
 * Converts a big endian Uint32Array to a big endian Uint8Array.
 * @param input The big endian Uint32Array.
 * @returns The big endian Uint8Array.
 */
export function BE_Uint32ArrayToUint8Array(input: Uint32Array): Uint8Array {
    const output = new Uint8Array(input.length * 4);

    for (let i = 0; i < input.length; i++) {
        output[i * 4] = input[i] >>> 24;
        output[i * 4 + 1] = input[i] >>> 16;
        output[i * 4 + 2] = input[i] >>> 8;
        output[i * 4 + 3] = input[i];
    }

    return output;
}