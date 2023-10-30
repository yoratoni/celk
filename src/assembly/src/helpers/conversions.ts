/**
 * Converts an array of u8 to an array of u32 (big endian).
 * @param array The array of u8 to convert.
 * @returns The array of u32.
 */
export const U8ToU32_BE = (array: u8[]): u32[] => {
    const res: u32[] = new Array<u32>(array.length >> 2);

    for (let i = 0; i < array.length; i += 4) {
        res[i >> 5] |= (array[i / 8] & 0xFF) << (24 - (i as u8) % 32);
    }

    return res;
};

/**
 * Converts an array of u32 to an array of u8 (big endian).
 * @param array The array of u32 to convert.
 * @returns The array of u8.
 */
export const U32ToU8_BE = (array: u32[]): u8[] => {
    const res: u8[] = new Array<u8>(array.length << 2);

    for (let i = 0; i < res.length; i++) {
        res[i] = ((array[i >> 2] >> (24 - (i % 4) * 8)) & 0xFF) as u8;
    }

    return res;
};