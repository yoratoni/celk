import { randomFillSync } from "crypto";


/**
 * Cache is a helper class that extends Uint8Array and provides
 * methods similar to the ones that can be found in the Node.js Buffer class.
 */
export default class Cache extends Uint8Array {
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
     * Writes an array of numbers to the cache (< 256).
     * @param value The array of numbers to write to the cache.
     * @param start The offset to start writing at (optional, defaults to 0).
     * @param bytes The number of bytes to write (optional, defaults to the value length).
     */
    writeNumbers = (value: number[], start = 0, bytes = value.length): void => {
        for (let i = 0; i < bytes; i++) {
            if (value[i] > 255) throw new Error("Invalid number input (should be < 256)");
            this[start + i] = value[i];
        }
    };

    /**
     * Writes an hexadecimal string to the cache (should start with "0x").
     * @param value The hexadecimal string to write to the cache.
     * @param start The offset to start writing at (optional, defaults to 0).
     * @param bytes The number of bytes to write (optional, defaults to the value length).
     */
    writeHex = (value: `0x${string}`, start = 0, bytes = value.length): void => {
        if (!value.startsWith("0x")) throw new Error("Invalid hexadecimal string input (missing '0x' prefix)");

        const arr = value.slice(2).match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16));
        if (!arr) throw new Error("Invalid hexadecimal string input");

        for (let i = 0; i < bytes; i++) {
            this[start + i] = arr[i];
        }
    };

    /**
     * Writes a UTF-8 string to the cache.
     * @param value The UTF-8 string to write to the cache.
     * @param offset The offset to start writing at (optional, defaults to 0).
     * @param bytes The number of bytes to write (optional, defaults to the value length).
     */
    writeUtf8 = (value: string, start = 0, bytes = value.length): void => {
        for (let i = 0; i < bytes; i++) {
            this[start + i] = value.charCodeAt(i);
        }
    };

    /**
     * Writes an Uint8Array / cache to the cache.
     * @param value The Uint8Array / cache to write to the cache.
     * @param start The offset to start writing at (optional, defaults to 0).
     * @param bytes The number of bytes to write (optional, defaults to the value length).
     */
    writeUint8Array = (value: Uint8Array | Cache, start = 0, bytes = value.length): void => {
        for (let i = 0; i < bytes; i++) {
            this[start + i] = value[i];
        }
    };

    /**
     * Writes an array of 32-bit Big Endian words to the cache
     * @param value The array of 32-bit Big Endian words to write to the cache.
     * @param start The offset to start writing at (optional, defaults to 0).
     * @param bytes The number of bytes to write (optional, defaults to the value length).
     */
    writeBigEndianWords = (value: number[], start = 0, bytes = value.length): void => {
        for (let i = 0; i < bytes * 32; i += 8) {
            this[start + i / 8] = (value[i >> 5] >>> (24 - i % 32)) & 0xFF;
        }
    };

    /**
     * Writes an array of 32-bit Little Endian words to the cache
     * @param value The array of 32-bit Little Endian words to write to the cache.
     * @param start The offset to start writing at (optional, defaults to 0).
     * @param bytes The number of bytes to write (optional, defaults to the value length).
     */
    writeLittleEndianWords = (value: number[], start = 0, bytes = value.length): void => {
        for (let i = 0; i < bytes * 32; i += 8) {
            this[start + i / 8] = (value[i >> 5] >>> (i % 32)) & 0xFF;
        }
    };

    /**
     * Writes a big integer to the cache.
     * @param value The big integer to write to the cache.
     * @param start The offset to start writing at (optional, defaults to 0).
     * @param bytes The number of bytes to write (optional, defaults to the value length).
     */
    writeBigInt = (value: bigint, start = 0, bytes = Math.ceil(Number(value).toString(16).length / 2)): void => {
        for (let i = 0; i < bytes; i++) {
            this[start + i] = Number(value >> BigInt(8 * (bytes - i - 1)) & BigInt(0xFF));
        }
    };

    /**
     * Creates a new Cache object from an array of numbers.
     * @param value The array of numbers to create the cache from.
     * @param start The offset to start reading from (optional, defaults to 0).
     * @param bytes The number of bytes to read (optional, defaults to the value length).
     */
    static fromNumbers = (value: number[], start = 0, bytes = value.length): Cache => {
        const cache = new Cache(bytes);
        cache.writeNumbers(value, start, bytes);
        return cache;
    };

    /**
     * Creates a new Cache object from an hexadecimal string (should start with "0x").
     * @param value The hexadecimal string to create the cache from.
     * @param start The offset to start reading from (optional, defaults to 0).
     * @param bytes The number of bytes to read (optional, defaults to the value length).
     */
    static fromHex = (value: `0x${string}`, start = 0, bytes = value.length): Cache => {
        const cache = new Cache(bytes);
        cache.writeHex(value, start, bytes);
        return cache;
    };

    /**
     * Creates a new Cache object from a UTF-8 string.
     * @param value The UTF-8 string to create the cache from.
     * @param start The offset to start reading from (optional, defaults to 0).
     * @param bytes The number of bytes to read (optional, defaults to the value length).
     */
    static fromUtf8 = (value: string, start = 0, bytes = value.length): Cache => {
        const cache = new Cache(bytes);
        cache.writeUtf8(value, start, bytes);
        return cache;
    };

    /**
     * Creates a new Cache object from an Uint8Array / cache.
     * @param value The Uint8Array / cache to create the cache from.
     * @param start The offset to start reading from (optional, defaults to 0).
     * @param bytes The number of bytes to read (optional, defaults to the value length).
     */
    static fromUint8Array = (value: Uint8Array | Cache, start = 0, bytes = value.length): Cache => {
        const cache = new Cache(bytes);
        cache.writeUint8Array(value, start, bytes);
        return cache;
    };

    /**
     * Creates a new Cache object from an array of 32-bit Big Endian words.
     * @param value The array of 32-bit Big Endian words to create the cache from.
     * @param start The offset to start reading from (optional, defaults to 0).
     * @param bytes The number of bytes to read (optional, defaults to the value length).
     */
    static fromBigEndianWords = (value: number[], start = 0, bytes = value.length): Cache => {
        const cache = new Cache(bytes);
        cache.writeBigEndianWords(value, start, bytes);
        return cache;
    };

    /**
     * Creates a new Cache object from an array of 32-bit Little Endian words.
     * @param value The array of 32-bit Little Endian words to create the cache from.
     * @param start The offset to start reading from (optional, defaults to 0).
     * @param bytes The number of bytes to read (optional, defaults to the value length).
     */
    static fromLittleEndianWords = (value: number[], start = 0, bytes = value.length): Cache => {
        const cache = new Cache(bytes);
        cache.writeLittleEndianWords(value, start, bytes);
        return cache;
    };

    /**
     * Creates a new Cache object from a big integer.
     * @param value The big integer to create the cache from.
     * @param start The offset to start reading from (optional, defaults to 0).
     * @param bytes The number of bytes to read (optional, defaults to the value length).
     */
    static fromBigInt = (value: bigint, start = 0, bytes = Math.ceil(Number(value).toString(16).length / 2)): Cache => {
        const cache = new Cache(bytes);
        cache.writeBigInt(value, start, bytes);
        return cache;
    };

    /**
     * Creates a new Cache object from an ArrayBuffer.
     * @param buffer The ArrayBuffer to create the cache from.
     * @param byteOffset The offset to start reading from (optional, defaults to 0).
     * @param length The number of bytes to read (optional, defaults to the buffer length).
     * @returns A new Cache object.
     */
    static fromArrayBuffer = (buffer: ArrayBuffer, byteOffset?: number, length?: number): Cache => new Cache(buffer, { byteOffset, length });

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