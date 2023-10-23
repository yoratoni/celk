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
 */
export const formatUnitPerTimeUnit = (nb: number, unit = "k", timeUnit: string | null = "s"): string => {
    const padding = 11;
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

    // K = kilo
    if (nb >= Math.pow(10, 3)) {
        return `${(nb / Math.pow(10, 3)).toLocaleString(
            "en-US",
            { minimumFractionDigits: 2, maximumFractionDigits: 2 }
        )} K${strUnit}`.padStart(padding, " ");
    }

    return `${Math.round(nb).toLocaleString(
        "en-US",
        { minimumFractionDigits: 2, maximumFractionDigits: 2 }
    )} ${strUnit}`.padStart(padding, " ");
};

/**
 * Format a time in ms, into a responsive string with the en-US locale format.
 * @param time The time in ms.
 * @param decimalsForSeconds The number of decimals to use for seconds (optional, defaults to 2).
 * @param decimalsForMilliseconds The number of decimals to use for milliseconds (optional, defaults to 3).
 * @param decimalsForMicroseconds The number of decimals to use for microseconds (optional, defaults to 3).
 * @returns The formatted string.
 */
export const formatTime = (
    time: number,
    decimalsForSeconds = 2,
    decimalsForMilliseconds = 3,
    decimalsForMicroseconds = 0
): string => {
    const padding = 11;

    // Seconds
    if (time >= 1000) {
        return `${(time / 1000).toLocaleString("en-US", {
            minimumFractionDigits: decimalsForSeconds,
            maximumFractionDigits: decimalsForSeconds
        })}s`.padStart(padding, " ");
    }

    // Milliseconds
    if (time >= 1) {
        return `${time.toLocaleString("en-US", {
            minimumFractionDigits: decimalsForMilliseconds,
            maximumFractionDigits: decimalsForMilliseconds
        })}ms`.padStart(padding, " ");
    }

    // Microseconds
    return `${(time * 1000).toLocaleString("en-US", {
        minimumFractionDigits: decimalsForMicroseconds,
        maximumFractionDigits: decimalsForMicroseconds
    })}μs`.padStart(padding, " ");
};

/**
 * Format a timestamp in the format: "xxxx:xx:xx:xx".
 * @param timestamp the timestamp to format (in ms).
 * @returns The formatted string.
 */
export const formatTimestamp = (timestamp: number): string => {
    let seconds = Math.floor((timestamp) / 1000);
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