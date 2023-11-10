/**
 * Safely add two Uint32 together.
 * @param x The first number to add.
 * @param y The second number to add.
 * @returns The sum of the two numbers.
 */
export function safeAdd(x: usize, y: usize): usize {
    const lsb = (x & 0xFFFF) + (y & 0xFFFF);
    const msb = (x >>> 16) + (y >>> 16) + (lsb >>> 16);

    return (msb << 16) | (lsb & 0xFFFF);
}