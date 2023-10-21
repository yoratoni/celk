/**
 * Used to generate a private key between a given range.
 */
export default class Ranger {
    private low: bigint;
    private lowLength: number;

    private high: bigint;
    private highLength: number;

    private zeroPadding: `0x${string}`;

    private readonly HEX = "0123456789ABCDEF";


    /**
     * Construct a new Ranger (Bitcoin private key generator).
     * @param low The low range to generate the private key from.
     * @param high The high range to generate the private key from.
     */
    constructor(low: bigint, high: bigint) {
        this.low = low;
        this.lowLength = this.low.toString(16).length;

        this.high = high;
        this.highLength = this.high.toString(16).length;

        // Calculate the zero padding for the private key
        this.zeroPadding = "0x".padEnd(66 - this.highLength, "0") as `0x${string}`;
    }


    /**
     * **[FULL RANDOM]** Generate a private key between a given range (defined in the constructor).
     * @returns The private key.
     */
    executeFullRandom = (): `0x${string}` => {
        let privateKey = this.zeroPadding;

        for (let i = 0; i < this.highLength; i++) {
            privateKey += this.HEX[Math.floor(Math.random() * 16)];
        }

        // Check if the generated private key is in the range
        if (BigInt(privateKey) < this.low || BigInt(privateKey) > this.high) {
            return this.executeFullRandom();
        }

        return privateKey as `0x${string}`;
    };
}