// A library for all non-category specific functions.


/**
 * Insert a string into another string at a specific index.
 * @param str The string to insert into.
 * @param index The index to insert the string at.
 * @param value The string to insert.
 * @returns The new string.
 */
export function strInsert(str: string, index: number, value: string) {
    return str.substring(0, index) + value + str.substring(index);
}