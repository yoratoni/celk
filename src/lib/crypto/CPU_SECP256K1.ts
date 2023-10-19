/*
 * A CPU TypeScript implementation of the Elliptic Curve, SECP256K1, as defined in SEC 2.
 *
 * Based on the "Learning fast elliptic-curve cryptography" explanation from "Paul Miller".
 *   See https://paulmillr.com/posts/noble-secp256k1-fast-ecc/
 *   Also https://github.com/paulmillr/noble-secp256k1/blob/main/index.ts
 * And the TS implementation from Hanabi1224.
 *   See https://github.com/hanabi1224/Programming-Language-Benchmarks/blob/main/bench/algorithm/secp256k1/1.ts
 */

import { CURVE, Point } from "lib/crypto/lib/LIB_CPU_SECP256K1";


export default class CPU_SECP256K1_ENGINE {
    private readonly G = new Point(CURVE.Gx, CURVE.Gy);


    /**
     * Construct a new SECP256K1 engine.
     */
    constructor() {}


    /**
     * Execute the SECP256K1 algorithm.
     * @param privateKey The private key.
     */
    secp256k1 = (privateKey: bigint) => {
        const point = this.G.multiply(privateKey);
        return BigInt(`${point.x}${point.y}`);
    };
}