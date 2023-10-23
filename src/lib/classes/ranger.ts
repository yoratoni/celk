import { randomFillSync } from "crypto";

import logger from "utils/logger";


/**
 * Used to generate a private key between a given range.
 */
export default class Ranger {
    private low: bigint;
    private high: bigint;

    private currAscending: bigint;
    private currDescending: bigint;

    // Full random buffer
    private tmpBuffer: Buffer = Buffer.alloc(4096);  // Best performance with 4096
    private tmpBufferIndex: number = 0;


    /**
     * Construct a new Ranger (Bitcoin private key generator).
     * @param low The low range to generate the private key from.
     * @param high The high range to generate the private key from.
     */
    constructor(low: bigint, high: bigint) {
        this.low = low;
        this.high = high;

        this.currAscending = this.low;
        this.currDescending = this.high;

        // Fill the buffer with random data
        randomFillSync(this.tmpBuffer);
    }


    /**
     * **[FULL RANDOM]** Generate a private key between a given range (defined in the constructor).
     * @returns The private key.
     */
    executeFullRandom = (): bigint => {
        if (this.tmpBufferIndex >= 4096 - 1) {
            randomFillSync(this.tmpBuffer);
            this.tmpBufferIndex = 0;
        }

        this.tmpBufferIndex += 32;
        return BigInt(`0x${this.tmpBuffer.subarray(this.tmpBufferIndex - 32, this.tmpBufferIndex - 1).toString("hex")}`) % (this.high - this.low) + this.low;
    };

    /**
     * **[ASCENDING]** Generate a private key between a given range (defined in the constructor).
     * @returns The private key.
     */
    executeAscending = (): bigint => {
        if (this.currAscending > this.high) {
            logger.warn(`Generated private key is out of bounds (${this.low} - ${this.high}). Resetting..`);
            this.currAscending = this.low;
        }

        return this.currAscending++;
    };

    /**
     * **[DESCENDING]** Generate a private key between a given range (defined in the constructor).
     * @returns The private key.
     */
    executeDescending = (): bigint => {
        if (this.currDescending < this.low) {
            logger.warn(`Generated private key is out of bounds (${this.low} - ${this.high}). Resetting..`);
            this.currDescending = this.high;
        }

        return this.currDescending--;
    };
}