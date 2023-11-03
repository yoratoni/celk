import { randomFillSync } from "crypto";

import { IsMemorySlot } from "constants/memory";
import Cache from "helpers/cache";
import General from "types/general";
import logger from "utils/logger";


/**
 * Interface for the PKG return value.
 */
export interface IsPKGReturnValue {
    dec: bigint;
    arr: Cache;
}


/**
 * Used to generate a private key between a given range.
 */
export default class PKG_ENGINE {
    // Ranges
    private low: bigint;
    private high: bigint;

    // Chunk to store the private key as an Uint8Array (cache extension)
    private chunk: Cache;

    // Ascending & descending current positions
    private currAscending: bigint;
    private currDescending: bigint;

    // Full random cache
    private tmpCacheSize = 8192;
    private tmpCache = Cache.alloc(this.tmpCacheSize);
    private tmpCacheIndex: number = 0;

    // Endpoint to generate the private key based on the current mode
    private executeEndpoint: (cache: Cache, slot: IsMemorySlot) => bigint;


    /**
     * Construct a new Private Key Generator (PKG) engine.
     * @param privateKeyGenMode The private key generation mode (FULL_RANDOM, ASCENDING, DESCENDING).
     * @param privateLengthInBytes The length of the private key in bytes.
     * @param low The low range to generate the private key from.
     * @param high The high range to generate the private key from.
     */
    constructor(
        privateKeyGenMode: General.IsPrivateKeyGenMode,
        privateLengthInBytes: number,
        low: bigint,
        high: bigint
    ) {
        switch (privateKeyGenMode) {
            case "FULL_RANDOM":
                this.executeEndpoint = this.executeFullRandom;
                break;
            case "ASCENDING":
                this.executeEndpoint = this.executeAscending;
                break;
            case "DESCENDING":
                this.executeEndpoint = this.executeDescending;
                break;
            default:
                throw new Error(`[PKG] Invalid private key generation mode: '${privateKeyGenMode}'`);
        }

        // Ranges
        this.low = low;
        this.high = high;

        // Chunk to store the private key as an Uint8Array (cache extension)
        this.chunk = Cache.alloc(privateLengthInBytes);

        // Ascending & descending current positions
        this.currAscending = this.low;
        this.currDescending = this.high;

        // Fill the cache with random data
        this.tmpCache.randomFill();
    }


    /**
     * **[FULL RANDOM]** Generate a private key between a given range (defined in the constructor),
     * and write it into a given memory slot in a given cache, also returning the private key as a bigint.
     * @param cache The cache to write the private key to.
     * @param slot The memory slot to write to.
     * @returns The private key as a bigint.
     */
    private executeFullRandom = (cache: Cache, slot: IsMemorySlot): bigint => {
        if (this.tmpCacheIndex >= this.tmpCacheSize) {
            randomFillSync(this.tmpCache);
            this.tmpCacheIndex = 0;
        }

        const hexString = this.tmpCache.subarray(this.tmpCacheIndex, this.tmpCacheIndex + slot.bytes).toString("hex");
        const boundedValue = BigInt(`0x${hexString}`) % (this.high - this.low) + this.low;

        // Write to the chunk
        this.chunk.write(
            boundedValue.toString(16).padStart(slot.bytes, "0"),
            0,
            slot.bytes,
            "hex"
        );

        // Write to the cache
        cache.writeTypedArray(this.chunk, slot.offset, slot.bytes);

        this.tmpCacheIndex += slot.bytes;

        return boundedValue;
    };

    /**
     * **[ASCENDING]** Generate a private key between a given range (defined in the constructor),
     * and write it into a given memory slot in a given cache, also returning the private key as a bigint.
     * @param cache The cache to write the private key to.
     * @param slot The memory slot to write to.
     * @returns The private key as a bigint.
     */
    private executeAscending = (cache: Cache, slot: IsMemorySlot): bigint => {
        if (this.currAscending > this.high) {
            logger.warn("[PKG] executeAscending: Generated private key is out of bounds. Resetting..");
            this.currAscending = this.low;
        }

        // Write to the chunk
        this.chunk.write(
            this.currAscending.toString(16).padStart(slot.bytes, "0"),
            0,
            slot.bytes,
            "hex"
        );

        // Write to the cache
        cache.writeTypedArray(this.chunk, slot.offset, slot.bytes);

        return this.currAscending++;
    };

    /**
     * **[DESCENDING]** Generate a private key between a given range (defined in the constructor),
     * and write it into a given memory slot in a given cache, also returning the private key as a bigint.
     * @param cache The cache to write the private key to.
     * @param slot The memory slot to write to.
     * @returns The private key as a bigint.
     */
    private executeDescending = (cache: Cache, slot: IsMemorySlot): bigint => {
        if (this.currDescending < this.low) {
            logger.warn("[PKG] executeDescending: Generated private key is out of bounds. Resetting..");
            this.currDescending = this.high;
        }

        // Write to the chunk
        this.chunk.write(
            this.currAscending.toString(16).padStart(slot.bytes, "0"),
            0,
            slot.bytes,
            "hex"
        );

        // Write to the cache
        cache.writeTypedArray(this.chunk, slot.offset, slot.bytes);

        return this.currDescending--;
    };

    /**
     * Change the range to generate the private key from.
     * @param low The new low range.
     * @param high The new high range.
     */
    setRange = (low: bigint, high: bigint): void => {
        this.low = low;
        this.high = high;

        this.currAscending = this.low;
        this.currDescending = this.high;
    };

    /**
     * Change the private key generation mode.
     * @param privateKeyGenMode The new private key generation mode (FULL_RANDOM, ASCENDING, DESCENDING).
     */
    setPrivateKeyGenMode = (privateKeyGenMode: General.IsPrivateKeyGenMode): void => {
        switch (privateKeyGenMode) {
            case "FULL_RANDOM":
                this.executeEndpoint = this.executeFullRandom;
                break;
            case "ASCENDING":
                this.executeEndpoint = this.executeAscending;
                break;
            case "DESCENDING":
                this.executeEndpoint = this.executeDescending;
                break;
            default:
                throw new Error(`[PKG] Invalid private key generation mode: '${privateKeyGenMode}'`);
        }
    };

    /**
     * Main endpoint to generate a private key between a given range (defined in the constructor),
     * and write it into a given memory slot in a given cache, also returning the private key as a bigint.
     * @param cache The cache to write the private key to.
     * @param slot The memory slot to write to.
     * @returns The private key as a bigint.
     */
    execute = (cache: Cache, slot: IsMemorySlot): bigint => this.executeEndpoint(cache, slot);
}