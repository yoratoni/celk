// A library for maths.

/**
 * Get the length of a bigint.
 * @param input The bigint to get the length of.
 * @param radix The radix to use (optional, defaults to 10).
 * @returns The length of the bigint.
 */
export const bigIntLength = (input: bigint, radix?: number): number => input.toString(radix).length;

/**
 * Equivalent to `Math.pow` for bigints.
 * @param base The base.
 * @param exponent The exponent.
 * @returns The result of the power.
 */
export const bigIntPow = (base: bigint, exponent: bigint): bigint => base ** exponent;

/**
 * Converts a bigint into its power of 10.
 * @param input The bigint to convert.
 * @param incr The increment to add to the power of 10 (optional, defaults to 0).
 * @returns The power of 10.
 */
export const bigIntToTenPow = (input: bigint, incr = 0): bigint => {
    const len = input.toString().length - 1;
    return 10n ** BigInt(len + incr);
};