/*
 * A CPU TypeScript implementation of the RIPE Message Digest, RIPEMD-160, as defined in "The hash function RIPEMD-160".

 * Based on the "The hash function RIPEMD-160" documents.
 *   See https://homes.esat.kuleuven.be/~bosselae/ripemd160.html
 *   And https://homes.esat.kuleuven.be/~bosselae/ripemd160/pdf/AB-9601/AB-9601.pdf
 * And the TS implementation by Paul Miller.
 *   See https://github.com/paulmillr/noble-hashes/blob/main/src/ripemd160.ts
 */


export default class CPU_RIPEMD160_ENGINE {
    private hexCase: boolean;
    private b64pad: string;
    private utf8: boolean;

    private readonly R1 = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
        7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8,
        3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12,
        1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2,
        4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13
    ];
    private readonly R2 = [
        5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12,
        6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2,
        15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13,
        8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14,
        12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11
    ];
    private readonly S1 = [
        11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8,
        7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12,
        11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5,
        11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12,
        9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6
    ];
    private readonly S2 = [
        8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6,
        9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11,
        9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5,
        15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8,
        8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11
    ];


    /**
     * Construct a new CPU RIPEMD-160 engine.
     */
    constructor() {
        this.hexCase = true;
        this.b64pad = "=";
        this.utf8 = true;
    }


    /**
     * Special algorithmic function "F" required for RIPEMD-160 computation.
     * @param j The number to apply the logic to.
     * @param x Logical X.
     * @param y Logical Y.
     * @param z Logical Z.
     * @returns The result of the logic.
     */
    private F(j: number, x: number, y: number, z: number): number {
        const res = (0 <= j && j <= 15) ? (x ^ y ^ z) :
            (16 <= j && j <= 31) ? (x & y) | (~x & z) :
                (32 <= j && j <= 47) ? (x | ~y) ^ z :
                    (48 <= j && j <= 63) ? (x & z) | (y & ~z) :
                        (64 <= j && j <= 79) ? x ^ (y | ~z) :
                            "ERROR";

        if (res === "ERROR") {
            throw new Error("[CPU_RIPEMD160] F: j is out of range.");
        }

        return res;
    }
}