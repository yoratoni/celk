/**
 * Cache is a helper class that extends Uint8Array and provides
 * methods similar to the ones that can be found in the Node.js Buffer class.
 */
export default class Cache extends Uint8Array {

    /**
     * Creates a new Cache object of the specified size.
     * @param size The size of the cache (in bytes).
     */
    constructor(size: number) {
        super(size);
    }

    /**
     * Creates a new Cache object of the specified size.
     * @param size The size of the cache.
     * @returns A new Cache object.
     */
    static alloc = (size: number): Cache => new Cache(size);

    /**
     * Writes the specified string to the cache at the specified position.
     * @param str The string to write to the cache.
     * @param offset The offset to start writing at (optional, defaults to 0).
     * @param length The number of bytes to write (optional, defaults to the length of the string).
     */
    write = (str: string, offset: number = 0, length: number = str.length): void => {
        for (let i = 0; i < length; i++) {
            this[offset + i] = str.charCodeAt(i);
        }
    };
}