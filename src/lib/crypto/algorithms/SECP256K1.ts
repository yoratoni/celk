import secp256k1 from "secp256k1";

import { IsMemorySlot } from "constants/memory";
import Cache from "helpers/cache";
import General from "types/general";


/**
 * For now, this is only a wrapper around the secp256k1 library (secp256k1 binding module).
 * I'll implement the actual algorithm myself later, maybe by using GPU computing or AssemblyScript.
 */
export default class SECP256K1_ENGINE {
    // Endpoint to generate the public key based on the current mode
    private executeEndpoint: (cache: Cache, slot: IsMemorySlot) => void;


    /**
     * Construct a new SECP256K1 engine.
     * @param publicKeyGenMode The public key generation mode (compressed or uncompressed).
     */
    constructor(publicKeyGenMode: General.IsPublicKeyGenMode) {
        switch (publicKeyGenMode) {
            case "UNCOMPRESSED":
                this.executeEndpoint = this.executeUncompressed;
                break;
            case "COMPRESSED":
                this.executeEndpoint = this.executeCompressed;
                break;
            default:
                throw new Error(`[SECP256K1] Invalid public key generation mode: '${publicKeyGenMode}'`);
        }
    }


    /**
     * Execute the SECP256K1 algorithm (uncompressed key - 65 bytes).
     * @param cache The cache to use (input & output).
     * @param slot The memory slot to write to.
     */
    private executeUncompressed = (cache: Cache, slot: IsMemorySlot): void => {
        // eslint-disable-next-line import/no-named-as-default-member
        const publicKey = secp256k1.publicKeyCreate(cache.subarray(slot.readFrom.offset, slot.readFrom.end), false);

        // Write to the cache
        cache.writeUint8Array(publicKey, slot.writeTo.offset, slot.writeTo.bytes);
    };

    /**
     * Execute the SECP256K1 algorithm (compressed key - 33 bytes).
     * @param cache The cache to use (input & output).
     * @param slot The memory slot to write to.
     */
    private executeCompressed = (cache: Cache, slot: IsMemorySlot): void => {
        // eslint-disable-next-line import/no-named-as-default-member
        const publicKey = secp256k1.publicKeyCreate(cache.subarray(slot.readFrom.offset, slot.readFrom.end), true);

        // Write to the cache
        cache.writeUint8Array(publicKey, slot.writeTo.offset, slot.writeTo.bytes);
    };

    /**
     * Change the public key generation mode.
     * @param publicKeyGenMode The new public key generation mode (compressed or uncompressed).
     */
    setPublicKeyGenMode = (publicKeyGenMode: General.IsPublicKeyGenMode): void => {
        switch (publicKeyGenMode) {
            case "UNCOMPRESSED":
                this.executeEndpoint = this.executeUncompressed;
                break;
            case "COMPRESSED":
                this.executeEndpoint = this.executeCompressed;
                break;
            default:
                throw new Error(`[SECP256K1] Invalid SECP256K1 generation mode: '${publicKeyGenMode}'`);
        }
    };

    /**
     * Main endpoint to execute the SECP256K1 algorithm (defined in the constructor).
     * @param cache The cache to use (input & output).
     * @param slot The memory slot to write to.
     */
    execute = (cache: Cache, slot: IsMemorySlot): void => this.executeEndpoint(cache, slot);
}