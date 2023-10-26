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
 */
export const formatUnitPerTimeUnit = (
    nb: number, unit = "K",
    timeUnit: string | null = "s",
    padding = 12
): string => {
    const strUnit = timeUnit ? `${unit}/${timeUnit}` : unit;

    // T = tera
    if (nb >= Math.pow(10, 12)) {
        return `${(Math.round(nb / Math.pow(10, 12))).toLocaleString(
            "en-US",
            { minimumFractionDigits: 2, maximumFractionDigits: 2 }
        )} T${strUnit}`.padStart(padding, " ");
    }

    // G = giga
    if (nb >= Math.pow(10, 9)) {
        return `${(Math.round(nb / Math.pow(10, 9))).toLocaleString(
            "en-US",
            { minimumFractionDigits: 2, maximumFractionDigits: 2 }
        )} G${strUnit}`.padStart(padding, " ");
    }

    // M = mega
    if (nb >= Math.pow(10, 6)) {
        return `${(nb / Math.pow(10, 6)).toLocaleString(
            "en-US",
            { minimumFractionDigits: 2, maximumFractionDigits: 2 }
        )} M${strUnit}`.padStart(padding, " ");
    }

    // k = kilo
    if (nb >= Math.pow(10, 3)) {
        return `${(nb / Math.pow(10, 3)).toLocaleString(
            "en-US",
            { minimumFractionDigits: 2, maximumFractionDigits: 2 }
        )} k${strUnit}`.padStart(padding, " ");
    }

    return `${Math.round(nb).toLocaleString(
        "en-US",
        { minimumFractionDigits: 2, maximumFractionDigits: 2 }
    )} ${strUnit}`.padStart(padding, " ");
};

/**
 * Format a high-resolution time, into a responsive string with the en-US locale format.
 * @param hrtime The hrtime in nanoseconds.
 * @returns The formatted string.
 */
export const formatHRTime = (
    hrtime: bigint
): string => {
    const padding = 10;

    // Seconds
    if (hrtime >= 1_000_000_000_000n) {
        return `${(Number(hrtime) / 1_000_000_000).toLocaleString("en-US", {
            minimumFractionDigits: 3,
            maximumFractionDigits: 3
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
            minimumFractionDigits: 1,
            maximumFractionDigits: 1
        })}µs`.padStart(padding, " ");
    }

    // Nanoseconds
    return `${hrtime.toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    })}ns`.padStart(padding, " ");
};

/**
 * Format a duration in the format: "xxxx:xx:xx:xx".
 * @param duration the duration to format (in ms).
 * @returns The formatted string.
 */
export const formatDuration = (duration: number): string => {
    let seconds = Math.floor((duration) / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    hours = hours - (days * 24);
    minutes = minutes - (days * 24 * 60) - (hours * 60);
    seconds = seconds - (days * 24 * 60 * 60) - (hours * 60 * 60) - (minutes * 60);

    return `${days.toString().padStart(2, "0")
    }:${hours.toString().padStart(2, "0")
    }:${minutes.toString().padStart(2, "0")
    }:${seconds.toString().padStart(2, "0")}`;
};