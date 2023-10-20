/**
 * [Official parameters](https://www.secg.org/sec2-v2.pdf):
 * Page 9, section 2.4.1.
 */
const CURVE = {
    a: 0n,
    b: 7n,
    P: 2n ** 256n - 2n ** 32n - 977n,
    n: 2n ** 256n - 432420386565659656852420866394968145599n,
    Gx: 55066263022277343669578718895168534326250603453777594175500187360389116729240n,
    Gy: 32670510020758816978083085130507043184471273380659243275938904335757337482424n,
    beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
};

// Constants
const POW_2_128 = 2n ** BigInt(128);

/**
 * Modular addition.
 * @param a The first number.
 * @param b The second number (optional, defaults to CURVE.P).
 * @returns The sum.
 */
function mod(a: bigint, b = CURVE.P): bigint {
    const result = a % b;

    return result >= 0 ? result : b + result;
}

/**
 * Inverse number over modulo.
 * @param number The number.
 * @param modulo The modulo  (optional, defaults to CURVE.P).
 * @returns The inverse.
 */
function invert(number: bigint, modulo = CURVE.P): bigint {
    if (number === 0n || modulo <= 0n) {
        throw new Error(`[SECP256K1] invert: Expected positive integers, got n=${number} mod=${modulo}.`);
    }

    // Euclidean GCD
    // See https://brilliant.org/wiki/extended-euclidean-algorithm/
    let a = mod(number, modulo);
    let b = modulo;
    let [x, y, u, v] = [0n, 1n, 1n, 0n];

    while (a !== 0n) {
        const q = b / a;
        const r = b % a;
        const m = x - u * q;
        const n = y - v * q;

        [b, a] = [a, r];
        [x, y] = [u, v];
        [u, v] = [m, n];
    }

    const gcd = b;
    if (gcd !== 1n) throw new Error("[SECP256K1] invert: Does not exist.");

    return mod(x, modulo);
}

/**
 * Check if the number is within the curve order.
 * @param num The number.
 * @returns Whether the number is within the curve order.
 */
function isWithinCurveOrder(num: bigint): boolean {
    return 0 < num && num < CURVE.n;
}

/**
 * Normalizes the scalar.
 * @param num The number.
 * @returns The normalized scalar.
 */
function normalizeScalar(num: number | bigint): bigint {
    if (typeof num === "number" && num > 0 && Number.isSafeInteger(num)) return BigInt(num);
    if (typeof num === "bigint" && isWithinCurveOrder(num)) return num;

    throw new TypeError("[SECP256K1] normalizeScalar: Expected valid private scalar: 0 < scalar < curve.n.");
}

/**
 * Divides two numbers and rounds the result to the nearest integer.
 * @param a The first number.
 * @param b The second number.
 */
function divNearest(a: bigint, b: bigint): bigint {
    return (a + b / 2n) / b;
}

/**
 * Split 256-bit K into 2 128-bit (k1, k2) for which k1 + k2 * lambda = K.
 * @link [SECP256K1 Endomorphism](https://gist.github.com/paulmillr/eb670806793e84df628a7c434a873066).
 */
function splitScalarEndo(k: bigint): {
    k1neg: boolean;
    k1: bigint;
    k2neg: boolean;
    k2: bigint;
} {
    const { n } = CURVE;

    const a1 = BigInt("0x3086d221a7d46bcde86c90e49284eb15");
    const b1 = -1n * BigInt("0xe4437ed6010e88286f547fa90abfe4c3");
    const a2 = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8");
    const b2 = a1;
    const c1 = divNearest(b2 * k, n);
    const c2 = divNearest(-b1 * k, n);

    let k1 = mod(k - c1 * a1 - c2 * a2, n);
    let k2 = mod(-c1 * b1 - c2 * b2, n);

    const k1neg = k1 > POW_2_128;
    const k2neg = k2 > POW_2_128;
    if (k1neg) k1 = n - k1;
    if (k2neg) k2 = n - k2;

    if (k1 > POW_2_128 || k2 > POW_2_128) throw new Error("splitScalarEndo: Endomorphism failed");

    return { k1neg, k1, k2neg, k2 };
}

