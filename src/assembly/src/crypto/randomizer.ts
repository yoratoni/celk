/**
 * **[PRNG]** Randomly fills a part of the linear memory with random bytes.
 * @param offset The offset in bytes from the start of the linear memory.
 * @param length The number of bytes to fill.
 */
export function randomFill(offset: usize, length: usize): void {
    for (let i: usize = 0; i < length; i++) {
        store<u8>(offset + i, <u8>Math.floor(Math.random() * 256));
    }
}