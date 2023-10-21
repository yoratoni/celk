// A library for maths.


import { strInsert } from "utils/others";


/**
 * Equivalent to `Math.pow` for bigints.
 */
export const bigIntPow = (base: bigint, exponent: bigint) => base ** exponent;

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

/**
 * Generates a formatted percentage from bigints (including decimal point).
 * @param numerator The numerator.
 * @param denominator The denominator.
 * @param precision The precision (optional, defaults to 2).
 * @returns The formatted percentage.
 */
export const bigIntToPercentage = (numerator: bigint, denominator: bigint, precision = 2): string => {
    const percentage = Number((numerator * bigIntToTenPow(denominator, precision)) / denominator);
    const decimalPointPadding = denominator.toString().length - percentage.toString().length - 1;

    // Format it depending on decimal point position
    let percentageStr = "";

    if (decimalPointPadding >= 0) {
        // Pad the decimal point with zeros
        percentageStr = `0.${"".padEnd(decimalPointPadding, "0")}${percentage}`;
    } else {
        // Insert the decimal point at the right position
        percentageStr = strInsert(percentage.toString(), decimalPointPadding * -1, ".");

        // Add trailing spaces to match "100.00%" length
        percentageStr = percentageStr.padStart(6, " ");
    }

    return percentageStr;
};