/**
 * Affine point integration.
 */
export class Point {
    // The point at infinity
    static ZERO = new Point(0n, 0n);

    // The generator point
    static BASE: Point = new Point(CURVE.Gx, CURVE.Gy);

    // The x and y coordinates of the point
    x: bigint;
    y: bigint;


    /**
     * Construct a new point.
     * @param x The x coordinate.
     * @param y The y coordinate.
     */
    constructor(x: bigint, y: bigint) {
        this.x = x;
        this.y = y;
    }


    multiply(scalar: bigint): Point {
        return JacobianPoint.fromAffine(this).multiplyUnsafe(scalar).toAffine();
    }
}

/**
 * Jacobian point integration.
 */
export class JacobianPoint {
    // The point at infinity
    static ZERO = new JacobianPoint(0n, 1n, 0n);

    // The generator point
    static BASE = new JacobianPoint(CURVE.Gx, CURVE.Gy, 1n);

    // The x, y, and z coordinates of the point
    x: bigint;
    y: bigint;
    z: bigint;


    /**
     * Construct a new Jacobian point.
     * @param x The x coordinate.
     * @param y The y coordinate.
     * @param z The z coordinate.
     */
    constructor(x: bigint, y: bigint, z: bigint) {
        this.x = x;
        this.y = y;
        this.z = z;
    }


    /**
     * Converts the Affine point to a Jacobian point.
     * @param p The Affine point.
     * @returns The Jacobian point.
     */
    static fromAffine(p: Point): JacobianPoint {
        return new JacobianPoint(p.x, p.y, 1n);
    }

    /**
     * Converts the Jacobian point to an Affine point.
     * @param invZ The inverse of the z coordinate.
     * @returns The Affine point.
     */
    toAffine(invZ: bigint = invert(this.z)): Point {
        const invZ2 = invZ ** 2n;
        const x = mod(this.x * invZ2);
        const y = mod(this.y * invZ * invZ2);
        return new Point(x, y);
    }

    /**
     * Flips point to one corresponding to (x, -y) in Affine coordinates.
     * @returns The flipped point.
     */
    negate(): JacobianPoint {
        return new JacobianPoint(this.x, mod(-this.y), this.z);
    }

    /**
     * Fast algo for doubling 2 Jacobian Points when curve's a=0.
     *
     * **NOTES**:
     * - Cannot be reused for other curves when a != 0.
     * - Cost: 2M + 5S + 6add + 3*2 + 1*3 + 1*8.
     *
     * @link [Jacobian coordinates with a4=0 for short Weierstrass curves](http://hyperelliptic.org/EFD/g1p/auto-shortw-jacobian-0.html#doubling-dbl-2009-l).
     */
    double(): JacobianPoint {
        const X1 = this.x;
        const Y1 = this.y;
        const Z1 = this.z;

        const A = mod(X1 ** 2n);
        const B = mod(Y1 ** 2n);
        const C = mod(B ** 2n);
        const D = mod(2n * (mod(mod((X1 + B) ** 2n)) - A - C));
        const E = mod(3n * A);
        const F = mod(E ** 2n);

        const X3 = mod(F - 2n * D);
        const Y3 = mod(E * (D - X3) - 8n * C);
        const Z3 = mod(2n * Y1 * Z1);

        return new JacobianPoint(X3, Y3, Z3);
    }

