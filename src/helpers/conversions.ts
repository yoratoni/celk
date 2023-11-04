import Cache from "helpers/cache";
import BASE58_ENGINE from "lib/crypto/encoders/BASE58";


/**
 * Converts a Bitcoin address to its RIPEMD-160 hash (Cache).
 * @param address The Bitcoin address.
 * @returns The RIPEMD-160 hash.
 */
export const addressToRIPEMD160 = (address: string): Cache => {
    const base58Engine = new BASE58_ENGINE();

    // Decode the BASE58 address
    const decoded = base58Engine.decode(address);

    // Extract the RIPEMD-160 hash (Remove the network byte and checksum)
    return decoded.subarray(1, 21);
};