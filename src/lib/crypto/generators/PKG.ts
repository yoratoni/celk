import { randomFillSync } from "crypto";

import { IsMemorySlot } from "constants/memory";
import Cache from "helpers/cache";
import General from "types/general";
import logger from "utils/logger";


/**
 * Used to generate a private key between a given range.
 */
export default class PKG_ENGINE {
    // Range
    private low: bigint;
    private high: bigint;

    // Positions in the range (ascending and descending modes)
    private currAscending: bigint;
    private currDescending: bigint;

    // Chunk that stores the generated private key
    private pkChunk: Cache;

    // Temporary cache used to generate the private key (full random mode)
    private tmpCacheSize = 8192;
    private tmpCache: Cache = Cache.alloc(this.tmpCacheSize);
    private tmpCacheIndex: number = 0;

    // Execute endpoint depending on the private key generation mode
    private executeEndpoint: (cache: Cache, memorySlot: IsMemorySlot) => void;


    /**
     * Construct a new Private Key Generator (PKG) engine.
     * @param privateKeyGenMode The private key generation mode.
     * @param low The low range to generate the private key from.
     * @param high The high range to generate the private key from.
     */
    constructor(
        privateKeyGenMode: General.IsPrivateKeyGenMode,
        low: bigint,
        high: bigint
    ) {
        switch (privateKeyGenMode) {
            case "FULL_RANDOM":
                this.executeEndpoint = this.executeFullRandom;

                // Initialize the chunk with 32 bytes of random data
                this.pkChunk = Cache.alloc(32);
                randomFillSync(this.pkChunk);

                break;
            case "ASCENDING":
                this.executeEndpoint = this.executeAscending;

                // Initialize the chunk with the low range
                this.pkChunk = Cache.fromBigInt(low, 32);

                break;
            case "DESCENDING":
                this.executeEndpoint = this.executeDescending;

                // Initialize the chunk with the high range
                this.pkChunk = Cache.fromBigInt(high, 32);

                break;
            default:
                throw new Error(`[PKG] Invalid private key generation mode: '${privateKeyGenMode}'`);
        }

        this.low = low;
        this.high = high;

        this.currAscending = this.low;
        this.currDescending = this.high;

        // Fill the cache with random data
        this.tmpCache.randomFill();
    }


    /**
     * **[FULL RANDOM]** Generate a private key between a given range (defined in the constructor),
     * and write it to the cache.
     * @param cache The cache to write the private key to.
     * @param memorySlot The memory slot to write the private key to.
     */
    private executeFullRandom = (cache: Cache, memorySlot: IsMemorySlot): void => {
        if (this.tmpCacheIndex >= this.tmpCacheSize) {
            randomFillSync(this.tmpCache);
            this.tmpCacheIndex = 0;
        }

        this.pkChunk = this.tmpCache.subarray(this.tmpCacheIndex, this.tmpCacheIndex + 32);
        this.tmpCacheIndex += 32;

        // Write the private key to the cache
        cache.set(this.pkChunk, memorySlot.start);
    };

    /**
     * **[ASCENDING]** Generate a private key between a given range (defined in the constructor).
     * @param cache The cache to write the private key to.
     * @param memorySlot The memory slot to write the private key to.
     */
    private executeAscending = (cache: Cache, memorySlot: IsMemorySlot): void => {
        if (this.currAscending >= this.high) {
            logger.warn("[PKG] Reached the end of the range, resetting to the beginning");
            this.currAscending = this.low;
        } else {
            this.currAscending++;
        }

        for (let i = 0; i < 32; i++) {
            this.pkChunk[i] = Number((this.currAscending >> BigInt(i * 8)) & BigInt(0xFF));
        }

        // Write the private key to the cache
        cache.set(this.pkChunk, memorySlot.start);
    };

    /**
     * **[DESCENDING]** Generate a private key between a given range (defined in the constructor).
     * @param cache The cache to write the private key to.
     * @param memorySlot The memory slot to write the private key to.
     */
    private executeDescending = (cache: Cache, memorySlot: IsMemorySlot): void => {
        if (this.currDescending <= this.low) {
            logger.warn("[PKG] Reached the end of the range, resetting to the beginning");
            this.currDescending = this.high;
        } else {
            this.currDescending--;
        }

        for (let i = 0; i < 32; i++) {
            this.pkChunk[i] = Number((this.currDescending >> BigInt(i * 8)) & BigInt(0xFF));
        }

        // Write the private key to the cache
        cache.set(this.pkChunk, memorySlot.start);
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
     * Main endpoint to generate a private key between a given range (defined in the constructor).
     * @param cache The cache to write the private key to.
     * @param memorySlot The memory slot to write the private key to.
     */
    execute = (cache: Cache, memorySlot: IsMemorySlot): void => this.executeEndpoint(cache, memorySlot);
}