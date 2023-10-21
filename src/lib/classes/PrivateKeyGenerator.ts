/**
 * Private key generator class which is used to generate a private key between a given range.
 */
export default class PrivateKeyGenerator {
    /**
     * Generate a private key between a given range.
     * @param low The lower bound of the range.
     * @param high The upper bound of the range.
     * @returns The private key.
     */
    execute = (low: number, high: number): `0x${string}` => {
        const privateKey = Math.floor(Math.random() * (high - low + 1) + low).toString(16);

        return `0x${privateKey}`;
    };
}