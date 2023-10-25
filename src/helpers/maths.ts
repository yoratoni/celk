import { strInsert } from "utils/formats";
import logger from "utils/logger";


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
    const len = input.toString().length;
    return 10n ** BigInt(len + incr);
};

/**
 * Bigint division with decimal point at a specific precision (truncates the result).
 * @param numerator The numerator.
 * @param denominator The denominator.
 * @param precision The precision (optional, defaults to 2).
 * @returns An object with the result as a float (limited in precision) and as a string (unlimited precision).
 */
export const bigIntDiv = (numerator: bigint, denominator: bigint, precision = 2): {
    result: number;
    str: string
} => {
    if (precision > 15) {
        logger.warn("Precision cannot be greater than 15. Using 15 instead.");
        precision = 15;
    }

    // Get the percentage with no decimal point
    const percentageWithNoDP = (numerator * bigIntToTenPow(denominator, precision)) / denominator;
    const percentageWithNoDPStr = percentageWithNoDP.toString();

    // Get the position of the decimal point
    const pos = (bigIntLength(denominator) - percentageWithNoDPStr.length + precision);

    let percentageStr = "";

    // Notes:
    // - If pos < 0, result is >= 1
    // - If pos >= 0, result is < 1

    if (pos < 0) {
        // Insert the decimal point at the right position
        percentageStr = strInsert(percentageWithNoDPStr, Math.abs(pos), ".");

        // Trim the amount of decimals to the precision after the decimal point
        percentageStr = percentageStr.substring(0, percentageStr.indexOf(".") + precision + 1);
    } else {
        // Prevents to have "0." as a result when precision is 0
        if (precision === 0) {
            percentageStr = "0";
        } else {
            // Pad the decimal point with zeros
            percentageStr = `0.${"".padEnd(pos, "0")}${percentageWithNoDP.toString()}`;
        }
    }

    return {
        result: Number(percentageStr),
        str: percentageStr
    };
};