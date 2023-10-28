/**
 * Converts a bigint to a prefixed private key string (64 characters).
 * @param bigint The bigint to convert.
 * @returns The prefixed private key string.
 */
export const bigintToPrivateKey = (bigint: bigint): `0x${string}` => `0x${bigint.toString(16).padStart(64, "0")}`;

/**
 * Insert a string into another string at a specific index.
 * @param str The string to insert into.
 * @param index The index to insert the string at.
 * @param value The string to insert.
 * @returns The new string.
 */
export const strInsert = (str: string, index: number, value: string): string => str.substring(0, index) + value + str.substring(index);

/**
 * Format a number on a unit per time unit basis.
 *
 * Note: the time unit can be set to null to only display the unit.
 * @param nb The number to format.
 * @param unit The unit to use (optional, defaults to "k" for keys).
 * @param timeUnit The time unit to use (optional, defaults to "s" for seconds).
 * @param padding The padding to use (optional, defaults to 12).
 * @param addSpaceBeforeUnit Whether to add a space before the unit (optional, defaults to false).
 */
export const formatUnitPerTimeUnit = (
    nb: number,
    unit: string | null = "K",
    timeUnit: string | null = "s",
    padding = 12,
    addSpaceBeforeUnit = false
): string => {
    let strUnit: string;

    if (typeof unit === "string" && typeof timeUnit === "string") {
        strUnit = `${unit}/${timeUnit}`;
    } else if (typeof unit === "string") {
        strUnit = unit;
    } else {
        strUnit = "";
    }

    // Add a space before the unit if needed
    const spaceOrNot = addSpaceBeforeUnit ? " " : "";

    // E = exa
    if (nb >= Math.pow(10, 18)) {
        return `${(Math.round(nb / Math.pow(10, 18))).toLocaleString(
            "en-US",
            { minimumFractionDigits: 2, maximumFractionDigits: 2 }
        )}${spaceOrNot}E${strUnit}`.padStart(padding, " ");
    }

    // P = peta
    if (nb >= Math.pow(10, 15)) {
        return `${(Math.round(nb / Math.pow(10, 15))).toLocaleString(
            "en-US",
            { minimumFractionDigits: 2, maximumFractionDigits: 2 }
        )}${spaceOrNot}P${strUnit}`.padStart(padding, " ");
    }

    // T = tera
    if (nb >= Math.pow(10, 12)) {
        return `${(Math.round(nb / Math.pow(10, 12))).toLocaleString(
            "en-US",
            { minimumFractionDigits: 2, maximumFractionDigits: 2 }
        )}${spaceOrNot}T${strUnit}`.padStart(padding, " ");
    }

    // G = giga
    if (nb >= Math.pow(10, 9)) {
        return `${(Math.round(nb / Math.pow(10, 9))).toLocaleString(
            "en-US",
            { minimumFractionDigits: 2, maximumFractionDigits: 2 }
        )}${spaceOrNot}G${strUnit}`.padStart(padding, " ");
    }

    // M = mega
    if (nb >= Math.pow(10, 6)) {
        return `${(nb / Math.pow(10, 6)).toLocaleString(
            "en-US",
            { minimumFractionDigits: 2, maximumFractionDigits: 2 }
        )}${spaceOrNot}M${strUnit}`.padStart(padding, " ");
    }

    // k = kilo
    if (nb >= Math.pow(10, 3)) {
        return `${(nb / Math.pow(10, 3)).toLocaleString(
            "en-US",
            { minimumFractionDigits: 2, maximumFractionDigits: 2 }
        )}${spaceOrNot}k${strUnit}`.padStart(padding, " ");
    }

    return `${Math.round(nb).toLocaleString(
        "en-US",
        { minimumFractionDigits: 2, maximumFractionDigits: 2 }
    )}${spaceOrNot}${strUnit}`.padStart(padding, " ");
};

/**
 * Format a high-resolution time, into a responsive string with the en-US locale format.
 * @param hrtime The hrtime in nanoseconds.
 * @returns The formatted string.
 */
export const formatHRTime = (
    hrtime: bigint | number
): string => {
    const padding = 10;

    // Hours
    if (hrtime >= 3_600_000_000_000_000n) {
        return `${(Number(hrtime) / 3_600_000_000_000_000).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}h`.padStart(padding, " ");
    }

    // Minutes
    if (hrtime >= 60_000_000_000n) {
        return `${(Number(hrtime) / 60_000_000_000).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}m`.padStart(padding, " ");
    }

    // Seconds
    if (hrtime >= 1_000_000_000n) {
        return `${(Number(hrtime) / 1_000_000_000).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}s`.padStart(padding, " ");
    }

    // Milliseconds
    if (hrtime >= 1_000_000n) {
        return `${(Number(hrtime) / 1_000_000).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}ms`.padStart(padding, " ");
    }

    // Microseconds
    if (hrtime >= 1000n) {
        return `${(Number(hrtime) / 1000).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}µs`.padStart(padding, " ");
    }

    // Nanoseconds
    return `${hrtime.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}ns`.padStart(padding, " ");
};