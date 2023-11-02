import { randomFillSync } from "crypto";

import Cache from "helpers/cache";
import General from "types/general";
import logger from "utils/logger";


/**
 * Used to generate a private key between a given range.
 */
export default class PKG_ENGINE {
    private low: bigint;
    private high: bigint;

    private currAscending: bigint;
    private currDescending: bigint;

    // Full random cache
    private tmpCacheSize = 8192;
    private tmpCache: Cache = Cache.alloc(this.tmpCacheSize);
    private tmpChunk: Cache = Cache.alloc(32);
    private tmpCacheIndex: number = 0;

    private executeEndpoint: (cache: Cache) => void;


    /**
     * Construct a new Private Key Generator (PKG) engine.
     * @param privateKeyGenMode The private key generation mode (FULL_RANDOM, ASCENDING, DESCENDING).
     * @param low The low range to generate the private key from.
     * @param high The high range to generate the private key from.
     */
    constructor(privateKeyGenMode: General.IsPrivateKeyGenMode, low: bigint, high: bigint) {
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

        this.low = low;
        this.high = high;

        this.currAscending = this.low;
        this.currDescending = this.high;

        // Fill the cache with random data
        this.tmpCache.randomFill();
    }


    /**
     * **[FULL RANDOM]** Generate a private key between a given range (defined in the constructor).
     * @returns The private key.
     */
    private executeFullRandom = (): void => {
        if (this.tmpCacheIndex >= this.tmpCacheSize) {
            randomFillSync(this.tmpCache);
            this.tmpCacheIndex = 0;
        }

        this.tmpChunk = this.tmpCache.subarray(this.tmpCacheIndex, this.tmpCacheIndex + 32);
        this.tmpCacheIndex += 32;

        // TODO
    };

    /**
     * **[ASCENDING]** Generate a private key between a given range (defined in the constructor).
     * @returns The private key.
     */
    private executeAscending = (): void => {
        if (this.currAscending > this.high) {
            logger.warn(`[PKG] executeAscending: Generated private key is out of bounds (${this.low} - ${this.high}). Resetting..`);
            this.currAscending = this.low;
        }

        // TODO
    };

    /**
     * **[DESCENDING]** Generate a private key between a given range (defined in the constructor).
     * @returns The private key.
     */
    private executeDescending = (): void => {
        if (this.currDescending < this.low) {
            logger.warn(`[PKG] executeDescending: Generated private key is out of bounds (${this.low} - ${this.high}). Resetting..`);
            this.currDescending = this.high;
        }

        // TODO
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
     * @param cache The cache to write the private key to (32 bytes).
     */
    execute = (cache: Cache): void => this.executeEndpoint(cache);
}