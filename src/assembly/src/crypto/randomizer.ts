/**
 * Randomly fills the given array with 8-bit unsigned integers.
 * @param arr The array to fill.
 */
export function randomFillUint8Array(arr: Uint8Array): void {
    for (let i = 0, k = arr.length; i < k; ++i) {
        const value = u8(<u8>(Math.random() * 2.0 - 1.0) * u8.MAX_VALUE);
        unchecked(arr[i] = value);
    }
}

/**
 * Randomly fills the given array with 16-bit unsigned integers.
 * @param arr The array to fill.
 */
export function randomFillUint16Array(arr: Uint16Array): void {
    for (let i = 0, k = arr.length; i < k; ++i) {
        const value = u16(<u16>(Math.random() * 2.0 - 1.0) * u16.MAX_VALUE);
        unchecked(arr[i] = value);
    }
}

/**
 * Randomly fills the given array with 32-bit unsigned integers.
 * @param arr The array to fill.
 */
export function randomFillUint32Array(arr: Uint32Array): void {
    for (let i = 0, k = arr.length; i < k; ++i) {
        const value = u32(<u32>(Math.random() * 2.0 - 1.0) * u32.MAX_VALUE);
        unchecked(arr[i] = value);
    }
}

/**
 * Randomly fills the given array with 64-bit unsigned integers.
 * @param arr The array to fill.
 */
export function randomFillUint64Array(arr: Uint64Array): void {
    for (let i = 0, k = arr.length; i < k; ++i) {
        const value = u64(<u64>(Math.random() * 2.0 - 1.0) * u64.MAX_VALUE);
        unchecked(arr[i] = value);
    }
}