/*
 * A CPU TypeScript implementation of the RIPE Message Digest, RIPEMD-160, as defined in "The hash function RIPEMD-160".

 * Based on the "The hash function RIPEMD-160" documents.
 *   See https://homes.esat.kuleuven.be/~bosselae/ripemd160.html
 *   And https://homes.esat.kuleuven.be/~bosselae/ripemd160/pdf/AB-9601/AB-9601.pdf
 * And the TS implementation by Paul Miller.
 *   See https://github.com/paulmillr/noble-hashes/blob/main/src/ripemd160.ts
 */


export default class CPU_RIPEMD160_ENGINE {
    private readonly shifts = [
        [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
        [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
        [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
        [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
        [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
    ].map((i) => new Uint8Array(i));

    private readonly Rho = [7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8];
    private readonly Id = Uint8Array.from({ length: 16 }, (_, i) => i);
    private readonly Pi = this.Id.map((i) => (9 * i + 5) % 16);
    private readonly idxL = [this.Id];
    private readonly idxR = [this.Pi];
    private readonly shiftsL = this.idxL.map((idx, i) => idx.map((j) => this.shifts[i][j]));
    private readonly shiftsR = this.idxR.map((idx, i) => idx.map((j) => this.shifts[i][j]));
    private readonly Kl = new Uint32Array([0x00000000, 0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xa953fd4e]);
    private readonly Kr = new Uint32Array([0x50a28be6, 0x5c4dd124, 0x6d703ef3, 0x7a6d76e9, 0x00000000]);

    private h0 = 0x67452301 | 0;
    private h1 = 0xefcdab89 | 0;
    private h2 = 0x98badcfe | 0;
    private h3 = 0x10325476 | 0;
    private h4 = 0xc3d2e1f0 | 0;

    // Temporary buffer for the hash computation
    private buffer = new Uint8Array(16);


    /**
     * Construct a new CPU RIPEMD-160 engine.
     */
    constructor() {
        for (let i = 0; i < 4; i++) {
            for (const j of [this.idxL, this.idxR]) {
                j.push(
                    j[i].map((k) => this.Rho[k])
                );
            }
        }
    }


    /**
     * Perform the "circular left shift" (CLS) operation, needed for the hash computation.
     * @param x The number to shift.
     * @param n The number of bits to shift.
     * @returns The shifted number.
     */
    private CSR = (x: number, n: number): number => (x << n) | (x >>> (32 - n));

    /**
     * Get
     * @returns 
     */
    protected get(): [number, number, number, number, number] {
        const { h0, h1, h2, h3, h4 } = this;
        return [h0, h1, h2, h3, h4];
    }
}