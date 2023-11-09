/**
 * Loads an Uint8 from the storage at the specified pointer & offset.
 * @param ptr Pointer to the storage.
 * @param offset Offset to the storage.
 * @returns The loaded Uint8.
 */
export function loadUint8(ptr: usize, offset: usize): u8 {
    return load<u8>(ptr + offset);
}

/**
 * Stores an Uint8 to the storage at the specified pointer & offset.
 * @param ptr Pointer to the storage.
 * @param offset Offset to the storage.
 * @param value The value to store.
 */
export function storeUint8(ptr: usize, offset: usize, value: u8): void {
    store<u8>(ptr + offset, value);
}

/**
 * Loads an Uint32 as a little endian from the storage at the specified pointer & offset (aligned).
 * @param ptr Pointer to the storage.
 * @param offset Offset to the storage.
 * @returns The loaded Uint32.
 */
export function loadUint32LE(ptr: usize, offset: usize): u32 {
    return load<u32>(ptr + (offset << alignof<u32>()));
}

/**
 * Stores an Uint32 as a little endian to the storage at the specified pointer & offset (aligned).
 * @param ptr Pointer to the storage.
 * @param offset Offset to the storage.
 * @param value The value to store.
 */
export function storeUint32LE(ptr: usize, offset: usize, value: u32): void {
    store<u32>(ptr + (offset << alignof<u32>()), value);
}

/**
 * Loads an Uint32 as a big endian from the storage at the specified pointer & offset (aligned).
 * @param ptr Pointer to the storage.
 * @param offset Offset to the storage.
 * @returns The loaded Uint32.
 */
export function loadUint32BE(ptr: usize, offset: usize): u32 {
    return bswap<u32>(load<u32>(ptr + (offset << alignof<u32>())));
}

/**
 * Stores an Uint32 as a big endian to the storage at the specified pointer & offset (aligned).
 * @param ptr Pointer to the storage.
 * @param offset Offset to the storage.
 * @param value The value to store.
 */
export function storeUint32BE(ptr: usize, offset: usize, value: u32): void {
    store<u32>(ptr + (offset << alignof<u32>()), bswap<u32>(value));
}

/**
 * Fills up a part of the storage with the specified value.
 * @param ptr The pointer to the storage.
 * @param value The value to fill the storage with.
 * @param length The length of the storage to fill.
 */
export function fill(ptr: usize, value: u8, length: u32): void {
    const finalPtr = ptr + length;

    while (ptr < finalPtr) {
        store<u8>(ptr, value);
        ptr++;
    }
}