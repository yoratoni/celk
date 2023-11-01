/* eslint-disable @typescript-eslint/no-loss-of-precision */


/**
 * **This is only a PRNG and should not be used for cryptographic purposes.**
 *
 * Implements useful functions for generating random numbers & arrays.
 */
class Randomizer {
    /**
     * Generates a random uint8 number from Math.random().
     * @returns A random uint8 number.
     */
    static generateRandomUint8(): u8 {
        return <u8>(Math.random() * <f64>u8.MAX_VALUE);
    }

    /**
     * Generates a random uint16 number from Math.random().
     * @returns A random uint16 number.
     */
    static generateRandomUint16(): u16 {
        return <u16>(Math.random() * <f64>u16.MAX_VALUE);
    }

    /**
     * Generates a random uint32 number from Math.random().
     * @returns A random uint32 number.
     */
    static generateRandomUint32(): u32 {
        return <u32>(Math.random() * <f64>u32.MAX_VALUE);
    }

    /**
     * Generates a random uint64 number from Math.random().
     * @returns A random uint64 number.
     */
    static generateRandomUint64(): u64 {
        return <u64>(Math.random() * <f64>u64.MAX_VALUE);
    }
}

/**
 * Loads an Uint8Array with random numbers.
 * @param array The array to load.
 * @returns The loaded array.
 */
export function randomFillUint8Array(array: Uint8Array): Uint8Array {
    for (let i = 0; i < array.length; i++) {
        array[i] = Randomizer.generateRandomUint8();
    }

    return array;
}

/**
 * Generates an Uint8Array with random numbers.
 * @param length The length of the array.
 * @returns The generated array.
 */
export function generateRandomUint8Array(length: i32): Uint8Array {
    const array = new Uint8Array(length);
    return randomFillUint8Array(array);
}

/**
 * Loads an Uint16Array with random numbers.
 * @param array The array to load.
 * @returns The loaded array.
 */
export function randomFillUint16Array(array: Uint16Array): Uint16Array {
    for (let i = 0; i < array.length; i++) {
        array[i] = Randomizer.generateRandomUint16();
    }

    return array;
}

/**
 * Generates an Uint16Array with random numbers.
 * @param length The length of the array.
 * @returns The generated array.
 */
export function generateRandomUint16Array(length: i32): Uint16Array {
    const array = new Uint16Array(length);
    return randomFillUint16Array(array);
}

/**
 * Loads an Uint32Array with random numbers.
 * @param array The array to load.
 * @returns The loaded array.
 */
export function randomFillUint32Array(array: Uint32Array): Uint32Array {
    for (let i = 0; i < array.length; i++) {
        array[i] = Randomizer.generateRandomUint32();
    }

    return array;
}

/**
 * Generates an Uint32Array with random numbers.
 * @param length The length of the array.
 * @returns The generated array.
 */
export function generateRandomUint32Array(length: i32): Uint32Array {
    const array = new Uint32Array(length);
    return randomFillUint32Array(array);
}

/**
 * Loads an Uint64Array with random numbers.
 * @param array The array to load.
 * @returns The loaded array.
 */
export function randomFillUint64Array(array: Uint64Array): Uint64Array {
    for (let i = 0; i < array.length; i++) {
        array[i] = Randomizer.generateRandomUint64();
    }

    return array;
}

/**
 * Generates an Uint64Array with random numbers.
 * @param length The length of the array.
 * @returns The generated array.
 */
export function generateRandomUint64Array(length: i32): Uint64Array {
    const array = new Uint64Array(length);
    return randomFillUint64Array(array);
}