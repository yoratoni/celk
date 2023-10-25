/**
 * A TypeScript implementation of the Elliptic Curve, SECP256K1, as defined in SEC 2.
 */
export default class SECP256K1_ENGINE {
    /**
     * Construct a new SECP256K1 engine.
     */
    constructor() {

    }


    /**
     * Execute the SECP256K1 algorithm (uncompressed key - 65 bytes).
     * @param cache The buffer cache to use (input & output).
     * @param privateKey The private key.
     * @param privateKey The private key as a buffer.
     */
    executeUncompressed = (cache: Buffer, privateKey: bigint): void => {

    };

    /**
     * Execute the SECP256K1 algorithm (compressed key - 33 bytes).
     * @param cache The buffer cache to use (input & output).
     * @param privateKey The private key as a buffer.
     */
    executeCompressed = (cache: Buffer, privateKey: bigint): void => {

    };
}