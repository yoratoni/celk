import { randomFillSync } from "crypto";


/**
 * Cache is a helper class that extends Uint8Array and provides
 * methods similar to the ones that can be found in the Node.js Buffer class.
 */
export default class Cache extends Uint8Array {
    private HEX_MAP: { [key: string]: number; } = {
        "0": 0, "1": 1, "2": 2, "3": 3, "4": 4, "5": 5, "6": 6,
        "7": 7, "8": 8, "9": 9, "a": 10, "b": 11, "c": 12, "d": 13,
        "e": 14, "f": 15, "A": 10, "B": 11, "C": 12, "D": 13,
        "E": 14, "F": 15
    };


    /**
     * Creates a new Cache object based on an input (supported by the Uint8Array constructor).
     *
     * **Note:** The Uint8Array constructor interface has been modified to be more permissive,
     * as TS still doesn't support multiple constructor signatures.
     * @param input The input to create the cache from.
     * @param options The options to use (optional).
     */
    constructor(
        input: ArrayBufferLike | ArrayLike<number> | number,
        options?: {
            byteOffset?: number;
            length?: number;
        }
    ) {
        if (!options) super(input);
        else super(input as ArrayBufferLike, options?.byteOffset, options?.length);
    }


    /**
     * Creates a new Cache object of the specified size.
     * @param size The size of the cache.
     * @returns A new Cache object.
     */
    static alloc = (size: number): Cache => new Cache(size);

    /**
     * Creates a new Cache object from an ArrayBuffer.
     * @param buffer The ArrayBuffer to create the cache from.
     * @param byteOffset The offset to start reading from (optional, defaults to 0).
     * @param length The number of bytes to read (optional, defaults to the buffer length).
     * @returns A new Cache object.
     */
    static fromArrayBuffer = (buffer: ArrayBuffer, byteOffset?: number, length?: number): Cache => new Cache(buffer, { byteOffset, length });

    /**
     * Creates a new Cache object from the specified string and encoding.
     *
     * **Note:** If the string begins with "0x",
     * it will be automatically treated as an hexadecimal string.
     *
     * @param value The string to create the cache from.
     * @param encoding The encoding to use (optional, defaults to "hex").
     * @returns A new Cache object.
     */
    static fromString = (value: string | `0x${string}`, encoding: "utf8" | "hex" = "hex"): Cache => {
        if (value.startsWith("0x")) {
            encoding = "hex";
            value = value.slice(2);
        }

        const cache = new Cache(value.length);
        cache.write(value, 0, value.length, encoding);
        return cache;
    };

    /**
     * Creates a new Cache object from the specified array of numbers.
     * @param numbers The array of numbers to create the cache from.
     * @returns A new Cache object.
     */
    static fromNumbers = (numbers: number[]): Cache => {
        const cache = new Cache(numbers.length);

        for (let i = 0; i < numbers.length; i++) {
            cache[i] = numbers[i];
        }

        return cache;
    };

    /**
     * A private method that writes an hexadecimal string to the cache.
     * @param value The hexadecimal string to write to the cache.
     * @param start The offset to start writing at.
     * @param bytes The number of bytes to write.
     */
    private writeHex = (value: string, start: number, bytes: number): void => {
        for (let i = 0; i < bytes; i += 2) {
            // Sanity check
            if (this.HEX_MAP[value[i]] === undefined || this.HEX_MAP[value[i + 1]] === undefined) {
                throw new Error("Invalid hex string input");
            }

            this[start + (i / 2)] = (this.HEX_MAP[value[i]] << 4) | this.HEX_MAP[value[i + 1]];
        }
    };

    /**
     * A private method that writes a UTF-8 string to the cache.
     * @param value The UTF-8 string to write to the cache.
     * @param offset The offset to start writing at.
     * @param bytes The number of bytes to write.
     */
    private writeUtf8 = (value: string, start: number, bytes: number): void => {
        for (let i = 0; i < bytes; i++) {
            this[start + i] = value.charCodeAt(i);
        }
    };