    /**
     * Fast algo for adding 2 Jacobian Points when curve's a=0.
     *
     * **NOTES**:
     * - Cannot be reused for other curves when a != 0.
     * - Cost: 12M + 4S + 6add + 1*2.
     * - 2007 Bernstein-Lange (11M + 5S + 9add + 4*2) is actually *slower*. No idea why.
     *
     * @link [Jacobian coordinates with a4=0 for short Weierstrass curves](http://hyperelliptic.org/EFD/g1p/auto-shortw-jacobian-0.html#addition-add-1998-cmo-2).
     */
    add(other: JacobianPoint): JacobianPoint {
        if (!(other instanceof JacobianPoint)) {
            throw new TypeError("[SECP256K1] JacobianPoint#add: expected JacobianPoint.");
        }

        const X1 = this.x;
        const Y1 = this.y;
        const Z1 = this.z;

        const X2 = other.x;
        const Y2 = other.y;
        const Z2 = other.z;

        if (X2 === 0n || Y2 === 0n) return this;
        if (X1 === 0n || Y1 === 0n) return other;

        const Z1Z1 = mod(Z1 ** 2n);
        const Z2Z2 = mod(Z2 ** 2n);

        const U1 = mod(X1 * Z2Z2);
        const U2 = mod(X2 * Z1Z1);

        const S1 = mod(Y1 * Z2 * Z2Z2);
        const S2 = mod(mod(Y2 * Z1) * Z1Z1);

        const H = mod(U2 - U1);
        const r = mod(S2 - S1);

        // H = 0 meaning it's the same point.
        if (H === 0n) {
            if (r === 0n) {
                return this.double();
            }

            return JacobianPoint.ZERO;
        }

        const HH = mod(H ** 2n);
        const HHH = mod(H * HH);
        const V = mod(U1 * HH);

        const X3 = mod(r ** 2n - HHH - 2n * V);
        const Y3 = mod(r * (V - X3) - S1 * HHH);
        const Z3 = mod(Z1 * Z2 * H);

        return new JacobianPoint(X3, Y3, Z3);
    }

    /**
      * Non-constant-time multiplication. Uses double-and-add algorithm.
      *
      * **WARNING**:
      * It's faster, but should only be used when you don't care about
      * an exposed private key e.g. sig verification, which works over *public* keys.
     */
    multiplyUnsafe(scalar: bigint): JacobianPoint {
        const n = normalizeScalar(scalar);

        const split = splitScalarEndo(n);
        const k1neg = split.k1neg;
        const k2neg = split.k2neg;
        let k1 = split.k1;
        let k2 = split.k2;

        let k1p = JacobianPoint.ZERO;
        let k2p = JacobianPoint.ZERO;

        // eslint-disable-next-line @typescript-eslint/no-this-alias
        let d: JacobianPoint = this;

        while (k1 > 0n || k2 > 0n) {
            if (k1 & 1n) k1p = k1p.add(d);
            if (k2 & 1n) k2p = k2p.add(d);
            d = d.double();
            k1 >>= 1n;
            k2 >>= 1n;
        }

        if (k1neg) k1p = k1p.negate();
        if (k2neg) k2p = k2p.negate();

        k2p = new JacobianPoint(mod(k2p.x * CURVE.beta), k2p.y, k2p.z);

        return k1p.add(k2p);
    }
}

/**
 * A TypeScript implementation of the Elliptic Curve, SECP256K1, as defined in SEC 2.
 *
 * Based on the "Learning fast elliptic-curve cryptography" explanation by "Paul Miller":
 *   - https://paulmillr.com/posts/noble-secp256k1-fast-ecc/
 *   - https://github.com/paulmillr/noble-secp256k1/blob/main/index.ts
 *
 * And the TS implementation by Hanabi1224:
 *   - https://github.com/hanabi1224/Programming-Language-Benchmarks/blob/main/bench/algorithm/secp256k1/1.ts
 */
export default class SECP256K1_ENGINE {
    private readonly G = new Point(CURVE.Gx, CURVE.Gy);


    /**
     * Construct a new SECP256K1 engine.
     */
    constructor() {}


    /**
     * Execute the SECP256K1 algorithm.
     * @param privateKey The private key.
     * @returns The public key.
     */
    execute = (privateKey: string): string => {
        const point = this.G.multiply(BigInt(privateKey));
        return `${point.x}${point.y}`;
    };
}