    /**
     * Writes a string to the cache, at the specified offset.
     *
     * **Note:** If the string begins with "0x",
     * it will be automatically treated as an hexadecimal string.
     *
     * @param value The string to write to the cache.
     * @param offset The offset to start writing at (optional, defaults to 0).
     * @param bytes The number of bytes to write (optional, defaults to the value length).
     * @param encoding The encoding to use (optional, defaults to "hex").
     */
    write = (value: string | `0x${string}`, offset = 0, bytes?: number, encoding: "utf8" | "hex" = "hex"): void => {
        if (value.startsWith("0x")) {
            encoding = "hex";
            value = value.slice(2);

            // Sanity check
            if (value.length % 2 !== 0) {
                throw new Error("Invalid hexadecimal string input length, expected it to be a multiple of 2");
            }
        }

        switch (encoding) {
            case "utf8":
                this.writeUtf8(value, offset, bytes || value.length);
                break;
            case "hex":
                this.writeHex(value, offset, bytes || value.length);
                break;
            default:
                throw new Error("Invalid encoding");
        }
    };

    /**
     * Writes an Uint8Array to the cache.
     * @param value The Uint8Array to write to the cache.
     * @param start The offset to start writing at (optional, defaults to 0).
     * @param bytes The number of bytes to write (optional, defaults to the value length).
     */
    writeUint8Array = (value: Uint8Array, start = 0, bytes = value.length): void => {
        for (let i = 0; i < bytes; i++) {
            this[start + i] = value[i];
        }
    };

    /**
     * Overrides the default Uint8Array 'subarray' method allowing to keep the 'Cache' type.
     *
     * **Note:** We can't use the 'subarray' method directly because it returns a 'Uint8Array' object.
     * And maximum call stack size will be exceeded if we try to cast it to a 'Cache' object.
     * @param begin The start offset.
     * @param end The end offset.
     * @returns The subarray.
     */
    subarray = (begin: number, end?: number): Cache => {
        if (end === undefined) {
            end = this.length;
        }

        const cache = new Cache(end - begin);

        for (let i = begin; i < end; i++) {
            cache[i - begin] = this[i];
        }

        return cache;
    };

    /**
     * Overrides the default Uint8Array 'toString' method.
     * @param encoding The encoding to use (optional, defaults to "hex").
     * @returns The string representation of the cache.
     */
    toString = (encoding: "utf8" | "hex" = "hex"): string => {
        let output = "";

        for (let i = 0; i < this.length; i++) {
            switch (encoding) {
                case "utf8":
                    output += String.fromCharCode(this[i]);
                    break;
                case "hex":
                    output += this[i].toString(16).padStart(2, "0");
                    break;
                default:
                    throw new Error("Invalid encoding");
            }
        }

        return output;
    };

    /**
     * Checks if the cache is equal to the specified cache.
     */
    equals = (cache: Cache): boolean => {
        if (this.length !== cache.length) {
            return false;
        }

        for (let i = 0; i < this.length; i++) {
            if (this[i] !== cache[i]) {
                return false;
            }
        }

        return true;
    };

    /**
     * Writes a 32-bit big endian unsigned integer to the cache.
     * @param value The value to write.
     * @param offset The offset to write to.
     * @returns The cache.
     */
    writeUint32BE = (value: number, offset: number): Cache => {
        this[offset] = (value >>> 24) & 0xFF;
        this[offset + 1] = (value >>> 16) & 0xFF;
        this[offset + 2] = (value >>> 8) & 0xFF;
        this[offset + 3] = value & 0xFF;

        return this;
    };

    /**
     * Reads a 32-bit big endian unsigned integer from the cache.
     * @param offset The offset to read from.
     * @returns The big endian word.
     */
    readUint32BE = (offset: number): number => (this[offset] << 24) | (this[offset + 1] << 16) | (this[offset + 2] << 8) | this[offset + 3];

    /**
     * Randomly fills the cache with bytes.
     * @param offset The offset to start filling at (optional, defaults to 0).
     * @param size The number of bytes to fill (optional, defaults to the cache length).
     */
    randomFill = (offset?: number, size?: number) => randomFillSync(this, offset, size);
}